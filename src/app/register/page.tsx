import { Suspense } from 'react'
import { Bookmark, Building2, FileText, Image as ImageIcon } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { RegisterForm } from '@/components/auth/register-form'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'

function getRegisterConfig(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[#f8fbff] text-slate-950',
      panel: 'border border-slate-200 bg-white',
      side: 'border border-slate-200 bg-slate-50',
      muted: 'text-slate-600',
      input: 'h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300',
      action:
        'inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60',
      icon: Building2,
      title: 'Create a business-ready account',
      body: 'List services, manage locations, and activate trust signals with a proper directory workflow.',
    }
  }
  if (kind === 'editorial') {
    return {
      shell: 'bg-[#f4f4f4] text-[#222]',
      panel: 'border border-slate-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_20px_50px_rgba(15,23,42,0.06)]',
      side: 'border border-slate-200/80 bg-white shadow-sm',
      muted: 'text-slate-600',
      input: 'h-12 rounded-sm border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0d7a7a] focus:outline-none focus:ring-2 focus:ring-[#0d7a7a]/20',
      action:
        'inline-flex h-12 w-full items-center justify-center rounded-sm bg-[#333399] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#2a2a7a] disabled:opacity-60',
      icon: FileText,
      title: 'Create your library account',
      body: 'Register to save reading progress and use contributor tools. Your profile stays on this device after sign-in.',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[#07101f] text-white',
      panel: 'border border-white/10 bg-white/6',
      side: 'border border-white/10 bg-white/5',
      muted: 'text-slate-300',
      input: 'h-12 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/20',
      action:
        'inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#8df0c8] px-6 text-sm font-semibold text-[#07111f] hover:bg-[#77dfb8] disabled:opacity-60',
      icon: ImageIcon,
      title: 'Set up your creator profile',
      body: 'Launch a visual-first account with gallery publishing, identity surfaces, and profile-led discovery.',
    }
  }
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4]',
    side: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    input: 'h-12 rounded-xl border border-[#ddcdbd] bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b2b3b]/20',
    action:
      'inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#5b2b3b] px-6 text-sm font-semibold text-[#fff0f5] hover:bg-[#74364b] disabled:opacity-60',
    icon: Bookmark,
    title: 'Create a curator account',
    body: 'Build shelves, save references, and connect collections to your profile without a generic feed setup.',
  }
}

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const config = getRegisterConfig(productKind)
  const Icon = config.icon

  return (
    <div className={`min-h-screen ${config.shell}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className={`rounded-[2rem] p-8 ${config.side}`}>
            <Icon className="h-8 w-8" />
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{config.title}</h1>
            <p className={`mt-5 text-sm leading-8 ${config.muted}`}>{config.body}</p>
            <div className="mt-8 grid gap-4">
              {['Different onboarding per product family', 'No repeated one-size-fits-all shell', 'Profile, publishing, and discovery aligned'].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-current/10 px-4 py-4 text-sm">{item}</div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-8 ${config.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Create account</p>
            <Suspense fallback={<div className="mt-6 h-56 animate-pulse rounded-sm bg-slate-100" aria-hidden />}>
              <RegisterForm
                submitClassName={config.action}
                inputClassName={config.input}
                mutedClass={config.muted}
                errorClassName="text-sm text-red-600"
              />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
