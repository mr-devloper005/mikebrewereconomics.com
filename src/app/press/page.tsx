import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <NavbarShell />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <h1 className="text-2xl font-semibold text-[#222]">Press</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Journalists and partners can use this page for basic facts about {SITE_CONFIG.name}. For interviews or comment,
            reach out through{' '}
            <Link href="/contact" className="font-medium text-[#333399] underline underline-offset-2">
              contact
            </Link>
            .
          </p>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-slate-500">Boilerplate</h2>
          <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {SITE_CONFIG.name} publishes independent economics articles and explainers for a general audience. Content is
            edited for accuracy and clarity; the site emphasizes reading and search over algorithmic feeds.
          </p>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-slate-500">Brand</h2>
          <p className="mt-3 text-sm text-slate-600">
            Logo files match the favicon in the site header. For high-resolution assets, request them by email via the contact
            form.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
