"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Pause, Play, PhoneForwarded, Users, Square, Circle, Phone, PhoneOff } from "lucide-react"
import type { Call } from "@/types"

interface CallControlsProps {
  call: Call
  onAnswer: () => void
  onHangup: () => void
  onHold: () => void
  onMute: () => void
  onTransfer: () => void
  onConference: () => void
  onRecord: () => void
}

export function CallControls({
  call,
  onAnswer,
  onHangup,
  onHold,
  onMute,
  onTransfer,
  onConference,
  onRecord,
}: CallControlsProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getCallStateColor = (state: Call["callState"]) => {
    switch (state) {
      case "ringing":
        return "bg-yellow-500"
      case "active":
        return "bg-green-500"
      case "hold":
        return "bg-orange-500"
      case "transfer":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Call Status */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getCallStateColor(call.callState)}`} />
          <Badge variant="outline" className="capitalize">
            {call.callState.replace("-", " ")}
          </Badge>
        </div>
        <div className="text-lg font-semibold">{call.phoneNumber}</div>
        {call.callState === "active" && (
          <div className="text-sm text-muted-foreground">{formatDuration(call.duration)}</div>
        )}
      </div>

      {/* Primary Controls */}
      {call.callState === "ringing" && call.direction === "inbound" ? (
        <div className="flex gap-2">
          <Button onClick={onAnswer} className="flex-1 gap-2" size="lg">
            <Phone className="h-4 w-4" />
            Answer
          </Button>
          <Button onClick={onHangup} variant="destructive" className="flex-1 gap-2" size="lg">
            <PhoneOff className="h-4 w-4" />
            Decline
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {/* Mute */}
          <Button
            variant={call.isMuted ? "default" : "outline"}
            onClick={onMute}
            className="gap-2"
            disabled={call.callState !== "active"}
          >
            {call.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {call.isMuted ? "Unmute" : "Mute"}
          </Button>

          {/* Hold */}
          <Button
            variant={call.callState === "hold" ? "default" : "outline"}
            onClick={onHold}
            className="gap-2"
            disabled={call.callState === "ringing"}
          >
            {call.callState === "hold" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {call.callState === "hold" ? "Resume" : "Hold"}
          </Button>

          {/* Transfer */}
          <Button
            variant="outline"
            onClick={onTransfer}
            className="gap-2 bg-transparent"
            disabled={call.callState !== "active"}
          >
            <PhoneForwarded className="h-4 w-4" />
            Transfer
          </Button>

          {/* Conference */}
          <Button
            variant="outline"
            onClick={onConference}
            className="gap-2 bg-transparent"
            disabled={call.callState !== "active"}
          >
            <Users className="h-4 w-4" />
            Conference
          </Button>
        </div>
      )}

      {/* Recording Control */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          {call.isRecording ? (
            <Circle className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
          ) : (
            <Square className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-sm">{call.isRecording ? "Recording" : "Not Recording"}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onRecord}>
          {call.isRecording ? "Stop" : "Record"}
        </Button>
      </div>

      {/* Hang Up */}
      {call.callState !== "ringing" && (
        <Button onClick={onHangup} variant="destructive" className="w-full gap-2" size="lg">
          <PhoneOff className="h-4 w-4" />
          End Call
        </Button>
      )}
    </div>
  )
}
