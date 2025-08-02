"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Candidate, Vote, VotingSession, VoterDetails, VoterUser } from "@/types/voting"

interface VotingStore {
  // Admin state
  isAdminLoggedIn: boolean

  // Voting session
  votingSession: VotingSession

  // Candidates
  candidates: Candidate[]

  // Votes and voters
  votes: Vote[]
  voters: VoterUser[] // Using the refined VoterUser type

  // Actions
  adminLogin: (password: string) => boolean
  adminLogout: () => void
  startVoting: () => void
  stopVoting: () => void
  addCandidate: (candidate: Omit<Candidate, "id">) => void
  removeCandidate: (id: string) => void
  castVote: (voterDetails: VoterDetails, candidateId: string) => boolean
  getVotingResults: () => Array<{
    candidate: Candidate
    voteCount: number
    percentage: number
  }>
  getVoterStats: () => {
    totalVoters: number
    votedCount: number
    notVotedCount: number
  }
  showResults: () => void
  hideResults: () => void
  // New action to fetch voter details by index number
  getVoterDetailsByIndex: (indexNumber: string) => { details: VoterDetails; hasVoted: boolean } | null
}

export const useVotingStore = create<VotingStore>()(
  persist(
    (set, get) => ({
      isAdminLoggedIn: false,
      votingSession: { isActive: false, displayResults: false },
      candidates: [],
      votes: [],
      voters: [],

      adminLogin: (password: string) => {
        const isValid = password === "admin123" // Simple password check
        if (isValid) {
          set({ isAdminLoggedIn: true })
        }
        return isValid
      },

      adminLogout: () => {
        set({ isAdminLoggedIn: false })
      },

      startVoting: () => {
        set({
          votingSession: {
            isActive: true,
            startTime: new Date(),
            displayResults: false,
          },
        })
      },

      stopVoting: () => {
        set((state) => ({
          votingSession: {
            ...state.votingSession,
            isActive: false,
            endTime: new Date(),
          },
        }))
      },

      addCandidate: (candidateData) => {
        const newCandidate: Candidate = {
          ...candidateData,
          id: Date.now().toString(),
        }
        set((state) => ({
          candidates: [...state.candidates, newCandidate],
        }))
      },

      removeCandidate: (id) => {
        set((state) => ({
          candidates: state.candidates.filter((c) => c.id !== id),
        }))
      },

      castVote: (voterDetails: VoterDetails, candidateId: string) => {
        const state = get()

        // Check if voting is active
        if (!state.votingSession.isActive) return false

        // Check if voter already voted (by index number)
        const existingVoter = state.voters.find((v) => v.details.indexNumber === voterDetails.indexNumber)
        if (existingVoter?.hasVoted) return false

        // Cast vote
        const newVote: Vote = {
          id: Date.now().toString(),
          voterDetails,
          candidateId,
          timestamp: new Date(),
        }

        // Create/update voter info
        const newVoter: VoterUser = {
          id: voterDetails.indexNumber,
          details: voterDetails,
          hasVoted: true,
          voteTimestamp: new Date(),
        }

        // Update state
        set((state) => ({
          votes: [...state.votes, newVote],
          voters: [...state.voters.filter((v) => v.details.indexNumber !== voterDetails.indexNumber), newVoter],
        }))

        return true
      },

      getVotingResults: () => {
        const state = get()
        const totalVotes = state.votes.length

        return state.candidates
          .map((candidate) => {
            const voteCount = state.votes.filter((v) => v.candidateId === candidate.id).length
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0

            return {
              candidate,
              voteCount,
              percentage,
            }
          })
          .sort((a, b) => b.voteCount - a.voteCount)
      },

      getVoterStats: () => {
        const state = get()
        const votedCount = state.voters.filter((v) => v.hasVoted).length
        const totalVoters = state.voters.length

        return {
          totalVoters,
          votedCount,
          notVotedCount: totalVoters - votedCount,
        }
      },

      showResults: () => {
        set((state) => ({
          votingSession: {
            ...state.votingSession,
            displayResults: true,
          },
        }))
      },

      hideResults: () => {
        set((state) => ({
          votingSession: {
            ...state.votingSession,
            displayResults: false,
          },
        }))
      },

      // New action: Simulate fetching voter details by index number
      getVoterDetailsByIndex: (indexNumber: string) => {
        const state = get()
        // For demo purposes, let's create a dummy voter if not found
        // In a real app, this would fetch from a backend
        const existingVoter = state.voters.find((v) => v.details.indexNumber === indexNumber)

        if (existingVoter) {
          return { details: existingVoter.details, hasVoted: existingVoter.hasVoted }
        } else {
          // Simulate a new voter for demo purposes
          const dummyVoterDetails: VoterDetails = {
            fullName: `Voter ${indexNumber}`,
            age: 25,
            location: "Demo City",
            indexNumber: indexNumber,
          }
          // Add this new voter to the store so they can be "found" next time
          set((state) => ({
            voters: [...state.voters, { id: indexNumber, details: dummyVoterDetails, hasVoted: false }],
          }))
          return { details: dummyVoterDetails, hasVoted: false }
        }
      },
    }),
    {
      name: "voting-system-storage",
    },
  ),
)
