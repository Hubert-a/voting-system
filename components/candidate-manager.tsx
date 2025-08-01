"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, User } from "lucide-react"
import { useVotingStore } from "@/lib/voting-store"

export function CandidateManager() {
  const { candidates, addCandidate, removeCandidate } = useVotingStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    description: "",
    imageUrl: "",
  })

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCandidate.name.trim()) {
      addCandidate({
        name: newCandidate.name.trim(),
        description: newCandidate.description.trim() || undefined,
        imageUrl: newCandidate.imageUrl.trim() || undefined,
      })
      setNewCandidate({ name: "", description: "", imageUrl: "" })
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Manage Candidates</h3>
          <p className="text-sm text-muted-foreground">Add or remove candidates for the voting session</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>Enter the candidate&apos;s information below</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter candidate name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newCandidate.description}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter candidate description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  value={newCandidate.imageUrl}
                  onChange={(e) => setNewCandidate((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Candidate</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <User className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No candidates added yet</p>
              <p className="text-sm text-muted-foreground">Add candidates to start the voting process</p>
            </CardContent>
          </Card>
        ) : (
          candidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    {candidate.description && (
                      <CardDescription className="mt-2">{candidate.description}</CardDescription>
                    )}
                    {candidate.imageUrl && (
                      <img
                        src={candidate.imageUrl || "/placeholder.svg"}
                        alt={candidate.name}
                        className="mt-2 w-24 h-24"
                      />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCandidate(candidate.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
