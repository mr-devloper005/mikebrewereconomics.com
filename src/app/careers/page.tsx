import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'

const openings = [
  { title: 'Economics writer (contract)', location: 'Remote', detail: '2–4 pieces per month; strong editing process.' },
  { title: 'Research assistant', location: 'Remote', detail: 'Support charts, citations, and data checks for long articles.' },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarShell />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#111]">Careers</h1>
        <p className="mt-4 text-sm leading-7 text-[#555]">
          {SITE_CONFIG.name} hires slowly and favors editors and writers who care about careful economics communication. Below
          are illustrative roles; availability depends on budget and editorial calendar.
        </p>
        <ul className="mt-12 space-y-8">
          {openings.map((job) => (
            <li key={job.title} className="border-b border-slate-200 pb-8 last:border-0">
              <h2 className="text-lg font-semibold text-[#111]">{job.title}</h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{job.location}</p>
              <p className="mt-3 text-sm leading-7 text-[#555]">{job.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-sm text-[#555]">
          To apply, email a CV and short cover letter via{' '}
          <Link href="/contact" className="font-semibold text-[#111] underline">
            our contact page
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  )
}
