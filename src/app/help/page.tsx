import Link from 'next/link'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    q: 'How do I search for an article?',
    a: 'Use the search field in the site header (desktop) or open Search in the mobile menu. Results match titles, summaries, and tags.',
  },
  {
    q: 'How do I submit or draft an article?',
    a: 'Sign in, then use New article in the navigation. You must be logged in; drafts are stored locally in your browser for this demo.',
  },
  {
    q: 'Where is my account data stored?',
    a: 'Sign-in for this site uses local browser storage on your device. It is not a cloud account unless your deployment connects to a real API.',
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <NavbarShell />
      <main className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-center font-serif text-3xl font-semibold text-[#222]">Help</h1>
        <p className="mt-3 text-center text-sm text-slate-600">Quick answers for reading and writing on this site.</p>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border-slate-100 px-2">
                <AccordionTrigger className="text-left text-sm font-medium text-[#222] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-slate-600">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <p className="mt-10 text-center text-sm text-slate-600">
          Still stuck?{' '}
          <Link href="/contact" className="font-semibold text-[#0d7a7a] underline underline-offset-2">
            Contact us
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
