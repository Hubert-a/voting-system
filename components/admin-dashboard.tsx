"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LogOut, Play, Square, Users, BarChart3, User, Eye, EyeOff } from "lucide-react"
import { useVotingStore } from "@/lib/voting-store"
import { CandidateManager } from "./candidate-manager"

export function AdminDashboard() {
  const {
    adminLogout,
    votingSession,
    startVoting,
    stopVoting,
    getVotingResults,
    getVoterStats,
    candidates,
    showResults,
    hideResults,
  } = useVotingStore()

  const results = getVotingResults()
  const voterStats = getVoterStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Voting System Admin</h1>
            <div className="flex items-center gap-4">
              <Badge variant={votingSession.isActive ? "default" : "secondary"}>
                {votingSession.isActive ? "Voting Active" : "Voting Inactive"}
              </Badge>
              <Button variant="outline" onClick={adminLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{voterStats.votedCount}</div>
              <p className="text-xs text-muted-foreground">out of {voterStats.totalVoters} registered voters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turnout Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {voterStats.totalVoters > 0 ? Math.round((voterStats.votedCount / voterStats.totalVoters) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-8">
          <Button
            onClick={startVoting}
            disabled={votingSession.isActive || candidates.length === 0}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Voting
          </Button>
          <Button
            onClick={stopVoting}
            disabled={!votingSession.isActive}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Voting
          </Button>

          {/* Add Results Display Controls */}
          {!votingSession.isActive && (
            <Button
              onClick={votingSession.displayResults ? hideResults : showResults}
              variant={votingSession.displayResults ? "secondary" : "default"}
              className="flex items-center gap-2"
              disabled={candidates.length === 0}
            >
              {votingSession.displayResults ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Results from Voters
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Display Results to Voters
                </>
              )}
            </Button>
          )}
        </div>

        <Tabs defaultValue="results" className="space-y-4">
          <TabsList>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="candidates">Manage Candidates</TabsTrigger>
            <TabsTrigger value="voters">Voter Status</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Voting Results</CardTitle>
                <CardDescription>Real-time results of the current voting session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.length === 0 ? (
                  <p className="text-muted-foreground">No candidates available</p>
                ) : (
                  results.map((result) => (
                    <div key={result.candidate.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {result.candidate.imageUrl ? (
                              <img
                                src={result.candidate.imageUrl || "/placeholder.svg"}
                                alt={result.candidate.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium">{result.candidate.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {result.voteCount} votes ({result.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={result.percentage} className="h-2" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateManager />
          </TabsContent>

          <TabsContent value="voters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Voter Statistics</CardTitle>
                <CardDescription>Overview of voter participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{voterStats.votedCount}</div>
                    <div className="text-sm text-green-600">Voted</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{voterStats.notVotedCount}</div>
                    <div className="text-sm text-gray-600">Not Voted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
