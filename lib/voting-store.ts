"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Candidate, Vote, VotingSession as VotingSessionType, VoterDetails } from "@/types/voting"

interface VotingStore {
  // Admin state
  isAdminLoggedIn: boolean

  // Voting session
  votingSession: VotingSessionType

  // Candidates
  candidates: Candidate[]

  // Votes and voters
  votes: Vote[]
  voters: { id: string; voterDetails: VoterDetails; hasVoted: boolean; timestamp: Date }[]

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
        const existingVoter = state.voters.find((v) => v.voterDetails.indexNumber === voterDetails.indexNumber)
        if (existingVoter?.hasVoted) return false

        // Cast vote
        const newVote: Vote = {
          id: Date.now().toString(),
          voterDetails,
          candidateId,
          timestamp: new Date(),
        }

        // Update voter info
        const updatedVoters = state.voters.filter((v) => v.voterDetails.indexNumber !== voterDetails.indexNumber)
        updatedVoters.push({
          id: voterDetails.indexNumber,
          voterDetails,
          hasVoted: true,
          timestamp: new Date(),
        })

        set({
          votes: [...state.votes, newVote],
          voters: updatedVoters,
        })

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
    }),
    {
      name: "voting-system-storage",
    },
  ),
)
