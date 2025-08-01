"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, User, BarChart3 } from "lucide-react"
import { useVotingStore } from "@/lib/voting-store"

export function VoterResults() {
  const { getVotingResults, getVoterStats, votingSession } = useVotingStore()

  const results = getVotingResults()
  const voterStats = getVoterStats()
  const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0)

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold text-gray-600">
            {index + 1}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Voting Results</h1>
          <p className="text-xl text-gray-600">Final results of the voting session</p>
          {votingSession.endTime && (
            <p className="text-sm text-gray-500 mt-2">
              Voting ended on {new Date(votingSession.endTime).toLocaleString()}
            </p>
          )}
        </div>

        {/* Voting Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{voterStats.votedCount}</div>
              <p className="text-xs text-muted-foreground">out of {voterStats.totalVoters} registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {voterStats.totalVoters > 0 ? Math.round((voterStats.votedCount / voterStats.totalVoters) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Final Results
            </CardTitle>
            <CardDescription>Candidates ranked by number of votes received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No results available</p>
            ) : (
              results.map((result, index) => (
                <div key={result.candidate.id} className="relative">
                  <div className="flex items-center space-x-4 p-4 bg-white border rounded-lg shadow-sm">
                    {/* Rank */}
                    <div className="flex-shrink-0">{getRankIcon(index)}</div>

                    {/* Candidate Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {result.candidate.imageUrl ? (
                          <img
                            src={result.candidate.imageUrl || "/placeholder.svg"}
                            alt={result.candidate.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{result.candidate.name}</h3>
                          {index === 0 && result.voteCount > 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Winner</Badge>
                          )}
                        </div>
                        {result.candidate.description && (
                          <p className="text-sm text-muted-foreground">{result.candidate.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Vote Count and Percentage */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold">{result.voteCount}</div>
                      <div className="text-sm text-muted-foreground">{result.percentage.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 px-4">
                    <Progress
                      value={result.percentage}
                      className="h-3"
                      style={{
                        background: index === 0 ? "linear-gradient(to right, #fbbf24, #f59e0b)" : undefined,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Winner Announcement */}
        {results.length > 0 && results[0].voteCount > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
              <p className="text-xl text-gray-700 mb-4">
                <span className="font-semibold">{results[0].candidate.name}</span> wins with{" "}
                <span className="font-bold">{results[0].voteCount}</span> votes ({results[0].percentage.toFixed(1)}%)
              </p>
              {results[0].candidate.description && <p className="text-gray-600">{results[0].candidate.description}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
