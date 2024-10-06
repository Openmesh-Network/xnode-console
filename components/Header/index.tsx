'use client'

import { formatAddress } from '@/utils/functions'
import {
  BellDot,
  HelpCircle,
  PanelLeft,
  Plus,
  Search,
  Settings,
  User2,
} from 'lucide-react'

import { Popover, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export function Header() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 flex h-20 items-center justify-between gap-x-32 bg-foreground px-6">
      <div className="flex items-center gap-6">
        <div className="shrink-0 text-2xl font-medium text-background">
          Xnode Studio
        </div>
        <Select defaultValue="xnodeo-001">
          <SelectTrigger className="h-9 min-w-56 border-background/15 bg-background/10 text-background">
            <div className="inline-flex shrink-0 items-center gap-1.5">
              <PanelLeft className="size-3.5" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xnodeo-001">XnodeO 001</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <button
        type="button"
        className="flex h-9 min-w-56 max-w-lg grow items-center gap-3 rounded border border-background/15 bg-background/10 px-3 text-muted transition-colors hover:bg-background/15"
      >
        <Search className="size-4" />
        <span className="text-sm">Search & Run Commands</span>
      </button>
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded bg-primary text-background transition-colors hover:bg-primary/90"
        >
          <Plus className="size-5" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2 text-background">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded transition-colors hover:bg-background/10"
          >
            <span className="sr-only">Notifications</span>
            <BellDot className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded transition-colors hover:bg-background/10"
          >
            <span className="sr-only">Help</span>
            <HelpCircle className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded transition-colors hover:bg-background/10"
          >
            <span className="sr-only">Settings</span>
            <Settings className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <Popover>
          <PopoverTrigger className="flex h-9 items-center gap-1.5 rounded bg-primary px-3 text-sm text-background">
            <User2 className="size-4" />
            {formatAddress('0xF0dF6d08604B94F3942bb2C8aA579e67DE9f8d13')}
          </PopoverTrigger>
        </Popover>
      </div>
      {/* <div className="hidden h-full items-center gap-x-20 lg:flex">
        <nav className="flex items-center gap-x-12">
          {headerItems.map((option, index) => (
            <Link
              key={index}
              href={`${option.href}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-white transition-colors duration-300 hover:text-gray200">
                {option.label}
              </span>
            </Link>
          ))}
        </nav>

        <Link
          href="/workspace"
          className="flex h-full items-center gap-x-[10px] bg-blue500 px-9 transition-colors duration-300 hover:bg-blue500/80"
        >
          <Image src={thunderIcon} alt="Thunder icon" />
          <span className="text-sm font-medium text-white">
            Create service and deploy
          </span>
        </Link>
      </div> */}
    </header>
  )
}
