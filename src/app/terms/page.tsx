import type { Metadata } from 'next'
import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Terms of use | ${SITE_CONFIG.name}`,
  description: `Rules for using ${SITE_CONFIG.name} and our articles.`,
}

const clauses = [
  {
    n: '1',
    title: 'Agreement',
    text: `By accessing ${SITE_CONFIG.name}, you agree to these terms. If you do not agree, do not use the site. We may change these terms; continued use after changes means you accept the updated version.`,
  },
  {
    n: '2',
    title: 'Editorial content',
    text: 'Articles and analysis are provided for general information and education, not as financial, legal, or professional advice. You should verify facts and consult qualified advisers before acting on anything you read here.',
  },
  {
    n: '3',
    title: 'Your account',
    text: 'If the site offers sign-in, you are responsible for your credentials and for activity under your account. Notify us via contact if you suspect unauthorized use. Demo or local accounts may be reset when clearing browser data.',
  },
  {
    n: '4',
    title: 'User-submitted content',
    text: 'If you submit articles, comments, or other material, you represent that you have the right to share it and that it does not violate law or others’ rights. You grant the site operator a non-exclusive license to host, display, and distribute that content in connection with the service.',
  },
  {
    n: '5',
    title: 'Acceptable use',
    text: 'You may not use the site to harass others, spread malware, scrape in a way that harms performance, misrepresent affiliation with us, or break applicable law. We may suspend access for violations.',
  },
  {
    n: '6',
    title: 'Intellectual property',
    text: 'The site design, branding, and original articles are protected by copyright and other rights unless otherwise noted. Limited quoting for commentary or research is fine; bulk copying or commercial reuse requires permission.',
  },
  {
    n: '7',
    title: 'Disclaimer',
    text: 'The site is provided “as is.” We do not warrant uninterrupted or error-free operation. To the fullest extent permitted by law, we disclaim liability for indirect or consequential damages arising from your use of the site.',
  },
  {
    n: '8',
    title: 'Governing law',
    text: 'Unless your operator specifies otherwise, disputes are governed by the laws applicable to the entity operating this deployment, without regard to conflict-of-law rules.',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarShell />
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Legal</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#222]">Terms of use</h1>
          <p className="mt-4 text-sm text-slate-600">{SITE_CONFIG.name}</p>
          <p className="mt-2 text-xs text-slate-400">Effective April 10, 2026</p>
        </div>

        <ol className="mt-12 space-y-0">
          {clauses.map((c, i) => (
            <li
              key={c.n}
              className={`flex gap-5 pb-12 ${i < clauses.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0d7a7a]/12 text-sm font-bold text-[#0d7a7a]">
                {c.n}
              </span>
              <div>
                <h2 className="text-base font-semibold text-[#222]">{c.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{c.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[#0d7a7a]">
            Privacy policy
          </Link>
          <span className="mx-2">·</span>
          <Link href="/cookies" className="underline underline-offset-2 hover:text-[#0d7a7a]">
            Cookie policy
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
