import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <NavbarShell />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d7a7a]">About</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#222]">{SITE_CONFIG.name}</h1>
        <p className="mt-6 text-base leading-8 text-slate-600">
          We publish independent economics commentary, explainers, and long-form analysis for readers who want clear writing
          without noise. The site is structured like a small research library: browse by topic, search across pieces, and read
          with a calm, text-first layout.
        </p>
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-[#222]">What we focus on</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-7 text-slate-600">
            <li>Macro and policy context explained in plain language</li>
            <li>Data-backed perspectives with room for nuance</li>
            <li>Stable archives you can return to—not a social feed</li>
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-[#222]">
          <Link href="/articles" className="underline-offset-4 hover:text-[#0d7a7a] hover:underline">
            Read articles
          </Link>
          <Link href="/search" className="underline-offset-4 hover:text-[#0d7a7a] hover:underline">
            Search
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:text-[#0d7a7a] hover:underline">
            Contact
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
