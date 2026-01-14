'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings, User, Bell, Lock, Mail, Phone, Home, Heart, Search, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/back-button'

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Profile settings
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Notification preferences
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [newListings, setNewListings] = useState(true)
  const [priceChanges, setPriceChanges] = useState(true)
  const [savedSearchAlerts, setSavedSearchAlerts] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    try {
      const supabase = createClient()
      
      // Load user metadata
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      if (userData?.user_metadata) {
        setFullName(userData.user_metadata.full_name || '')
        setPhone(userData.user_metadata.phone || '')
      }

      // Load notification preferences from user_metadata or default
      const prefs = userData?.user_metadata?.notification_preferences || {}
      setEmailAlerts(prefs.email_alerts ?? true)
      setSmsAlerts(prefs.sms_alerts ?? false)
      setNewListings(prefs.new_listings ?? true)
      setPriceChanges(prefs.price_changes ?? true)
      setSavedSearchAlerts(prefs.saved_search_alerts ?? true)
    } catch (error) {
      console.error('Error loading user settings:', error)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone
        }
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.updateUser({
        data: {
          notification_preferences: {
            email_alerts: emailAlerts,
            sms_alerts: smsAlerts,
            new_listings: newListings,
            price_changes: priceChanges,
            saved_search_alerts: savedSearchAlerts
          }
        }
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Notification preferences updated'
      })
    } catch (error: any) {
      console.error('Error updating notifications:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update preferences',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                <Button variant="ghost" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  BuyAbility
                </Button>
              </Link>
              <Link href="/account/settings">
                <Button variant="ghost" size="sm" className="font-medium">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your profile and notification preferences
            </p>
          </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 XX XXX XXXX"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive updates about properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Delivery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailAlerts">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive property alerts via email
                      </p>
                    </div>
                    <Switch
                      id="emailAlerts"
                      checked={emailAlerts}
                      onCheckedChange={setEmailAlerts}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsAlerts">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive property alerts via SMS (coming soon)
                      </p>
                    </div>
                    <Switch
                      id="smsAlerts"
                      checked={smsAlerts}
                      onCheckedChange={setSmsAlerts}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Alert Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newListings">New Listings</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify me when new properties are listed
                      </p>
                    </div>
                    <Switch
                      id="newListings"
                      checked={newListings}
                      onCheckedChange={setNewListings}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="priceChanges">Price Changes</Label>
                      <p className="text-sm text-muted-foreground">
                        Alert me when property prices change
                      </p>
                    </div>
                    <Switch
                      id="priceChanges"
                      checked={priceChanges}
                      onCheckedChange={setPriceChanges}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="savedSearchAlerts">Saved Search Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified for properties matching your personas
                      </p>
                    </div>
                    <Switch
                      id="savedSearchAlerts"
                      checked={savedSearchAlerts}
                      onCheckedChange={setSavedSearchAlerts}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications} disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your password to keep your account secure
                </p>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      const supabase = createClient()
                      const { error } = await supabase.auth.resetPasswordForEmail(user.email!, {
                        redirectTo: `${window.location.origin}/auth/reset-password`
                      })
                      
                      if (error) throw error

                      toast({
                        title: 'Password Reset Email Sent',
                        description: 'Check your email for the password reset link'
                      })
                    } catch (error: any) {
                      toast({
                        title: 'Error',
                        description: error.message || 'Failed to send reset email',
                        variant: 'destructive'
                      })
                    }
                  }}
                >
                  Reset Password
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Delete your account and all associated data
                </p>
                <Button variant="destructive" disabled>
                  Delete Account (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
