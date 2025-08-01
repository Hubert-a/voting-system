"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Vote, AlertCircle, User, Users, FileText, ArrowRight, ArrowLeft } from "lucide-react"
import { useVotingStore } from "@/lib/voting-store"
import type { VoterDetails } from "@/types/voting"
import { VoterResults } from "./voter-results"

export function VoterInterface() {
  const [currentStep, setCurrentStep] = useState(1)
  const [voterDetails, setVoterDetails] = useState<VoterDetails>({
    fullName: "",
    age: 0,
    location: "",
    indexNumber: "",
  })
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [hasSubmittedVote, setHasSubmittedVote] = useState(false)
  const [error, setError] = useState("")

  const { candidates, votingSession, castVote, voters } = useVotingStore()

  if (votingSession.displayResults) {
    return <VoterResults />
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!voterDetails.fullName.trim()) {
      setError("Please enter your full name")
      return
    }
    if (voterDetails.age < 18) {
      setError("You must be at least 18 years old to vote")
      return
    }
    if (!voterDetails.location.trim()) {
      setError("Please enter your location")
      return
    }
    if (!voterDetails.indexNumber.trim()) {
      setError("Please enter your index number")
      return
    }

    if (!votingSession.isActive) {
      setError("Voting is not currently active")
      return
    }

    // Check if voter already voted
    const existingVoter = voters.find((v) => v.voterDetails.indexNumber === voterDetails.indexNumber && v.hasVoted)
    if (existingVoter) {
      setError("This index number has already been used to vote")
      return
    }

    setError("")
    setCurrentStep(2)
  }

  const handleStep2Submit = () => {
    if (!selectedCandidate) {
      setError("Please select a candidate")
      return
    }
    setError("")
    setCurrentStep(3)
  }

  const handleFinalSubmit = () => {
    const success = castVote(voterDetails, selectedCandidate)
    if (success) {
      setHasSubmittedVote(true)
      setError("")
    } else {
      setError("Failed to cast vote. Please try again.")
    }
  }

  if (!votingSession.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Voting Not Active</h2>
            <p className="text-muted-foreground text-center">
              The voting session is not currently active. Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (hasSubmittedVote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vote Submitted Successfully!</h2>
            <p className="text-muted-foreground text-center">
              Thank you for participating in the voting process. Your vote has been recorded.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedCandidateData = candidates.find((c) => c.id === selectedCandidate)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <User className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Details</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <Users className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Candidates</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Summary</span>
            </div>
          </div>
        </div>

        {/* Step 1: Voter Details */}
        {currentStep === 1 && (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Voter Information
              </CardTitle>
              <CardDescription>Please provide your details to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={voterDetails.fullName}
                      onChange={(e) => setVoterDetails((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="120"
                      value={voterDetails.age || ""}
                      onChange={(e) =>
                        setVoterDetails((prev) => ({ ...prev, age: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="Enter your age"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={voterDetails.location}
                      onChange={(e) => setVoterDetails((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter your location"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="indexNumber">Index Number *</Label>
                    <Input
                      id="indexNumber"
                      value={voterDetails.indexNumber}
                      onChange={(e) => setVoterDetails((prev) => ({ ...prev, indexNumber: e.target.value }))}
                      placeholder="Enter your index number"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Continue to Candidates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Candidate Selection */}
        {currentStep === 2 && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Your Candidate
              </CardTitle>
              <CardDescription>Choose your preferred candidate from the list below</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="relative">
                      <RadioGroupItem value={candidate.id} id={candidate.id} className="absolute top-4 right-4 z-10" />
                      <Label
                        htmlFor={candidate.id}
                        className="cursor-pointer block p-6 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{
                          borderColor: selectedCandidate === candidate.id ? "#3b82f6" : "#e5e7eb",
                        }}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {candidate.imageUrl ? (
                              <img
                                src={candidate.imageUrl || "/placeholder.svg"}
                                alt={candidate.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{candidate.name}</h3>
                            {candidate.description && (
                              <p className="text-sm text-muted-foreground mt-2">{candidate.description}</p>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleStep2Submit} className="flex-1">
                  Continue to Summary
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Summary and Confirmation */}
        {currentStep === 3 && (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Confirm Your Vote
              </CardTitle>
              <CardDescription>Please review your information before submitting your vote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voter Details Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Your Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Full Name:</span>
                    <p className="font-medium">{voterDetails.fullName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <p className="font-medium">{voterDetails.age}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{voterDetails.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Index Number:</span>
                    <p className="font-medium">{voterDetails.indexNumber}</p>
                  </div>
                </div>
              </div>

              {/* Selected Candidate Summary */}
              {selectedCandidateData && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Your Selected Candidate</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {selectedCandidateData.imageUrl ? (
                        <img
                          src={selectedCandidateData.imageUrl || "/placeholder.svg"}
                          alt={selectedCandidateData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{selectedCandidateData.name}</h4>
                      {selectedCandidateData.description && (
                        <p className="text-sm text-muted-foreground">{selectedCandidateData.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleFinalSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Vote className="w-4 h-4 mr-2" />
                  Submit Vote
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
