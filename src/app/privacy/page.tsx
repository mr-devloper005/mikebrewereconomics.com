import type { Metadata } from 'next'
import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Privacy policy | ${SITE_CONFIG.name}`,
  description: 'How we handle information when you read and publish on this site.',
}

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'collect', label: 'What we collect' },
  { id: 'use', label: 'How we use it' },
  { id: 'storage', label: 'Local storage & accounts' },
  { id: 'rights', label: 'Your choices' },
  { id: 'contact', label: 'Contact' },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <NavbarShell />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          <aside className="mb-10 lg:mb-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d7a7a]">Legal</p>
            <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[#222] lg:text-3xl">Privacy</h1>
            <p className="mt-3 text-xs text-slate-500">Effective April 10, 2026</p>
            <nav className="mt-8 hidden space-y-2 text-sm lg:block" aria-label="On this page">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block border-l-2 border-transparent py-1 pl-3 text-slate-600 transition-colors hover:border-[#0d7a7a] hover:text-[#222]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 space-y-2 border-t border-slate-200 pt-6 text-xs text-slate-500">
              <Link href="/terms" className="block hover:text-[#0d7a7a]">
                Terms of use →
              </Link>
              <Link href="/cookies" className="block hover:text-[#0d7a7a]">
                Cookies →
              </Link>
            </div>
          </aside>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-lg font-semibold text-[#222]">Overview</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {SITE_CONFIG.name} is built for reading economics articles and, where enabled, publishing your own pieces.
                This policy explains what information may be processed in connection with that experience. If your
                deployment connects to external analytics or a real authentication API, additional notices may apply—this
                page describes the baseline behaviour of the public reading site and typical demo sign-in stored in the
                browser.
              </p>
            </section>

            <section id="collect" className="mt-10 scroll-mt-24 border-t border-slate-100 pt-10">
              <h2 className="text-lg font-semibold text-[#222]">What we collect</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-7 text-slate-600">
                <li>
                  <strong className="text-[#222]">Reading activity</strong> — Pages you open, search queries you submit to
                  our search route, and similar technical logs that servers normally keep (IP, user agent, timestamps) if
                  your host is configured to log them.
                </li>
                <li>
                  <strong className="text-[#222]">Account details (demo / local)</strong> — If you use the built-in sign-in
                  flow, name and email you enter may be stored in your browser&apos;s local storage on that device only,
                  unless your operator syncs them elsewhere.
                </li>
                <li>
                  <strong className="text-[#222]">Content you submit</strong> — Articles or drafts you create through forms
                  may be stored locally or sent to configured backends, depending on how the site is deployed.
                </li>
              </ul>
            </section>

            <section id="use" className="mt-10 scroll-mt-24 border-t border-slate-100 pt-10">
              <h2 className="text-lg font-semibold text-[#222]">How we use information</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                We use this information to operate the site, improve article discovery and layout, respond to support
                requests, protect against abuse, and comply with law. We do not sell personal data as a business model for
                this editorial product; any advertising or third-party tools should be disclosed separately by whoever
                operates the live deployment.
              </p>
            </section>

            <section id="storage" className="mt-10 scroll-mt-24 border-t border-slate-100 pt-10">
              <h2 className="text-lg font-semibold text-[#222]">Local storage &amp; accounts</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The template sign-in experience persists a session marker in local storage so you stay logged in on that
                browser. Clearing site data or using another device will not carry that session over. For production sites,
                operators should replace this with proper server-side auth and document retention accordingly.
              </p>
            </section>

            <section id="rights" className="mt-10 scroll-mt-24 border-t border-slate-100 pt-10">
              <h2 className="text-lg font-semibold text-[#222]">Your choices</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                You can clear cookies and local storage from your browser settings, use private browsing, or contact the
                site operator to access, correct, or delete information they hold. Rights such as GDPR data subject
                requests depend on who controls the deployment and where visitors reside.
              </p>
            </section>

            <section id="contact" className="mt-10 scroll-mt-24 border-t border-slate-100 pt-10">
              <h2 className="text-lg font-semibold text-[#222]">Questions</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                For privacy questions about this site, use the{' '}
                <Link href="/contact" className="font-medium text-[#333399] underline underline-offset-2">
                  contact page
                </Link>
                . We may update this policy from time to time; the effective date at the top will change when we do.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
