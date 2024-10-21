'use client'

import Link from 'next/link'
import { Blocks, Cloud, IdCard, Server } from 'lucide-react'
import Youtube from 'react-youtube'

import { SimpleTooltip } from '@/components/Common/SimpleTooltip'

export default function Home() {
  return (
    <>
      <section className="container mb-12 mt-24 w-full">
        <div className="flex gap-12">
          <div className="flex-1 basis-3/5">
            <h1 className="text-balance text-3xl font-black lg:text-7xl">
              Accelerate Your Infrastructure Development.
            </h1>
            <p className="mt-4 text-pretty text-sm font-medium text-muted-foreground lg:text-lg">
              Unleash the Power of Xnode: Your Gateway to Building Personalized
              Data Ecosystems in minutes, instead of weeks.
            </p>
            <div className="mt-12 flex items-center gap-6">
              <Link
                href="/app-store"
                className="flex h-14 items-center rounded bg-primary px-8 font-medium text-background transition-colors hover:bg-primary/90"
              >
                Explore Xnode Power
              </Link>
              <Link
                href="/app-store"
                className="flex h-14 items-center rounded px-8 font-medium transition-colors hover:bg-foreground/10"
              >
                Build your first dApp
              </Link>
            </div>
          </div>
          <div className="flex-1 shrink basis-2/5 content-center rounded-xl">
            <Youtube
              className="hdplus:block hidden p-2"
              videoId="dYM_hg6PkcY"
            />
          </div>
        </div>
      </section>
      <section className="container my-12 space-y-4">
        <h2 className="text-2xl font-bold">Quick Access</h2>
        <div className="grid grid-cols-4 gap-6">
          <Link
            href="/claim"
            className="flex items-center gap-4 rounded border px-8 py-6 font-semibold transition-colors hover:bg-foreground/5"
          >
            <IdCard className="size-8" strokeWidth={1.5} />
            Redeem an Xnode DVM
          </Link>
          <Link
            href="/app-store"
            className="flex items-center gap-4 rounded border px-8 py-6 font-semibold transition-colors hover:bg-foreground/5"
          >
            <Server className="size-8" strokeWidth={1.5} />
            Configure an Instance
          </Link>
          <Link
            href="/app-store"
            className="flex items-center gap-4 rounded border px-8 py-6 font-semibold transition-colors hover:bg-foreground/5"
          >
            <Blocks className="size-8" strokeWidth={1.5} />
            Run a Node
          </Link>
          <SimpleTooltip tooltip="Coming Soon!">
            <Link
              href="/"
              className="flex cursor-default items-center gap-4 rounded border bg-foreground/10 px-8 py-6 font-semibold text-gray-400 transition-colors"
            >
              <Cloud className="size-8" strokeWidth={1.5} />
              Provide Resources
            </Link>
          </SimpleTooltip>
        </div>
      </section>
    </>
  )
}
