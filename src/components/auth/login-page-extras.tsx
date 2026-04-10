'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

function getSafeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

function LoginPanelInner({
  submitClassName,
  inputClassName,
  mutedClass,
}: {
  submitClassName: string
  inputClassName: string
  mutedClass: string
}) {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get('next'))
  const registerHref = searchParams.get('next')
    ? `/register?next=${encodeURIComponent(searchParams.get('next')!)}`
    : '/register'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    try {
      await login(email.trim(), password)
      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Sign in failed. Try again.')
    }
  }

  return (
    <>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
        <input
          className={inputClassName}
          placeholder="Email address"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          disabled={isLoading}
        />
        <input
          className={inputClassName}
          placeholder="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          disabled={isLoading}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={isLoading} className={submitClassName}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 text-sm ${mutedClass}`}>
        <Link href="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
        <Link href={registerHref} className="inline-flex items-center gap-2 font-semibold hover:underline">
          <Sparkles className="h-4 w-4" />
          Create account
        </Link>
      </div>
    </>
  )
}

export function LoginFormWithFooter({
  submitClassName,
  inputClassName,
  mutedClass,
}: {
  submitClassName: string
  inputClassName: string
  mutedClass: string
}) {
  return (
    <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-sm bg-slate-100" aria-hidden />}>
      <LoginPanelInner submitClassName={submitClassName} inputClassName={inputClassName} mutedClass={mutedClass} />
    </Suspense>
  )
}
