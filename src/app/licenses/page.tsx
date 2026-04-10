import type { Metadata } from 'next'
import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Open source licenses | ${SITE_CONFIG.name}`,
  description: 'Acknowledgements for software used to build this site.',
}

const stack = [
  { name: 'Next.js', license: 'MIT', note: 'Application framework' },
  { name: 'React', license: 'MIT', note: 'UI library' },
  { name: 'Tailwind CSS', license: 'MIT', note: 'Styling' },
  { name: 'Radix UI', license: 'MIT', note: 'Accessible primitives' },
  { name: 'Lucide', license: 'ISC', note: 'Icons' },
]

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <NavbarShell />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="rounded-r-lg border-l-4 border-[#333399] pl-6">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Credits</p>
          <h1 className="mt-2 font-mono text-2xl font-semibold text-[#222]">Open source</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            {SITE_CONFIG.name} is built with open-source components. We are grateful to the authors. This list is
            illustrative; your lockfile is the source of truth for exact versions.
          </p>
        </header>

        <dl className="mt-12 space-y-6">
          {stack.map((item) => (
            <div key={item.name} className="flex flex-col gap-1 border-b border-slate-200 pb-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <div>
                <dt className="font-mono text-sm font-semibold text-[#222]">{item.name}</dt>
                <dd className="mt-1 text-xs text-slate-500">{item.note}</dd>
              </div>
              <dd className="font-mono text-sm text-[#0d7a7a]">{item.license}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-14 rounded-lg bg-[#1a1a1a] p-6 text-slate-300">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">MIT (summary)</h2>
          <p className="mt-3 text-xs leading-6 text-slate-400">
            Permission is hereby granted, free of charge, to use, copy, modify, merge, publish, distribute, sublicense,
            and/or sell copies of the Software, subject to inclusion of the copyright notice and permission notice in
            all copies. THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Full license texts ship with each package in{' '}
            <code className="rounded bg-black/40 px-1.5 py-0.5 text-slate-300">node_modules</code>. For a complete
            report, run your package manager&apos;s license audit (e.g.{' '}
            <code className="rounded bg-black/40 px-1.5 py-0.5">pnpm licenses list</code>).
          </p>
        </section>

        <p className="mt-10 text-center text-sm text-slate-600">
          <Link href="/terms" className="underline underline-offset-2 hover:text-[#0d7a7a]">
            Terms of use
          </Link>
          <span className="mx-2 text-slate-300">|</span>
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[#0d7a7a]">
            Privacy
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
