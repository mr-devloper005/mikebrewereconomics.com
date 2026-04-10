'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, User, FileText, Building2, LayoutGrid, Tag, Image as ImageIcon, ChevronRight, ChevronDown, Sparkles, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { NAVBAR_OVERRIDE_ENABLED, NavbarOverride } from '@/overrides/navbar'

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  ssr: false,
  loading: () => null,
})

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantClasses = {
  'compact-bar': {
    shell: 'border-b border-slate-200/80 bg-white/88 text-slate-950 backdrop-blur-xl',
    logo: 'rounded-2xl border border-slate-200 bg-white shadow-sm',
    active: 'bg-slate-950 text-white',
    idle: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
    cta: 'rounded-full bg-slate-950 text-white hover:bg-slate-800',
    mobile: 'border-t border-slate-200/70 bg-white/95',
  },
  'editorial-bar': {
    shell: 'border-b border-[#d7c4b3] bg-[#fff7ee]/90 text-[#2f1d16] backdrop-blur-xl',
    logo: 'rounded-full border border-[#dbc6b6] bg-white shadow-sm',
    active: 'bg-[#2f1d16] text-[#fff4e4]',
    idle: 'text-[#72594a] hover:bg-[#f2e5d4] hover:text-[#2f1d16]',
    cta: 'rounded-full bg-[#2f1d16] text-[#fff4e4] hover:bg-[#452920]',
    mobile: 'border-t border-[#dbc6b6] bg-[#fff7ee]',
  },
  'floating-bar': {
    shell: 'border-b border-transparent bg-transparent text-white',
    logo: 'rounded-[1.35rem] border border-white/12 bg-white/8 shadow-[0_16px_48px_rgba(15,23,42,0.22)] backdrop-blur',
    active: 'bg-[#8df0c8] text-[#07111f]',
    idle: 'text-slate-200 hover:bg-white/10 hover:text-white',
    cta: 'rounded-full bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    mobile: 'border-t border-white/10 bg-[#09101d]/96',
  },
  'utility-bar': {
    shell: 'border-b border-[#d7deca] bg-[#f4f6ef]/94 text-[#1f2617] backdrop-blur-xl',
    logo: 'rounded-xl border border-[#d7deca] bg-white shadow-sm',
    active: 'bg-[#1f2617] text-[#edf5dc]',
    idle: 'text-[#56604b] hover:bg-[#e7edd9] hover:text-[#1f2617]',
    cta: 'rounded-lg bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
    mobile: 'border-t border-[#d7deca] bg-[#f4f6ef]',
  },
} as const

const directoryPalette = {
  'directory-clean': {
    shell: 'border-b border-slate-200 bg-white/94 text-slate-950 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl',
    logo: 'rounded-2xl border border-slate-200 bg-slate-50',
    nav: 'text-slate-600 hover:text-slate-950',
    search: 'border border-slate-200 bg-slate-50 text-slate-600',
    cta: 'bg-slate-950 text-white hover:bg-slate-800',
    post: 'border border-slate-200 bg-white text-slate-950 hover:bg-slate-50',
    mobile: 'border-t border-slate-200 bg-white',
  },
  'market-utility': {
    shell: 'border-b border-[#d7deca] bg-[#f4f6ef]/96 text-[#1f2617] shadow-[0_1px_0_rgba(64,76,34,0.06)] backdrop-blur-xl',
    logo: 'rounded-xl border border-[#d7deca] bg-white',
    nav: 'text-[#56604b] hover:text-[#1f2617]',
    search: 'border border-[#d7deca] bg-white text-[#56604b]',
    cta: 'bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
    post: 'border border-[#d7deca] bg-white text-[#1f2617] hover:bg-[#eef2e4]',
    mobile: 'border-t border-[#d7deca] bg-[#f4f6ef]',
  },
} as const

const resourceLinks = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Help', href: '/help' },
  { name: 'Status', href: '/status' },
]

function EditorialLibraryNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  const navigation = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const mobileNavigation = navigation.map((task) => ({
    name: task.label,
    href: task.route,
    icon: taskIcons[task.key] || LayoutGrid,
  }))
  return (
    <header className="sticky top-0 z-50 w-full shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      <div className="bg-black text-[11px] font-medium uppercase tracking-[0.14em] text-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-6 px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/about" className="transition-colors hover:text-white">
            Help
          </Link>
          <Link href="/search" className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white">
            Advanced search
          </Link>
          {!isAuthenticated ? (
            <Link href="/login" className="transition-colors hover:text-white">
              Sign in
            </Link>
          ) : null}
        </div>
      </div>

      <div className="border-b border-white/10 bg-[#222222] text-white">
        <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:gap-8 lg:px-8">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1">
              <img src="/favicon.png?v=20260401" alt="" width="32" height="32" className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold tracking-tight text-white">{SITE_CONFIG.name}</span>
              <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
                {siteContent.navbar.tagline}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Browse
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px] border-slate-200 bg-white text-slate-900 shadow-lg">
                {navigation.map((task) => {
                  const Icon = taskIcons[task.key] || LayoutGrid
                  return (
                    <DropdownMenuItem key={task.key} asChild>
                      <Link href={task.route} className="flex cursor-pointer items-center gap-2">
                        <Icon className="h-4 w-4 text-[#0d7a7a]" />
                        {task.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Resources
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[200px] border-slate-200 bg-white text-slate-900 shadow-lg">
                {resourceLinks.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/search" className="cursor-pointer">
                    Search
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <form
            action="/search"
            method="get"
            className="ml-auto hidden min-w-0 flex-1 items-stretch justify-end gap-0 md:flex md:max-w-xl lg:max-w-2xl"
          >
            <div className="flex w-full flex-col items-end gap-1">
              <span className="sr-only">Search articles and resources</span>
              <div className="flex w-full overflow-hidden rounded-sm border border-white/20 bg-white shadow-sm">
                <input
                  name="q"
                  type="search"
                  placeholder="Search articles, authors, topics…"
                  className="h-10 min-w-0 flex-1 border-0 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#333399]/30 focus:ring-inset"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="flex h-10 w-11 shrink-0 items-center justify-center bg-[#333399] text-white transition-colors hover:bg-[#2a2a7a]"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-2">
            {isAuthenticated ? (
              <NavbarAuthControls />
            ) : (
              <Button
                size="sm"
                asChild
                className="hidden rounded-sm border-0 bg-[#0d7a7a] px-4 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#0a6565] sm:inline-flex"
              >
                <Link href="/register">Join</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        <div className="border-t border-white/10 px-4 pb-3 md:hidden">
          <form action="/search" method="get" className="flex overflow-hidden rounded-sm border border-white/20 bg-white">
            <input
              name="q"
              type="search"
              placeholder="Search…"
              className="h-10 min-w-0 flex-1 border-0 bg-white px-3 text-sm text-slate-900 focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-10 w-11 shrink-0 items-center justify-center bg-[#333399] text-white"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-white/10 bg-[#1a1a1a] lg:hidden">
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
              {mobileNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold',
                      isActive ? 'bg-[#0d7a7a]/25 text-white' : 'text-white/85 hover:bg-white/5',
                    )}
                  >
                    <item.icon className="h-5 w-5 text-[#5cb3b3]" />
                    {item.name}
                  </Link>
                )
              })}
              {resourceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm text-white/80 hover:bg-white/5"
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <Link
                  href="/create/article"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-1 block rounded-md border border-[#0d7a7a]/50 bg-[#0d7a7a]/20 px-3 py-3 text-center text-sm font-semibold text-white"
                >
                  New article
                </Link>
              ) : null}
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 block rounded-md border border-white/20 px-3 py-3 text-center text-sm font-semibold text-white"
                >
                  Sign in
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export function Navbar() {
  if (NAVBAR_OVERRIDE_ENABLED) {
    return <NavbarOverride />
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { recipe } = getFactoryState()

  const navigation = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const primaryNavigation = navigation.slice(0, 5)
  const mobileNavigation = navigation.map((task) => ({
    name: task.label,
    href: task.route,
    icon: taskIcons[task.key] || LayoutGrid,
  }))
  const primaryTask = SITE_CONFIG.tasks.find((task) => task.key === recipe.primaryTask && task.enabled) || primaryNavigation[0]
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'

  if (isDirectoryProduct) {
    const palette = directoryPalette[(recipe.brandPack === 'market-utility' ? 'market-utility' : 'directory-clean') as keyof typeof directoryPalette]

    return (
      <>
        <header className={cn('sticky top-0 z-50 w-full xl:hidden', palette.shell)}>
          <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/" className="flex min-w-0 items-center gap-3">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden p-1.5', palette.logo)}>
                  <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="44" height="44" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="block truncate text-lg font-semibold">{SITE_CONFIG.name}</span>
                  <span className="block truncate text-[10px] uppercase tracking-[0.22em] opacity-60">{siteContent.navbar.tagline}</span>
                </div>
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!isAuthenticated ? (
                <Button size="sm" asChild className={cn('rounded-full', palette.cta)}>
                  <Link href="/register">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Listing
                  </Link>
                </Button>
              ) : (
                <NavbarAuthControls />
              )}
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>

          {isMobileMenuOpen && (
            <div className={palette.mobile}>
              <div className="space-y-2 px-4 py-4">
                <div className={cn('mb-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium', palette.search)}>
                  <Search className="h-4 w-4" />
                  Find businesses, spaces, and services
                </div>
                {mobileNavigation.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? 'bg-foreground text-background' : palette.post)}>
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </header>

        <aside className={cn('hidden xl:fixed xl:inset-y-0 xl:left-0 xl:z-40 xl:flex xl:w-80 xl:flex-col xl:border-r xl:px-6 xl:py-7', palette.shell)}>
          <div className="flex h-full flex-col">
            <Link href="/" className="flex items-center gap-3">
              <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5', palette.logo)}>
                <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="block truncate text-xl font-semibold">{SITE_CONFIG.name}</span>
                <span className="block truncate text-[10px] uppercase tracking-[0.24em] opacity-60">{siteContent.navbar.tagline}</span>
              </div>
            </Link>

            <div className={cn('mt-7 flex items-center gap-3 rounded-[1.4rem] px-4 py-3 text-sm', palette.search)}>
              <Search className="h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <div className="truncate font-medium">Find local businesses</div>
                <div className="truncate text-xs opacity-70">Search by service, category, or city</div>
              </div>
            </div>

            {primaryTask ? (
              <Link href={primaryTask.route} className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-current/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                <Sparkles className="h-3.5 w-3.5" />
                {primaryTask.label}
              </Link>
            ) : null}

            <nav className="mt-8 space-y-2">
              {primaryNavigation.map((task) => {
                const isActive = pathname.startsWith(task.route)
                const Icon = taskIcons[task.key] || LayoutGrid
                return (
                  <Link
                    key={task.key}
                    href={task.route}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                      isActive ? 'bg-foreground text-background' : palette.post,
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{task.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8 grid gap-3">
              <div className={cn('rounded-[1.6rem] px-4 py-4 text-sm', palette.post)}>
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4" />
                  Local discovery
                </div>
                <p className="mt-2 text-xs leading-6 opacity-75">Use business listings, classifieds, and support lanes without cramped top navigation.</p>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-8">
              {isAuthenticated ? (
                <NavbarAuthControls />
              ) : (
                <div className="space-y-3">
                  <Button variant="ghost" size="sm" asChild className="w-full justify-center rounded-full px-4">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className={cn('w-full justify-center rounded-full', palette.cta)}>
                    <Link href="/register">
                      <Plus className="mr-1 h-4 w-4" />
                      Add Listing
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </>
    )
  }

  if (recipe.navbar === 'editorial-bar') {
    return <EditorialLibraryNavbar />
  }

  const style = variantClasses[recipe.navbar]
  const isFloating = recipe.navbar === 'floating-bar'
  const isEditorial = recipe.navbar === 'editorial-bar'
  const isUtility = recipe.navbar === 'utility-bar'

  return (
    <>
      <header data-mobile-nav="true" className={cn('sticky top-0 z-50 w-full xl:hidden', style.shell)}>
        <nav className={cn('mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8', isFloating ? 'h-24 pt-4' : 'h-20')}>
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5', style.logo)}>
                <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="block truncate text-lg font-semibold">{SITE_CONFIG.name}</span>
                <span className="block truncate text-[10px] uppercase tracking-[0.22em] opacity-70">{siteContent.navbar.tagline}</span>
              </div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!isAuthenticated ? (
              <Button size="sm" asChild className={cn('rounded-full', style.cta)}>
                <Link href="/register">
                  <Plus className="mr-1 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            ) : (
              <NavbarAuthControls />
            )}
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className={style.mobile}>
            <div className="space-y-2 px-4 py-4">
              {mobileNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <aside className={cn('hidden xl:fixed xl:inset-y-0 xl:left-0 xl:z-40 xl:flex xl:w-80 xl:flex-col xl:overflow-y-auto xl:border-r xl:px-6 xl:py-7', style.shell)}>
        <div className="flex h-full flex-col">
          <Link href="/" className="flex items-center gap-3">
            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5', style.logo)}>
              <img src="/favicon.png?v=20260401" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xl font-semibold">{SITE_CONFIG.name}</span>
              <span className="block truncate text-[10px] uppercase tracking-[0.24em] opacity-70">{siteContent.navbar.tagline}</span>
            </div>
          </Link>

          <div className={cn('mt-7 rounded-[1.35rem] border border-current/10 px-4 py-4', isFloating ? 'bg-white/6 backdrop-blur' : isEditorial ? 'bg-white/70' : isUtility ? 'bg-white/80' : 'bg-slate-50')}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
              <Search className="h-3.5 w-3.5" />
              Quick Find
            </div>
            <p className="mt-2 text-sm leading-6 opacity-80">Browse by task, lane, or content type without cramped top navigation.</p>
          </div>

          {primaryTask ? (
            <Link href={primaryTask.route} className={cn('mt-5 inline-flex items-center gap-2 self-start rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]', isFloating ? 'border border-white/10 bg-white/6 text-white/80' : 'border border-current/10 bg-white/70 opacity-80')}>
              <Sparkles className="h-3.5 w-3.5" />
              {primaryTask.label}
            </Link>
          ) : null}

          <nav className="mt-8 space-y-2">
            {primaryNavigation.map((task) => {
              const Icon = taskIcons[task.key] || LayoutGrid
              const isActive = pathname.startsWith(task.route)
              return (
                <Link key={task.key} href={task.route} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{task.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-45" />
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 space-y-3">
            <div className={cn('rounded-[1.6rem] border border-current/10 px-4 py-4 text-sm', isFloating ? 'bg-white/6 text-slate-200' : 'bg-white/75')}>
              <div className="font-semibold">Navigation Note</div>
              <p className="mt-2 text-xs leading-6 opacity-75">Desktop navigation now sits on the left so long task labels do not collide with actions or utility controls.</p>
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-8">
            {isAuthenticated ? (
              <NavbarAuthControls />
            ) : (
              <div className="space-y-3">
                <Button variant="ghost" size="sm" asChild className="w-full justify-center rounded-full px-4">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className={cn('w-full justify-center rounded-full', style.cta)}>
                  <Link href="/register">
                    <Plus className="mr-1 h-4 w-4" />
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )

}
