/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react'
import { getAPI, getDatasets } from '@/utils/data'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SmileySad } from 'phosphor-react'
import Filter from '@/components/Filter'
import { TextField, Autocomplete } from '@mui/material'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import ProductsList from '../ProductsList'
import Dropdown, { ValueObject } from './Dropdown'
import { AccountContext } from '@/contexts/AccountContext'

import { TemplateData, ServiceData } from '@/types/dataProvider'
import ServiceDefinitions from 'utils/service-definitions.json'
import TemplateDefinitions from 'utils/template-definitions.json'


export const optionsNetwork = [
  {
    name: 'Date Created',
    value: 'Date Created',
  },
  {
    name: 'Template Name',
    value: 'Template Name',
  },
]

const obj = {
  name: 'Openmesh Core',
  desc: 'CPU, 8-Core (16-Thread)',
  tags: 'Core app',
  infraId: '#262343',
}
export const optionsCreator = [
  {
    name: 'Openmesh',
    value: 'Openmesh',
  },
]

export const providerNameToLogo = {
  Equinix: {
    src: 'new-equinix.png',
    width: 'w-[50px]',
  },
}

const TemplateStep = () => {
  const [templatesData, setTemplatesData] = useState<TemplateData[]>([])
  const [filteredTemplatesData, setFilteredTemplatesData] = useState<TemplateData[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [displayToggle, setDisplayToggle] = useState<string>('square')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])

  const [categoryOpen, setCategoryOpen] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [searchInput, setSearchInput] = useState<string>()
  const [filterSelection, setFilterSelection] =
    useState<string>('All Templates')
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<ValueObject | null>(null)
  const [selectedCreator, setSelectedCreator] = useState<ValueObject | null>(
    null,
  )

  const { setIndexerDeployerStep, templateSelected, setTemplateSelected, setIsEditingXnode, setNextFromScratch, setFinalNodes, setNext } =
    useContext(AccountContext)

  async function getData() {
    let data: TemplateData[]
    data = TemplateDefinitions

    setTemplatesData(data)
    setFilteredTemplatesData(data)
  }

  function handleCategoryFilter(ct: string) {
    let newFilter = [...categoryFilter]
    if (newFilter.includes(ct)) {
      newFilter = newFilter.filter((data) => data !== ct)
    } else {
      newFilter.push(ct)
    }
    setCategoryFilter(newFilter)
    handleNewFilteredTemplatesData(newFilter, filterSelection)
  }

  function handleNewFilteredTemplatesData(categories: string[], source: string) {
    // first filtering by the source
    let newFilteredTemplate = [...templatesData]
    if (source !== 'All Templates') {
      newFilteredTemplate = newFilteredTemplate.filter(vl => vl.source === source)
    }

    if (categories.length > 0) {
      newFilteredTemplate = newFilteredTemplate.filter((ft) => categories.includes(ft.category))
    }

    setFilteredTemplatesData(newFilteredTemplate)
  }
  const { push } = useRouter()

  function handleSortByFilter(value: string) {
    console.log('entrei handle')
    if (value === 'Date Created') {
      const newFilteredTemplates = [...filteredTemplatesData]

      newFilteredTemplates.sort((a, b) => {
        // Convert dates to timestamps and compare
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      });
  
      setFilteredTemplatesData(newFilteredTemplates);
    }
    if (value === 'Template Name') {
      console.log('entrei aqui yes sir')
      const newFilteredTemplates = [...filteredTemplatesData]

      newFilteredTemplates.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredTemplatesData(newFilteredTemplates);
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="relative z-10 pt-[30px] pb-[200px] lg:pt-0">
      <div className="mx-auto max-w-[1380px] px-[20px]  2xl:text-[14px] text-[12px] font-normal text-[#000]">
        <div className="flex justify-between gap-x-[95px]">
          <div className="w-full text-center ">
            <div className="mx-auto mb-[12.5px] 2xl:text-[48px] text-[42px] font-semibold leading-[64px]">
              Find your <span className="text-[#0059ff]">Template</span>
            </div>
            <div className="mt-[7px] 2xl:text-[16px] text-[14px] font-normal leading-[32px] text-[#4d4d4d]">
              Jumpstart your development process with our pre-built templates
            </div>
            <div className="relative mt-[48px]">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                    ? process.env.NEXT_PUBLIC_BASE_PATH
                    : ''
                }/images/template/small.svg`}
                alt="image"
                className="absolute -top-[10px] left-0"
              />
              <div className="mx-auto flex w-fit gap-x-[12px] 2xl:text-[16px] text-[14px] font-normal leading-[16px] text-[#4d4d4d]">
                <div
                  onClick={() => {
                    setFilterSelection('All Templates')
                    handleNewFilteredTemplatesData(categoryFilter, 'All Templates')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'All Templates'
                      ? 'bg-[#4d4d4d] font-bold text-[#fff]'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  All Templates
                </div>
                <div
                  onClick={() => {
                    setFilterSelection('openmesh')
                    handleNewFilteredTemplatesData(categoryFilter, 'openmesh')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'openmesh'
                      ? 'bg-[#4d4d4d] font-bold text-[#fff]'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  Openmesh
                </div>
                <div
                  onClick={() => {
                    setFilterSelection('community')
                    handleNewFilteredTemplatesData(categoryFilter, 'community')
                  }}
                  className={`cursor-pointer rounded-[100px] px-[12px] py-[6px] ${
                    filterSelection === 'community'
                      ? 'bg-[#4d4d4d] font-bold text-[#fff]'
                      : 'hover:text-[#252525]'
                  }`}
                >
                  Community
                </div>
              </div>
            </div>
            <div className="mt-[34px] h-[1px] w-full bg-[#E6E8EC]"></div>
            <div className="mt-[30px] flex gap-x-[70px]">
              <div>
                <div className="w-[256px] rounded-[5px] border-[1px] border-[#d1d5da] px-[16px] pt-[15px] pb-[25px]">
                  <div className="flex items-center justify-between gap-x-[4px]">
                    <div className="2xl:text-[16px] text-[14px] font-medium leading-[24px] text-[#000]">
                      Category
                    </div>
                    <img
                      onClick={() => {
                        setCategoryOpen(!categoryOpen)
                      }}
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/arrow-top.svg`}
                      alt="image"
                      className={`${
                        !categoryOpen && 'rotate-180'
                      } cursor-pointer transition-all duration-300`}
                    />
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[30px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div onClick={() => {
                      handleCategoryFilter('blockchain')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('blockchain') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Blockchain ({templatesData?.filter((data) => data.category === 'blockchain').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div onClick={() => {
                      handleCategoryFilter('data')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('data') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Data ({templatesData?.filter((data) => data.category === 'data').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div onClick={() => {
                      handleCategoryFilter('developer')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('developer') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Developer ({templatesData?.filter((data) => data.category === 'developer').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div onClick={() => {
                      handleCategoryFilter('server')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('server') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                      Server ({templatesData?.filter((data) => data.category === 'server').length})
                    </div>
                  </div>
                  <div
                    className={`${
                      !categoryOpen && 'hidden'
                    } mt-[20px] flex gap-x-[6px]`}
                  >
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/xnode-circle.svg`}
                      alt="image"
                      className=""
                    />
                    <div onClick={() => {
                      handleCategoryFilter('validatorNode')
                    }} className={`cursor-pointer 2xl:text-[16px] text-[14px] font-normal leading-[20px] ${categoryFilter.includes('validatorNode') ? 'text-[#0059ff]' : 'text-[#959595]'}`}>
                     Validator Node ({templatesData?.filter((data) => data.category === 'validatorNode').length})
                    </div>
                  </div>
                </div>
                <div className="mt-[29px] h-[1px] w-full bg-[#E6E8EC]"></div>
                <div className="mt-[24px] text-start">
                  <div className="2xl:text-[16px] text-[14px] font-medium leading-[12px] text-[#000]">
                    Creator
                  </div>
                  <div className="mt-[12px]">
                    <Dropdown
                      optionSelected={selectedCreator}
                      options={optionsCreator}
                      placeholder="Filter"
                      onValueChange={(value) => {
                        setSelectedCreator(value)
                      }}
                    />
                  </div>
                  <div onClick={() => {
                    setCategoryFilter([])
                    setFilterSelection('All Templates')
                    handleNewFilteredTemplatesData([], 'All Templates')
                  }} className="mt-[24px] flex cursor-pointer gap-x-[10px]">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                          ? process.env.NEXT_PUBLIC_BASE_PATH
                          : ''
                      }/images/template/remove.svg`}
                      alt="image"
                      className=""
                    />
                    <div className="2xl:text-[16px] text-[14px] font-normal text-[#4d4d4d] hover:text-[#3b3b3b]">
                      Reset filter
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-end gap-x-[20px]">
                  <Dropdown
                    optionSelected={selected}
                    options={optionsNetwork}
                    placeholder="Sort By"
                    onValueChange={(value) => {
                      setSelected(value)
                      handleSortByFilter(value.value)
                    }}
                  />
                  <div className="flex">
                    <div
                      onClick={() => {
                      }}
                      className={`${
                        displayToggle === 'list' ? 'bg-[#0059ff]' : 'bg-[#fff]'
                      } rounded-l-[5px] border-[1px] border-r-0 border-[#d1d5da] p-[16px]`}
                    >
                      {displayToggle === 'list' ? (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/list.svg`}
                          alt="image"
                          className=""
                        />
                      ) : (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/list-cinza.svg`}
                          alt="image"
                          className=""
                        />
                      )}
                    </div>
                    <div
                      onClick={() => {
                        setDisplayToggle('square')
                      }}
                      className={`${
                        displayToggle === 'square'
                          ? 'bg-[#0059ff]'
                          : 'bg-[#fff]'
                      } cursor-pointer rounded-r-[5px] border-[1px] border-l-0 border-[#d1d5da] p-[16px]`}
                    >
                      {displayToggle === 'square' ? (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/quadrados.svg`}
                          alt="image"
                          className=""
                        />
                      ) : (
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                              ? process.env.NEXT_PUBLIC_BASE_PATH
                              : ''
                          }/images/template/quadrados-cinza.svg`}
                          alt="image"
                          className=""
                        />
                      )}
                    </div>
                  </div>
                </div>


                {/* XXX: Code duplication here. Refactor into component? */}
                <div className="flex h-full w-full flex-wrap">
                {filteredTemplatesData.map((element) => (
                  <a href={
                    process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD' ?
                    '/xnode/template-products/' + element.id
                    : '/template-products/' + element.id
                    }> 
                    <div className="text-start mx-5 mt-[17px] max-w-[270px] min-h-[250px] w-full cursor-pointer rounded-[8px] border-[#fafafa] py-[27px] px-[22px] shadow-md  border-[2px] hover:border-[#0059ff] hover:bg-[#e5eefc]">
                      <div className="flex gap-x-[75px]">
                        <img src={ element.logo } alt="image" className="max-h-[33px] max-w-[33px] w-[33px] h-[33px]">
                        </img>
                        <div className="flex w-full items-center gap-x-[9px] rounded-[16px]  px-[12px] py-[4px] bg-[#e5eefc]">
                          <div className="h-[10px] w-[10px] rounded-full bg-[#0059ff]"></div>
                          <div className="2xl:text-[14px] text-[12px] font-bold leading-[24px] text-[#0059ff]">Category</div>
                        </div>
                      </div>
                      <div className="mt-[20px]">
                        <div className="2xl:text-[18px] text-[16px] font-medium text-[#000] line-clamp-1 overflow-hidden">{element.name}</div>
                        <div className="mt-[6px] line-clamp-3 overflow-hidden text-[14px] 2xl:text-[16px] font-normal leading-[20px] text-[#959595]">{element.desc}</div>
                      </div>
                    </div>
                  </a>
                ))}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TemplateStep
