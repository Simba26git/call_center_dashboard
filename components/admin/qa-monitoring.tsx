"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Play, Pause, Star, MessageSquare, Clock, Eye, Award } from "lucide-react"

interface Recording {
  id: string
  agentName: string
  customerName: string
  duration: string
  date: Date
  score?: number
  reviewed: boolean
  callType: "inbound" | "outbound"
}

interface QAReview {
  id: string
  recordingId: string
  reviewerName: string
  score: number
  criteria: {
    greeting: number
    listening: number
    problemSolving: number
    closing: number
  }
  notes: string
  date: Date
}

const mockRecordings: Recording[] = [
  {
    id: "rec-1",
    agentName: "Sarah Johnson",
    customerName: "John Smith",
    duration: "8:45",
    date: new Date("2024-01-15T10:30:00"),
    score: 92,
    reviewed: true,
    callType: "inbound",
  },
  {
    id: "rec-2",
    agentName: "Mike Chen",
    customerName: "Maria Garcia",
    duration: "12:20",
    date: new Date("2024-01-15T11:15:00"),
    reviewed: false,
    callType: "outbound",
  },
  {
    id: "rec-3",
    agentName: "Lisa Rodriguez",
    customerName: "David Wilson",
    duration: "6:30",
    date: new Date("2024-01-15T14:20:00"),
    score: 88,
    reviewed: true,
    callType: "inbound",
  },
]

const mockReviews: QAReview[] = [
  {
    id: "review-1",
    recordingId: "rec-1",
    reviewerName: "QA Manager",
    score: 92,
    criteria: {
      greeting: 95,
      listening: 90,
      problemSolving: 88,
      closing: 95,
    },
    notes: "Excellent customer service. Agent showed empathy and resolved the issue efficiently.",
    date: new Date("2024-01-15T16:00:00"),
  },
]

export function QAMonitoring() {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackPosition, setPlaybackPosition] = useState(0)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [reviewScores, setReviewScores] = useState({
    greeting: 0,
    listening: 0,
    problemSolving: 0,
    closing: 0,
  })

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 80) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Good"
    if (score >= 70) return "Satisfactory"
    return "Needs Improvement"
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Mock playback logic
  }

  const handleSubmitReview = () => {
    const totalScore = Math.round(
      (reviewScores.greeting + reviewScores.listening + reviewScores.problemSolving + reviewScores.closing) / 4,
    )
    console.log("Review submitted:", { totalScore, reviewScores, reviewNotes })
    setShowReviewDialog(false)
    setReviewNotes("")
    setReviewScores({ greeting: 0, listening: 0, problemSolving: 0, closing: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quality Assurance</h2>
          <p className="text-muted-foreground">Monitor and review call recordings for quality assurance</p>
        </div>
      </div>

      <Tabs defaultValue="recordings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recordings">Call Recordings</TabsTrigger>
          <TabsTrigger value="reviews">QA Reviews</TabsTrigger>
          <TabsTrigger value="analytics">QA Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recordings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recordings List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Call Recordings</CardTitle>
                  <CardDescription>Recent call recordings available for review</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRecordings.map((recording) => (
                        <TableRow key={recording.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {recording.agentName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{recording.agentName}</div>
                                <Badge variant="outline" className="text-xs">
                                  {recording.callType}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{recording.customerName}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm">{recording.duration}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{recording.date.toLocaleDateString()}</div>
                          </TableCell>
                          <TableCell>
                            {recording.score ? (
                              <Badge className={getScoreColor(recording.score)} variant="outline">
                                {recording.score}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                                Not Reviewed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRecording(recording)}
                                className="gap-1 bg-transparent"
                              >
                                <Eye className="h-3 w-3" />
                                Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Playback Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Playback Controls</CardTitle>
                  <CardDescription>
                    {selectedRecording ? `Reviewing: ${selectedRecording.agentName}` : "Select a recording to review"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedRecording ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Agent: {selectedRecording.agentName}</span>
                          <span>Duration: {selectedRecording.duration}</span>
                        </div>
                        <Progress value={playbackPosition} className="w-full" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>0:00</span>
                          <span>{selectedRecording.duration}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handlePlayPause} className="flex-1 gap-2">
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          {isPlaying ? "Pause" : "Play"}
                        </Button>
                      </div>

                      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full gap-2 bg-transparent">
                            <Star className="h-4 w-4" />
                            Start QA Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>QA Review</DialogTitle>
                            <DialogDescription>Rate the agent's performance on this call</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {Object.entries(reviewScores).map(([criteria, score]) => (
                              <div key={criteria} className="space-y-2">
                                <Label className="capitalize">{criteria.replace(/([A-Z])/g, " $1")}</Label>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <Button
                                      key={rating}
                                      variant={score >= rating * 20 ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setReviewScores({ ...reviewScores, [criteria]: rating * 20 })}
                                      className="w-8 h-8 p-0 bg-transparent"
                                    >
                                      {rating}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="space-y-2">
                              <Label>Review Notes</Label>
                              <Textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add notes about the agent's performance..."
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleSubmitReview} className="flex-1">
                                Submit Review
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setShowReviewDialog(false)}
                                className="flex-1 bg-transparent"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Select a recording to begin review</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Reviews</CardTitle>
              <CardDescription>QA reviews completed by supervisors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <div>
                          <div className="font-medium">Recording #{review.recordingId}</div>
                          <div className="text-sm text-muted-foreground">
                            Reviewed by {review.reviewerName} • {review.date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getScoreColor(review.score)} variant="outline">
                        {review.score} - {getScoreBadge(review.score)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      {Object.entries(review.criteria).map(([criteria, score]) => (
                        <div key={criteria} className="text-center">
                          <div className="text-sm text-muted-foreground capitalize">
                            {criteria.replace(/([A-Z])/g, " $1")}
                          </div>
                          <div className="font-medium">{score}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm font-medium mb-1">Review Notes:</div>
                      <div className="text-sm text-muted-foreground">{review.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average QA Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">90.2</div>
                <div className="text-sm text-muted-foreground">+2.1 from last month</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reviews Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">This month</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">Average score: 94.5</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
