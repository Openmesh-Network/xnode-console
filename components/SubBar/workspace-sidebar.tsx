'use client'

import { ChevronRight } from 'lucide-react'

import SubBarAnalytics from '../SubBarAnalytics'
import SubBarAPIs from '../SubBarAPIs'
import SubBarCompute from '../SubBarCompute'
import SubBarData from '../SubBarData'
import SubBarDataManagement from '../SubBarDataManagement'
import SubBarML from '../SubBarML'
import SubBarRPC from '../SubBarRPC'
import SubBarServers from '../SubBarServers'
import SubBarStorage from '../SubBarStorage'
import SubBarTrading from '../SubBarTrading'
import SubBarUtility from '../SubBarUtility'

type HoverItemProps = {
  title: string
  children: React.ReactNode
}
function HoverItem({ title, children }: HoverItemProps) {
  return (
    <div className="group cursor-pointer rounded px-4 py-2.5 hover:bg-muted">
      <div className="flex items-center gap-1">
        <h1 className="font-medium">{title}</h1>
        <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
      <div className="invisible absolute inset-y-0 right-full mr-px max-h-full overflow-y-auto delay-300 group-hover:visible">
        {children}
      </div>
    </div>
  )
}

export default function WorkspaceSidebar() {
  return (
    <div className="relative flex h-full min-w-64 flex-col border-l p-3">
      <HoverItem title="Data">
        <SubBarData onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="Servers">
        <SubBarServers onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="APIs">
        <SubBarAPIs onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="Analytics">
        <SubBarAnalytics onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="RPC">
        <SubBarRPC onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="Utility">
        <SubBarUtility onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="ML">
        <SubBarML onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="Storage">
        <SubBarStorage onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="Data Management">
        <SubBarDataManagement onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="Compute">
        <SubBarCompute onValueChange={(val) => console.log(val)} />
      </HoverItem>
      <HoverItem title="Trading">
        <SubBarTrading onValueChange={(val) => console.log(val)} />
      </HoverItem>
    </div>
  )
}
