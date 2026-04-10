import type { Metadata } from 'next'
import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Cookie policy | ${SITE_CONFIG.name}`,
  description: 'Cookies and similar technologies used on this site.',
}

const rows = [
  {
    name: 'Strictly necessary',
    purpose: 'Keeps the site working: security, load balancing, and similar core functions from your hosting provider.',
    duration: 'Session or short-lived',
    control: 'Cannot be disabled without breaking the site.',
  },
  {
    name: 'Preferences',
    purpose: 'Remembers choices such as theme if the UI offers it, or language where implemented.',
    duration: 'Typically 12 months or until cleared',
    control: 'Clear site data in your browser or use settings where available.',
  },
  {
    name: 'Local storage (sign-in demo)',
    purpose: 'Stores a minimal user profile when you use the built-in demo login—not a third-party cookie, but similar in effect on your device.',
    duration: 'Until you clear storage or sign out',
    control: 'Sign out or clear site data for this origin.',
  },
  {
    name: 'Analytics (optional)',
    purpose: 'If your operator adds Google Analytics, Plausible, or similar, those tools set their own cookies or use first-party endpoints.',
    duration: 'Per vendor policy',
    control: 'Managed via consent banner or browser blocking, per deployment.',
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <NavbarShell />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-3xl font-semibold text-[#222]">Cookies &amp; similar tech</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            A quick reference for {SITE_CONFIG.name}. Exact cookies depend on how the live site is hosted and which
            optional tools are turned on.
          </p>
          <p className="mt-2 text-xs text-slate-400">Last updated April 10, 2026</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-0 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600 sm:px-5">
            <div className="col-span-12 sm:col-span-3">Category</div>
            <div className="col-span-12 mt-2 sm:col-span-4 sm:mt-0">Purpose</div>
            <div className="col-span-6 mt-2 sm:col-span-2 sm:mt-0">Typical duration</div>
            <div className="col-span-6 mt-2 text-right sm:col-span-3 sm:mt-0 sm:text-left">Your control</div>
          </div>
          {rows.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-12 gap-0 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:px-5"
            >
              <div className="col-span-12 text-sm font-semibold text-[#222] sm:col-span-3">{row.name}</div>
              <div className="col-span-12 mt-2 text-sm leading-6 text-slate-600 sm:col-span-4 sm:mt-0">{row.purpose}</div>
              <div className="col-span-12 mt-2 text-sm text-slate-600 sm:col-span-2 sm:mt-0">{row.duration}</div>
              <div className="col-span-12 mt-2 text-sm text-slate-600 sm:col-span-3 sm:mt-0">{row.control}</div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-dashed border-slate-300 bg-white/80 p-6 text-sm leading-7 text-slate-600">
          <p>
            <strong className="text-[#222]">No consent banner in the base template.</strong> If you add analytics or ads,
            you may need a consent flow under EU/UK rules. This page is a starting point—not legal advice.
          </p>
          <p className="mt-4">
            Read our{' '}
            <Link href="/privacy" className="font-medium text-[#333399] underline underline-offset-2">
              privacy policy
            </Link>{' '}
            for broader data practices.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
