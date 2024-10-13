'use client'

import { useMemo, type ComponentProps } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { prefix } from '@/utils/prefix'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import {
  CalendarDays,
  Cpu,
  Globe,
  HardDrive,
  Hourglass,
  MemoryStick,
} from 'lucide-react'
import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'

import { type ServiceData } from '@/types/dataProvider'
import { type HeartbeatData, type Xnode } from '@/types/node'
import { cn, formatXNodeName } from '@/lib/utils'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function useXnodes(sessionToken: string) {
  return useQuery<Xnode[]>({
    queryKey: ['xnodes', sessionToken],
    queryFn: async () => {
      const data: Xnode[] = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/xnodes/functions/getXnodes`,
        {
          method: 'GET',
          headers: {
            'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
            'X-Parse-Session-Token': sessionToken,
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json())

      return data.map((xNode) => ({
        ...xNode,
        heartbeatData:
          xNode.heartbeatData !== null
            ? JSON.parse(xNode.heartbeatData as any as string)
            : null,
      }))
    },
    refetchInterval: 30 * 1000,
  })
}

type HealthSummary = {
  cpu: number
  ram: number
  storage: number
}

type HealthChartItemProps = Omit<
  ComponentProps<typeof ChartContainer>,
  'config' | 'children'
> & {
  type: 'cpu' | 'ram' | 'storage'
  healthData: number
}
export function HealthChartItem({
  type,
  healthData,
  className,
  ...props
}: HealthChartItemProps) {
  const chartData = [
    {
      name: type,
      data: healthData,
      fill: 'hsl(var(--primary))',
    },
  ]

  const chartConfig = {
    data: {
      label: type.toUpperCase(),
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className={cn('size-64 min-h-48', className)}
      {...props}
    >
      <RadialBarChart
        accessibilityLayer
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={90}
        outerRadius={110}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[94, 86]}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <RadialBar dataKey="data" cornerRadius={2} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-mono text-4xl font-bold"
                    >
                      {chartData[0].data.toLocaleString('en-US', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                      %
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 26}
                      className="fill-muted-foreground uppercase"
                    >
                      {type}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}

type HealthComponentProps = {
  sessionToken: string
}
export function HealthSummary({ sessionToken }: HealthComponentProps) {
  const { data: xNodes, isPending } = useXnodes(sessionToken)

  const healthSummaryData = useMemo<HealthSummary | null>(() => {
    if (isPending || !xNodes) return null
    let avgHealth: Pick<
      HeartbeatData,
      | 'cpuPercent'
      | 'ramMbUsed'
      | 'ramMbTotal'
      | 'storageMbUsed'
      | 'storageMbTotal'
    > = {
      cpuPercent: 0,
      ramMbUsed: 0,
      ramMbTotal: 1,
      storageMbUsed: 0,
      storageMbTotal: 1,
    }

    for (const { status, heartbeatData } of xNodes) {
      if (status === 'booting') continue
      avgHealth = {
        cpuPercent: avgHealth.cpuPercent + (heartbeatData?.cpuPercent ?? 0),
        ramMbUsed: avgHealth.ramMbUsed + (heartbeatData?.ramMbUsed ?? 0),
        ramMbTotal: avgHealth.ramMbTotal + (heartbeatData?.ramMbTotal ?? 0),
        storageMbUsed:
          avgHealth.storageMbUsed + (heartbeatData?.storageMbUsed ?? 0),
        storageMbTotal:
          avgHealth.storageMbTotal + (heartbeatData?.storageMbTotal ?? 0),
      }
    }
    avgHealth = {
      cpuPercent: avgHealth.cpuPercent / xNodes.length,
      ramMbUsed: avgHealth.ramMbUsed / xNodes.length,
      ramMbTotal: avgHealth.ramMbTotal + xNodes.length,
      storageMbUsed: avgHealth.storageMbUsed / xNodes.length,
      storageMbTotal: avgHealth.storageMbTotal / xNodes.length,
    }
    return {
      cpu: avgHealth.cpuPercent,
      ram: (avgHealth.ramMbUsed / avgHealth.ramMbTotal) * 100,
      storage: (avgHealth.storageMbUsed / avgHealth.storageMbTotal) * 100,
    }
  }, [isPending, xNodes])

  return (
    <div className="grid grid-cols-4 gap-6">
      {healthSummaryData ? (
        <>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">CPU</h4>
            <p className="text-sm text-muted-foreground">
              Avg. CPU utilization
            </p>
            <HealthChartItem type="cpu" healthData={healthSummaryData.cpu} />
          </div>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">GPU</h4>
            <p className="text-sm text-muted-foreground">
              Avg. GPU utilization
            </p>
            <div className="m-8 flex size-48 flex-col items-center justify-center gap-1 rounded-full bg-background ring-8 ring-inset ring-muted">
              <Hourglass
                className="size-10 text-muted-foreground"
                strokeWidth={1.25}
              />
              <p className="font-mono text-xl font-bold">No Data</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">RAM</h4>
            <p className="text-sm text-muted-foreground">
              Avg. RAM utilization
            </p>
            <HealthChartItem type="ram" healthData={healthSummaryData.ram} />
          </div>
          <div className="flex flex-col items-center justify-center rounded border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold">Storage</h4>
            <p className="text-sm text-muted-foreground">
              Avg. Storage utilization
            </p>
            <HealthChartItem
              type="storage"
              healthData={healthSummaryData.storage}
            />
          </div>
        </>
      ) : null}
      {isPending ? (
        <>
          <Skeleton className="h-[22rem] border" />
          <Skeleton className="h-[22rem] border" />
          <Skeleton className="h-[22rem] border" />
          <Skeleton className="h-[22rem] border" />
        </>
      ) : null}
    </div>
  )
}

export function XNodesHealth({ sessionToken }: HealthComponentProps) {
  const { data: xNodes, isPending } = useXnodes(sessionToken)

  return (
    <div className="grid grid-cols-4 gap-6">
      {!isPending ? (
        xNodes?.map((xNode, index) => {
          return (
            <div
              key={`xNode-deployment-${xNode.id}`}
              className="rounded border px-4 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold">
                  {xNode.isUnit
                    ? formatXNodeName(xNode.deploymentAuth)
                    : `Xnode ${index}`}
                </h3>
                {xNode.status !== 'online' ? (
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium capitalize',
                      xNode.status === 'booting'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-orange-500/10 text-orange-500'
                    )}
                  >
                    {xNode.status}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex w-full items-center gap-4">
                  <div className="flex shrink-0 basis-1/4 items-center gap-1 text-muted-foreground">
                    <Cpu className="size-4" />
                    <p className="text-sm">CPU</p>
                  </div>
                  <div className="relative grow">
                    <div className="h-2 w-full rounded bg-border" />
                    <div
                      className="absolute left-0 top-0 h-2 rounded bg-primary transition-all"
                      style={{
                        width: `${Math.min(Math.round(xNode.heartbeatData?.cpuPercent ?? 0), 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex w-full items-center gap-4">
                  <div className="flex shrink-0 basis-1/4 items-center gap-1 text-muted-foreground">
                    <MemoryStick className="size-4" />
                    <p className="text-sm">RAM</p>
                  </div>
                  <div className="relative grow">
                    <div className="h-2 w-full rounded bg-border" />
                    <div
                      className="absolute left-0 top-0 h-2 rounded bg-primary transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.min(((xNode.heartbeatData?.ramMbUsed ?? 0) / (xNode.heartbeatData?.ramMbTotal ?? 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex w-full items-center gap-4">
                  <div className="flex shrink-0 basis-1/4 items-center gap-1 text-muted-foreground">
                    <HardDrive className="size-4" />
                    <p className="text-sm">Storage</p>
                  </div>
                  <div className="relative grow">
                    <div className="h-2 w-full rounded bg-border" />
                    <div
                      className="absolute left-0 top-0 h-2 rounded bg-primary transition-all"
                      style={{
                        width: `${Math.min(((xNode.heartbeatData?.storageMbUsed ?? 0) / (xNode.heartbeatData?.storageMbTotal ?? 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <p className="text-xs">
                    {formatDistanceToNow(xNode.unitClaimTime)} ago
                  </p>
                </div>
                <Image
                  src={`${prefix}/images/xnode-card/silvercard-front.webp`}
                  alt="Xnode Card"
                  width={48}
                  height={28}
                  className="rounded object-contain"
                />
              </div>
            </div>
          )
        })
      ) : (
        <>
          <Skeleton className="h-44 border" />
          <Skeleton className="h-44 border" />
          <Skeleton className="h-44 border" />
          <Skeleton className="h-44 border" />
        </>
      )}
    </div>
  )
}

export function XNodesApps({ sessionToken }: HealthComponentProps) {
  const { data: xNodes, isPending } = useXnodes(sessionToken)

  const services = useMemo(() => {
    const allServices: Record<
      Xnode['id'],
      (ServiceData & { xNodeNft: Xnode['deploymentAuth']; updatedAt: Date })[]
    > = {}
    if (isPending || !xNodes) return allServices
    for (const xNode of xNodes) {
      const services = JSON.parse(
        Buffer.from(xNode.services, 'base64').toString('utf-8')
      )['services'] as ServiceData[]
      allServices[xNode.id] = services.map((service) => ({
        ...service,
        xNodeNft: xNode.deploymentAuth,
        updatedAt: xNode.updatedAt,
      }))
    }
    return allServices
  }, [isPending, xNodes])

  return (
    // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
    <Table className="w-full overflow-clip rounded">
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead className="h-7">App Title</TableHead>
          <TableHead className="h-7">Node</TableHead>
          <TableHead className="h-7">Updated</TableHead>
          <TableHead className="h-7" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={`loading-apps-${index}`}>
              <TableCell colSpan={4}>
                <Skeleton key={`deployment-app-${index}`} className="h-5" />
              </TableCell>
            </TableRow>
          ))
        ) : Object.values(services).some((services) => services.length > 0) ? (
          Object.entries(services).map(([xNodeId, services]) =>
            services.map((service) => (
              <TableRow key={`deployment-app-${service.nixName}`}>
                <TableCell className="inline-flex items-center gap-2">
                  {service.logo ? (
                    <img
                      src={service.logo}
                      alt={`${service.name} logo`}
                      width={20}
                      height={20}
                    />
                  ) : null}
                  {service.name ?? service.nixName}
                </TableCell>
                <TableCell>{formatXNodeName(service.xNodeNft)}</TableCell>
                <TableCell>
                  {formatDistanceToNow(service.updatedAt)} ago
                </TableCell>
                <TableCell>
                  <Link href={`/xnode?uuid=${xNodeId}`}>
                    <Globe
                      className="size-5 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-8 text-center font-semibold text-muted-foreground"
            >
              No apps currently running.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
