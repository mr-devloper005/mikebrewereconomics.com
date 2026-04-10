import type { Metadata } from 'next'
import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Editor's blog | ${SITE_CONFIG.name}`,
  description: 'Notes, updates, and reading lists from the editorial desk.',
}
const notes = [
  {
    date: 'March 2026',
    title: 'How we choose topics for the economics desk',
    excerpt: 'A short note on editorial priorities and how we balance news-driven pieces with evergreen explainers.',
  },
  {
    date: 'February 2026',
    title: 'Reading list: inflation and real wages',
    excerpt: 'Curated links and context for readers following the latest wage and price discussion.',
  },
  {
    date: 'January 2026',
    title: 'Site updates: search and article layout',
    excerpt: 'What changed in the library-style navigation and why it should make long articles easier to read.',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarShell />
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-[#222]">Editor&apos;s blog</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Notes from {SITE_CONFIG.name}—behind-the-scenes updates, reading lists, and short commentary. For full articles,
          visit{' '}
          <Link href="/articles" className="font-medium text-[#0d7a7a] underline underline-offset-2">
            the articles section
          </Link>
          .
        </p>
        <ol className="mt-12 space-y-10 border-l border-slate-200 pl-8">
          {notes.map((item) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[33px] top-1.5 h-2 w-2 rounded-full bg-[#0d7a7a]" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.date}</p>
              <h2 className="mt-2 text-xl font-semibold text-[#222]">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.excerpt}</p>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </div>
  )
}
