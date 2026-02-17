import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="brand-name text-2xl mb-8">DWARKA</h1>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-foreground hover:bg-foreground/90",
              card: "shadow-none border border-border",
            },
          }}
        />
      </div>
    </div>
  )
}
