'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, updateUser, isAuthReady } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!isAuthReady) return
    if (!user) {
      router.replace('/login?next=/settings')
    }
  }, [isAuthReady, user, router])

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setEmail(user.email || '')
  }, [user])

  const handleSave = () => {
    if (!user) return
    updateUser({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
    })
    toast({ title: 'Saved', description: 'Your account details were updated on this device.' })
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthReady || !user) {
    return (
      <div className="min-h-screen bg-[#f4f4f4]">
        <NavbarShell />
        <main className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-slate-600">Loading…</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <NavbarShell />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#222]">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">Basic account details stored locally in your browser.</p>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Display name</Label>
              <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={handleSave} className="rounded-sm bg-[#333399] hover:bg-[#2a2a7a]">
              Save changes
            </Button>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[#0d7a7a]">
            Privacy policy
          </Link>
          {' · '}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[#0d7a7a]">
            Terms
          </Link>
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-8 w-full justify-center border-slate-300 text-slate-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </main>
      <Footer />
    </div>
  )
}
