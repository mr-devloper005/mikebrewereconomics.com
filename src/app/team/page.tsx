import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <NavbarShell />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#222]">Editorial team</h1>
            <p className="mt-5 text-sm leading-8 text-slate-600">
              {SITE_CONFIG.name} is edited by a small group of contributors focused on economics writing, fact-checking, and
              reader-friendly structure. We do not run a large newsroom; pieces are reviewed for clarity and sourcing before
              publication.
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              Interested in contributing? Use{' '}
              <Link href="/contact" className="font-medium text-[#333399] underline underline-offset-2">
                the contact form
              </Link>{' '}
              with a short pitch and two writing samples.
            </p>
          </div>
          <aside className="rounded-lg border border-slate-200 bg-white p-6 text-sm shadow-sm">
            <h2 className="font-semibold text-[#222]">Roles</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>Managing editor</li>
              <li>Contributing analysts</li>
              <li>Copy editing &amp; production</li>
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
