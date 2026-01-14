'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { AffordabilityProfile } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TrendingUp, Plus, Trash2, Calculator, DollarSign, Home, Heart, Search, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { calculateAffordability } from '@/lib/affordability'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/back-button'

export default function BuyAbilityPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<AffordabilityProfile[]>([])
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null)
  
  // Form state
  const [profileName, setProfileName] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [monthlyExpenses, setMonthlyExpenses] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [interestRate, setInterestRate] = useState('11.75')
  const [loanTermYears, setLoanTermYears] = useState('20')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadProfiles()
    }
  }, [user])

  const loadProfiles = async () => {
    try {
      setLoading(true)
      // Note: This table doesn't exist yet in the schema, so we'll create it client-side for now
      // In production, you'd want to add this table to your Supabase schema
      const stored = localStorage.getItem(`affordability_profiles_${user?.id}`)
      if (stored) {
        setProfiles(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfiles = (updatedProfiles: AffordabilityProfile[]) => {
    localStorage.setItem(`affordability_profiles_${user?.id}`, JSON.stringify(updatedProfiles))
    setProfiles(updatedProfiles)
  }

  const handleCreateProfile = () => {
    try {
      const income = parseFloat(monthlyIncome)
      const expenses = parseFloat(monthlyExpenses)
      const deposit = parseFloat(depositAmount)
      const rate = parseFloat(interestRate)
      const term = parseInt(loanTermYears)

      if (!profileName || !income || !deposit || !rate || !term) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
        return
      }

      const result = calculateAffordability({
        monthlyIncome: income,
        deposit: deposit,
        interestRate: rate,
        termYears: term
      })

      const newProfile: AffordabilityProfile = {
        id: Date.now().toString(),
        user_id: user!.id,
        name: profileName,
        monthly_income: income,
        monthly_expenses: expenses || 0,
        deposit_amount: deposit,
        interest_rate: rate,
        loan_term_years: term,
        max_affordable_price: result.maxPurchasePrice,
        max_monthly_payment: result.monthlyRepayment,
        created_at: new Date().toISOString()
      }

      const updatedProfiles = [newProfile, ...profiles]
      saveProfiles(updatedProfiles)

      toast({
        title: 'Success',
        description: 'BuyAbility profile created successfully'
      })

      // Reset form
      setProfileName('')
      setMonthlyIncome('')
      setMonthlyExpenses('')
      setDepositAmount('')
      setInterestRate('11.75')
      setLoanTermYears('20')
      setShowNewDialog(false)
    } catch (error: any) {
      console.error('Error creating profile:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create profile',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = () => {
    if (!deletingProfileId) return

    const updatedProfiles = profiles.filter(p => p.id !== deletingProfileId)
    saveProfiles(updatedProfiles)

    toast({
      title: 'Success',
      description: 'Profile deleted successfully'
    })

    setDeletingProfileId(null)
  }

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <BackButton fallbackUrl="/account" label="Back to Dashboard" />
            <div className="flex items-center gap-2">
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/saved">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved
                </Button>
              </Link>
              <Link href="/account/personas">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Personas
                </Button>
              </Link>
              <Link href="/account/buyability">
                <Button variant="ghost" size="sm" className="font-medium">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  BuyAbility
                </Button>
              </Link>
              <Link href="/account/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                My BuyAbility
              </h1>
              <p className="text-muted-foreground">
                Track your property affordability profiles over time
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/calculator">
                <Button variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculator
                </Button>
              </Link>
              <Button onClick={() => setShowNewDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Profile
          </Button>
        </div>
      </div>

      {/* Profiles List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="pt-6">
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No BuyAbility Profiles Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create affordability profiles to understand what you can afford and track changes over time as your financial situation evolves.
            </p>
            <Button size="lg" onClick={() => setShowNewDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{profile.name}</CardTitle>
                    <CardDescription>
                      Created {new Date(profile.created_at).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingProfileId(profile.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Column - Input Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Financial Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Income:</span>
                        <span className="font-medium">R {profile.monthly_income.toLocaleString()}</span>
                      </div>
                      {profile.monthly_expenses > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Expenses:</span>
                          <span className="font-medium">R {profile.monthly_expenses.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Deposit Available:</span>
                        <span className="font-medium">R {profile.deposit_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Interest Rate:</span>
                        <span className="font-medium">{profile.interest_rate}% p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Loan Term:</span>
                        <span className="font-medium">{profile.loan_term_years} years</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Affordability Results */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Your BuyAbility</h4>
                    <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Max Property Price</span>
                      </div>
                      <p className="text-3xl font-bold text-primary">
                        R {profile.max_affordable_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Monthly Repayment</span>
                      </div>
                      <p className="text-2xl font-bold">
                        R {profile.max_monthly_payment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Link href={`/search?maxPrice=${Math.floor(profile.max_affordable_price)}`}>
                    <Button className="w-full">
                      Browse Properties Within Budget
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create New Profile Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create BuyAbility Profile</DialogTitle>
            <DialogDescription>
              Calculate what you can afford based on your financial situation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profileName">Profile Name *</Label>
              <Input
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g., Current Situation"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (Before Tax) *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  placeholder="15000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="depositAmount">Deposit Amount Available *</Label>
              <Input
                id="depositAmount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="200000"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10% deposit recommended for better rates
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (% p.a.) *</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="11.75"
                />
                <p className="text-xs text-muted-foreground">
                  Current average: 11.75%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTermYears">Loan Term (Years) *</Label>
                <Input
                  id="loanTermYears"
                  type="number"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(e.target.value)}
                  placeholder="20"
                />
                <p className="text-xs text-muted-foreground">
                  Typically 20-30 years
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile}>
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProfileId} onOpenChange={() => setDeletingProfileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete BuyAbility Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your affordability profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
      </main>
      <Footer />
    </div>
  )
}
