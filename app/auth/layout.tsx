import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "@/components/back-button"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center relative p-6 md:p-10 bg-muted/50">
        <div className="absolute top-6 left-4 sm:left-6 md:left-8">
          <BackButton fallbackUrl="/" />
        </div>
        <div className="w-full max-w-sm">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
