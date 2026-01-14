import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AgentNav } from "@/components/agent/agent-nav"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if agent profile exists
  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!agent) {
    // If authenticated but no agent profile, maybe redirect to onboarding or account
    // For now allow access but functionality might be limited
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <AgentNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}