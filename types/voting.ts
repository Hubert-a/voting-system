export interface Candidate {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface VoterDetails {
  fullName: string;
  age: number;
  location: string;
  indexNumber: string;
}

export interface Vote {
  id: string;
  voterDetails: VoterDetails;
  candidateId: string;
  timestamp: Date;
}

export interface VotingSession {
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  displayResults?: boolean;
}

export interface VoterInfo {
  id: string;
  voterDetails: VoterDetails;
  hasVoted: boolean;
  timestamp?: Date;
}
