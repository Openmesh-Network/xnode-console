'use client'

import { AccountContext } from '@/contexts/AccountContext'
import { z } from 'zod'

/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useUser } from 'hooks/useUser'
import {
  ServiceFromName,
  ServiceOption,
} from '@/types/dataProvider'
import Signup from '@/components/Signup'
import { HeartbeatData, Xnode } from '../../types/node'

import Image from 'next/image'
import { useDraft } from '@/hooks/useDraftDeploy'
import Loading from '@/components/Loading'
import SectionHeader from '@/components/SectionHeader'
import ServiceEditor from '@/components/Deployments/serviceEditor'
import ServiceAccess from '@/components/Deployments/serviceAccess'
import { sshUserData } from '@/components/Deployments/serviceAccess'
import { ServiceData, XnodeConfig } from '@/types/dataProvider'
import { Button } from '@/components/ui/button'
import stackIcon from '@/assets/stack.svg'
import { optionsCreator } from '@/components/TemplateProducts/TemplateStep'
import { servicesCompressedForAdmin } from '@/utils/xnode'

type XnodePageProps = {
  searchParams: {
    uuid: string
  }
}

const XnodeMeasurement = ({ name, unit, isAvailable, used, available, usedPercent }: { used: number, available: number, usedPercent: number, unit: string, name: string, isAvailable: boolean }) => {

  const upperCaseFirstLetter = (str: string) => {

    let newStr = "";

    newStr += str[0].toUpperCase();
    newStr += str.slice(1, str.length);
    return newStr
  }

  return (
    <div className="flex-1">
      <p className="font-medium"> {upperCaseFirstLetter(name)} </p>
      <div className="flex w-full">
        { /* TODO: Add icon */}
        <div className="mr-2 size-10">
          <Image src={stackIcon} alt={"Stack icon"} />
        </div>

        <div className="flex min-h-5 flex-1 bg-gray-200 align-middle">

          {
            isAvailable ? (
              <>
                <div className="h-full bg-blue-500" style={{ width: usedPercent + "%" }}>
                </div>

                <div className="w-fit p-2">
                  <p> {available + unit + " "} left </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-fit p-2">
                  <p> No {name} data available. </p>
                </div>
              </>
            )
          }
        </div>
      </div>
      {
        isAvailable && (
          <p className="ml-12"> {used + unit} </p>
        )
      }
    </div>
  )
}

