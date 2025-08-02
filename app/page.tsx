"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users } from "lucide-react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"
import { VoterInterface } from "@/components/voter-interface"
import { useVotingStore } from "@/lib/voting-store"

type UserType = "admin" | "voter" | null

export default function HomePage() {
  const [userType, setUserType] = useState<UserType>(null)
  const isAdminLoggedIn = useVotingStore((state) => state.isAdminLoggedIn)
  const votingSession = useVotingStore((state) => state.votingSession) // Get the entire votingSession

  // Show admin dashboard if admin is logged in
  if (userType === "admin" && isAdminLoggedIn) {
    return <AdminDashboard />
  }

  // Show admin login if admin type selected
  if (userType === "admin") {
    return <AdminLogin />
  }

  // Show voter interface if voter type selected
  if (userType === "voter") {
    // Pass the displayResults property directly
    return <VoterInterface showResults={votingSession.displayResults || false} />
  }

  // Show user type selection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Voting System</h1>
          <p className="text-xl text-gray-600">Choose your access type to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Manage candidates, control voting sessions, and view results</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setUserType("admin")}>
                Login as Admin
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Voter Access</CardTitle>
              <CardDescription>Cast your vote in the current voting session</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" onClick={() => setUserType("voter")}>
                Continue as Voter
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Admin Password: admin123</p>
          <p>Use any ID as Voter ID (e.g., voter1, voter2, etc.)</p>
        </div>
      </div>
    </div>
  )
}
