"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChromeIcon as Google } from "lucide-react"

export default function StudentLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      router.push("/student/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-secondary">Student Login</CardTitle>
          <CardDescription>Sign in to access your learning materials</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-6 border-gray-300 hover:border-secondary hover:bg-blue-50"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Google className="h-5 w-5" />
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Secure authentication powered by Google
        </CardFooter>
      </Card>
    </div>
  )
}