export default function XnodePage({ searchParams }: XnodePageProps) {
  const opensshconfig = {
    "nixName": "openssh",
    "options": [{ "nixName": "enable", "type": "boolean", "value": "true" }, { "nixName": "settings.PasswordAuthentication", "value": "false", "type": "boolean" }, { "nixName": "settings.KbdInteractiveAuthentication", "value": "false", "type": "boolean" }]
  }
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [xnodeData, setXnodeData] = useState<Xnode | undefined>(undefined)
  
  const id = z.coerce
    .string()
    .parse(String(searchParams.uuid))

  const [user] = useUser()
  const [services, setServices] = useState<ServiceData[]>([])
  const [userData, setUserData] = useState<ServiceData>(sshUserData("")) // Always relates to the xnode user for now.

  const [timeSinceHeartbeat, setTimeSinceHeartbeat] = useState<string>("")

  const getData = useCallback(async (isInitialLoad:Boolean) => {
    if (isInitialLoad) {
      setIsLoading(true)
    }

    if (user?.sessionToken) {
      const config = {
        method: 'post' as 'post',
        url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnode`,
        headers: {
          'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
          'X-Parse-Session-Token': user.sessionToken,
          'Content-Type': 'application/json',
        },
        data: {
          "id": id
        }
      }
      try {
        const response = await axios(config);
        // console.log("Got response: ", response)

        if (response.data) {
          let remoteNode = response.data as Xnode
          remoteNode.heartbeatData = JSON.parse(response.data.heartbeatData) as HeartbeatData
          setXnodeData(remoteNode)

          let thisXnodeConfig = JSON.parse(Buffer.from(response.data.services, 'base64').toString('utf-8')) as XnodeConfig

          if (Object.keys(thisXnodeConfig).includes("services")) {
            console.log("The XnodeConfig: ", thisXnodeConfig)

            if (isInitialLoad) {
              // Process options
              let remoteServices = thisXnodeConfig["services"]
              let newServices = [] as ServiceData[]

              for (const savedService of remoteServices) {
                const defaultService = ServiceFromName(savedService.nixName)
                if (defaultService === undefined) {
                  console.error("No definition for", savedService.nixName)
                  continue
                }
                let savedOptions = defaultService.options

                const processOption = (option: ServiceOption, parentOptions: ServiceOption[], targetOptions: ServiceOption[]) => {
                  const defaultOption = parentOptions?.find(defOption => defOption.nixName === option.nixName);

                  if (option.options) {
                    let newSubOptions = []
                    for (const element of option.options) {
                      console.error("No default options for: ", option.nixName, " ", defaultOption)
                      processOption(element, defaultOption.options, newSubOptions)
                    }

                    option.options = newSubOptions
                  }
                  
                  targetOptions.find(targetOption => targetOption.nixName === option.nixName).value = option.value
                }

                for (const element of savedService.options) {
                  processOption(element, defaultService?.options, savedOptions)
                }

                savedService.options = savedOptions
                newServices.push(savedService)
              }

              setServices(newServices)
            } else {
              console.log("Not changing services as they've already been downloaded and might have been edited.")
            }

            const usersArray = thisXnodeConfig["users.users"]
            if (Array.isArray(usersArray)) {
              const user = thisXnodeConfig["users.users"]?.find(user => user?.nixName.includes("xnode")); // Use find instead of get
              if (user) { // If there's no users.users data then this condition will error.
                console.log("The xnode's userdata:", user["options"])

                setUserData(user)
              }
            }
          }
        }
        setIsLoading(false)

      } catch (error) {
        console.log(config)
        toast.error(
          `Error getting the Xnode list: ${error}`
        )
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }

  }, [user, id])

  const updateChanges = async () => {
    let newServices = servicesCompressedForAdmin(services);

    if (userData?.options?.find(option => option.nixName == "openssh.authorizedKeys.keys").value != "[\"\"]") {
      newServices.push(opensshconfig as ServiceData)
    }

    console.log("Final services: ", newServices)

    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/pushXnodeServices`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'X-Parse-Session-Token': user.sessionToken,
        'Content-Type': 'application/json',
      },
      data: {
        "id": id,
        "services": Buffer.from(JSON.stringify({
          "services": newServices,
          "users.users": [userData]
        })).toString('base64')
      }
    }
    try {
      const response = await axios(config);
      console.log(response);
      setIsLoading(true);
      getData(true);
    } catch (error) {
      toast.error(`Error updating the Xnode services: ${error}`);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData(true)
  }, [user?.sessionToken, getData])

  useEffect(() => {
    console.log(xnodeData)
    if (xnodeData?.heartbeatData) {
      console.log(xnodeData.heartbeatData)
    } else {
      console.log("No heartbeat data. :(")
    }
  }, [xnodeData])

  useEffect(() => {
    const interval = setInterval(() => {
      getData(false);
    }, 10000); // 1000 ms = 1 second

    return () => clearInterval(interval);
  }, [getData]);

  useEffect(() => {
    if (xnodeData) {
      setTimeSinceHeartbeat(timeSince(xnodeData.updatedAt)) 
    } else {
      setTimeSinceHeartbeat('...')
    }

    const interval = setInterval(() => {
      if (xnodeData) {
        setTimeSinceHeartbeat(timeSince(xnodeData.updatedAt)) 
      } else {
        setTimeSinceHeartbeat('...')
      }
    }, 1000); // 1000 ms = 1 second

    return () => clearInterval(interval);
  }, [timeSinceHeartbeat, xnodeData]);

  function timeSince(startDate: Date) {
    let d = new Date(startDate)

    const today = new Date()
    const total = today.getTime() - (d.getTime())

    const seconds = (Math.floor((total / 1000) % 60))
    const minutes = (Math.floor((total / 1000 / 60) % 60))
    const hours = (Math.floor((total / 1000 / 60 / 60) % 24))
    const days = (Math.floor((total / 1000 / 60 / 60 / 24) % 1000000))

    let result = ""
    if (days > 0) {
      result += days

      if (days == 1) {
        result += " day, "
      } else {
        result += " days, "
      }
    }

    if (hours > 0) {
      result += hours

      if (hours == 1) {
        result += " hour, "
      } else {
        result += " hours, "
      }
    }

    if (minutes > 0) {
      result += minutes

      if (minutes == 1) {
        result += " minute, "
      } else {
        result += " minutes, "
      }
    }

    result += seconds
    if (seconds == 1) {
      result += " second"
    } else {
      result += " seconds"
    }

    return result
  }

  async function allowUpdate() {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/allowXnodeGenerationUpdate`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'X-Parse-Session-Token': user.sessionToken,
        'Content-Type': 'application/json',
      },
      data: {
        "id": id,
        "generation": xnodeData.updateGenerationWant + 1
      }
    }

    const response = await axios(config);
    console.log(response)

    setIsLoading(true);
    getData(true);
  }

  function getExpirationDays(startDate: Date) {
    let d = new Date(startDate)
    //console.error(d.getTime())

    const today = new Date()
    const total = today.getTime() - (d.getTime())

    const days = 365 - (Math.floor((total / 1000 / 60 / 60 / 24) % 1000000))

    return days
  }

  function round(x: number) {
    return Math.floor(x * 100) / 100
  }

  function styleFromStatus(status: string) {
    if (status == "online") {
      return "bg-green-800"
    } else if (status == "offline") {
      return "bg-gray-400"
    } else {
      return "bg-amber-200 animate-pulse "
    }
  }

  return (
    <div className="w-full flex-1 p-20">
      <section>
        <div className="flex h-full">
          {isLoading && <Loading />}
          {!isLoading && user?.sessionToken ? (
            <>
              {xnodeData ? (
                <div className="w-full">

                  { // XXX: Make this prettier:
                    xnodeData.heartbeatData && (
                      <>
                        {
                          (
                            // Only show update banner if the admin service reports an update is available, 
                            //  and the latest wanted update generation is already applied on the machine.
                            xnodeData.heartbeatData.wantUpdate &&
                            xnodeData.updateGenerationHave == xnodeData.updateGenerationWant &&
                            xnodeData.status === "online"
                          ) && (
                            <div className="flex h-fit w-full justify-between bg-amber-300 p-2 align-middle">
                              <div className="h-fit align-middle"> There is an update available. </div>
                              <Button onClick={allowUpdate}> Update </Button>
                            </div>
                          )
                        }
                      </>
                    )
                  }

                  <SectionHeader> 
                    Your Xnode {xnodeData.id}
                  </SectionHeader>

                  <div className="flex items-center">
                    <div className={"inline-block size-3 rounded-full mr-2 " + 
                      (
                      xnodeData.status ? (
                        styleFromStatus(xnodeData.status)   
                      ) : (
                        "offline"
                      )
                    )
                    }/>
                    <div>
                      Status: {xnodeData.status ? xnodeData.status : "offline"}
                    </div>
                  </div>

                  <p>Template: {xnodeData.name}</p>
                  <p>{xnodeData.deploymentAuth}</p>
                  {xnodeData.isUnit && <p>{getExpirationDays(xnodeData.unitClaimTime) + " Days Left with Machine."}</p>}

                  <div className="mt-3 h-fit w-full border p-8 shadow-md">
                    <p>Last update { timeSinceHeartbeat } ago</p>
                    <div className="mt-4 flex w-full space-x-14">
                      <XnodeMeasurement
                        name="CPU"
                        unit="%"
                        isAvailable={xnodeData.heartbeatData != null}
                        used={round(xnodeData.heartbeatData?.cpuPercent)}
                        available={round(100 - xnodeData.heartbeatData?.cpuPercent)}
                        usedPercent={round(xnodeData.heartbeatData?.cpuPercent)}
                      />
                      <XnodeMeasurement
                        name="RAM"
                        unit="GB"
                        isAvailable={xnodeData.heartbeatData != null}
                        used={round(xnodeData.heartbeatData?.ramMbUsed / 1024)}
                        available={round((xnodeData.heartbeatData?.ramMbTotal - xnodeData.heartbeatData?.ramMbUsed) / 1024)}
                        usedPercent={xnodeData.heartbeatData?.ramMbUsed / xnodeData.heartbeatData?.ramMbTotal * 100}
                      />
                      <XnodeMeasurement
                        name="storage"
                        unit="GB"
                        isAvailable={xnodeData.heartbeatData != null}
                        used={round(xnodeData.heartbeatData?.storageMbUsed / 1024)}
                        available={round((xnodeData.heartbeatData?.storageMbTotal - xnodeData.heartbeatData?.storageMbUsed) / 1024)}
                        usedPercent={xnodeData.heartbeatData?.storageMbUsed / xnodeData.heartbeatData?.storageMbTotal * 100}
                      />
                    </div>
                  </div>
                  <div className="mt-3 h-fit w-full border p-8 shadow-md">
                    <ServiceEditor startingServices={services} updateServices={setServices} />
                  </div>
                  <div className="mt-3 h-fit w-full border p-8 shadow-md">
                    <ServiceAccess currentServices={services} ip={xnodeData.ipAddress} startingUserData={userData} updatedUserData={setUserData}/>
                  </div>
                  <div className="mt-3 h-fit w-full border p-8 shadow-md">
                    <p>Actions</p>
                    <div className="flex ">
                      <Button onClick={() => { updateChanges() }}> Push changes </Button>
                      <Button onClick={() => { allowUpdate() } }> Force update </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No Xnode for that UUID found.</p>
              )}
            </>
          ) : (
            !isLoading && <Signup />
          )}
        </div>
      </section>
    </div>
  );
}
