'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

function getSafeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

type RegisterFormProps = {
  submitClassName: string
  inputClassName: string
  errorClassName?: string
  mutedClass: string
}

export function RegisterForm({ submitClassName, inputClassName, errorClassName, mutedClass }: RegisterFormProps) {
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get('next'))
  const nextRaw = searchParams.get('next')
  const loginHref = nextRaw ? `/login?next=${encodeURIComponent(nextRaw)}` : '/login'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('Enter your name, email, and password.')
      return
    }
    try {
      await signup(name.trim(), email.trim(), password)
      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Could not create account. Try again.')
    }
  }

  return (
    <>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
        <input
          className={inputClassName}
          placeholder="Full name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          disabled={isLoading}
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          disabled={isLoading}
        />
        {error ? <p className={errorClassName || 'text-sm text-red-600'}>{error}</p> : null}
        <button type="submit" disabled={isLoading} className={submitClassName}>
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 text-sm ${mutedClass}`}>
        <span>Already have an account?</span>
        <Link href={loginHref} className="inline-flex items-center gap-2 font-semibold hover:underline">
          <Sparkles className="h-4 w-4" />
          Sign in
        </Link>
      </div>
    </>
  )
}
