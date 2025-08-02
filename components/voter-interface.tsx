"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Vote, AlertCircle, User, Users, FileText, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { useVotingStore } from "@/lib/voting-store"
import type { VoterDetails } from "@/types/voting"
import { VoterResults } from "./voter-results"

interface VoterInterfaceProps {
  showResults: boolean
}

export function VoterInterface({ showResults }: VoterInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [indexNumberInput, setIndexNumberInput] = useState("")
  const [fetchedVoterDetails, setFetchedVoterDetails] = useState<VoterDetails | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [hasSubmittedVote, setHasSubmittedVote] = useState(false)
  const [error, setError] = useState("")

  const { candidates, votingSession, castVote, getVoterDetailsByIndex } = useVotingStore()

  // Show results if admin has enabled display
  if (showResults) {
    return <VoterResults />
  }

  const handleIndexNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!indexNumberInput.trim()) {
      setError("Please enter your index number.")
      return
    }

    if (!votingSession.isActive) {
      setError("Voting is not currently active.")
      return
    }

    const voterData = getVoterDetailsByIndex(indexNumberInput.trim())

    if (!voterData) {
      setError("Voter not found with this index number.")
      return
    }

    if (voterData.hasVoted) {
      setError("This index number has already been used to vote.")
      return
    }

    setFetchedVoterDetails(voterData.details)
    setCurrentStep(2) // Move to confirmation step
  }

  const handleConfirmation = () => {
    setError("")
    setCurrentStep(3) // Move to candidate selection
  }

  const handleCandidateSelection = () => {
    if (!selectedCandidate) {
      setError("Please select a candidate.")
      return
    }
    setError("")
    setCurrentStep(4) // Move to final summary
  }

  const handleFinalSubmit = () => {
    if (!fetchedVoterDetails) {
      setError("Voter details are missing. Please restart the process.")
      setCurrentStep(1)
      return
    }
    const success = castVote(fetchedVoterDetails, selectedCandidate)
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
              <span className="ml-2 font-medium">Verify ID</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <Check className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Confirm Details</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <Users className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Candidates</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 4 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${currentStep >= 4 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <span className="ml-2 font-medium">Summary</span>
            </div>
          </div>
        </div>

        {/* Step 1: Index Number Entry */}
        {currentStep === 1 && (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Voter Verification
              </CardTitle>
              <CardDescription>Please enter your unique index number to proceed</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIndexNumberSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="indexNumber">Index Number *</Label>
                  <Input
                    id="indexNumber"
                    value={indexNumberInput}
                    onChange={(e) => setIndexNumberInput(e.target.value)}
                    placeholder="Enter your index number"
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Verify and Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Voter Details Confirmation */}
        {currentStep === 2 && fetchedVoterDetails && (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Confirm Your Details
              </CardTitle>
              <CardDescription>Please review your information and confirm it is correct</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Your Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Full Name:</span>
                    <p className="font-medium">{fetchedVoterDetails.fullName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <p className="font-medium">{fetchedVoterDetails.age}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{fetchedVoterDetails.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Index Number:</span>
                    <p className="font-medium">{fetchedVoterDetails.indexNumber}</p>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleConfirmation} className="flex-1">
                  Confirm and Select Candidate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Candidate Selection */}
        {currentStep === 3 && (
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
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleCandidateSelection} className="flex-1">
                  Continue to Summary
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Summary and Confirmation */}
        {currentStep === 4 && fetchedVoterDetails && (
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
                    <p className="font-medium">{fetchedVoterDetails.fullName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span>
                    <p className="font-medium">{fetchedVoterDetails.age}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{fetchedVoterDetails.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Index Number:</span>
                    <p className="font-medium">{fetchedVoterDetails.indexNumber}</p>
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
                <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
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
