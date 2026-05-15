import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <NavbarShell />
      <main className="mx-auto max-w-lg px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-[#222]">Contact</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Editorial questions, corrections, and partnership notes for {SITE_CONFIG.name}. We read every message; response time
          is usually a few business days.
        </p>

        <p className="mt-8 text-sm text-slate-600">
          Prefer self-serve answers? Visit the{' '}
          <Link href="/help" className="font-medium text-[#0d7a7a] underline underline-offset-2">
            Help
          </Link>{' '}
          page.
        </p>
      </main>
      <Footer />
    </div>
  )
}
