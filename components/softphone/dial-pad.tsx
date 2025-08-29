"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, PhoneOff, Backpack as Backspace } from "lucide-react"

interface DialPadProps {
  onDial: (number: string) => void
  onHangup: () => void
  isInCall: boolean
  disabled?: boolean
}

const dialPadNumbers = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
]

export function DialPad({ onDial, onHangup, isInCall, disabled = false }: DialPadProps) {
  const [number, setNumber] = useState("")

  const handleNumberClick = (digit: string) => {
    if (disabled) return
    setNumber((prev) => prev + digit)
  }

  const handleBackspace = () => {
    setNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (number.trim() && !disabled) {
      onDial(number)
      setNumber("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCall()
    } else if (e.key === "Backspace") {
      handleBackspace()
    } else if (/[0-9*#]/.test(e.key)) {
      handleNumberClick(e.key)
    }
  }

  return (
    <div className="space-y-4">
      {/* Number Input */}
      <div className="relative">
        <Input
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^0-9*#+\-() ]/g, ""))}
          onKeyDown={handleKeyPress}
          placeholder="Enter phone number"
          className="text-center text-lg font-mono pr-10"
          disabled={disabled}
        />
        {number && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackspace}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            disabled={disabled}
          >
            <Backspace className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dial Pad Grid */}
      <div className="grid grid-cols-3 gap-2">
        {dialPadNumbers.flat().map((digit) => (
          <Button
            key={digit}
            variant="outline"
            size="lg"
            onClick={() => handleNumberClick(digit)}
            className="h-12 text-lg font-semibold"
            disabled={disabled}
          >
            {digit}
          </Button>
        ))}
      </div>

      {/* Call Controls */}
      <div className="flex gap-2">
        {!isInCall ? (
          <Button onClick={handleCall} disabled={!number.trim() || disabled} className="flex-1 gap-2" size="lg">
            <Phone className="h-4 w-4" />
            Call
          </Button>
        ) : (
          <Button onClick={onHangup} variant="destructive" className="flex-1 gap-2" size="lg" disabled={disabled}>
            <PhoneOff className="h-4 w-4" />
            Hang Up
          </Button>
        )}
      </div>
    </div>
  )
}
