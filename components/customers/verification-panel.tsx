"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, AlertTriangle, Phone, Mail, Mic, Shield } from "lucide-react"
import type { Customer } from "@/types"

interface VerificationPanelProps {
  customer: Customer
  onVerificationComplete: (method: string, success: boolean) => void
}

export function VerificationPanel({ customer, onVerificationComplete }: VerificationPanelProps) {
  const [otpCode, setOtpCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [kbaAnswers, setKbaAnswers] = useState<Record<string, string>>({})
  const [voiceAuthStatus, setVoiceAuthStatus] = useState<"idle" | "recording" | "verifying" | "success" | "failed">(
    "idle",
  )

  const getStatusIcon = (status: Customer["verificationStatus"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusColor = (status: Customer["verificationStatus"]) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const handleSendOTP = async (method: "sms" | "email") => {
    setOtpLoading(true)
    // Simulate API call
    setTimeout(() => {
      setOtpSent(true)
      setOtpLoading(false)
    }, 1000)
  }

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) return

    setOtpLoading(true)
    // Simulate verification
    setTimeout(() => {
      const success = otpCode === "123456" // Mock success condition
      onVerificationComplete("otp", success)
      setOtpLoading(false)
      if (success) {
        setOtpCode("")
        setOtpSent(false)
      }
    }, 1000)
  }

  const handleKBASubmit = async () => {
    const allAnswered = kbaQuestions.every((q) => kbaAnswers[q.id]?.trim())
    if (!allAnswered) return

    // Simulate KBA verification
    setTimeout(() => {
      const success = kbaAnswers["q1"]?.toLowerCase().includes("main") // Mock success condition
      onVerificationComplete("kba", success)
    }, 1000)
  }

  const handleVoiceAuth = async () => {
    setVoiceAuthStatus("recording")
    // Simulate voice recording and verification
    setTimeout(() => {
      setVoiceAuthStatus("verifying")
      setTimeout(() => {
        const success = Math.random() > 0.3 // Mock 70% success rate
        setVoiceAuthStatus(success ? "success" : "failed")
        onVerificationComplete("voice", success)
        setTimeout(() => setVoiceAuthStatus("idle"), 3000)
      }, 2000)
    }, 3000)
  }

  const kbaQuestions = [
    { id: "q1", question: "What is the name of the street you grew up on?" },
    { id: "q2", question: "What was the make of your first car?" },
    { id: "q3", question: "What is your mother's maiden name?" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(customer.verificationStatus)}
              Account Verification
            </CardTitle>
            <CardDescription>Verify customer identity using multiple methods</CardDescription>
          </div>
          <Badge className={getStatusColor(customer.verificationStatus)} variant="outline">
            {customer.verificationStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="otp" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="otp">OTP Verification</TabsTrigger>
            <TabsTrigger value="kba">Knowledge-Based</TabsTrigger>
            <TabsTrigger value="voice">Voice Authentication</TabsTrigger>
          </TabsList>

          <TabsContent value="otp" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Send a one-time password to verify the customer's identity
              </div>

              {!otpSent ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSendOTP("sms")}
                    disabled={!customer.phone || otpLoading}
                    className="flex-1 gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Send SMS to {customer.phone}
                  </Button>
                  <Button
                    onClick={() => handleSendOTP("email")}
                    disabled={!customer.email || otpLoading}
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent"
                  >
                    <Mail className="h-4 w-4" />
                    Send Email to {customer.email}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>OTP sent successfully. Ask customer for the 6-digit code.</AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="otp"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="123456"
                        className="font-mono text-center"
                        maxLength={6}
                      />
                      <Button onClick={handleVerifyOTP} disabled={otpCode.length !== 6 || otpLoading}>
                        Verify
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setOtpSent(false)} size="sm" className="bg-transparent">
                    Send New Code
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="kba" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Ask the customer these security questions to verify their identity
              </div>

              {kbaQuestions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <Label htmlFor={question.id}>
                    {index + 1}. {question.question}
                  </Label>
                  <Input
                    id={question.id}
                    value={kbaAnswers[question.id] || ""}
                    onChange={(e) => setKbaAnswers({ ...kbaAnswers, [question.id]: e.target.value })}
                    placeholder="Customer's answer"
                  />
                </div>
              ))}

              <Button
                onClick={handleKBASubmit}
                disabled={!kbaQuestions.every((q) => kbaAnswers[q.id]?.trim())}
                className="w-full"
              >
                Verify Answers
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Use voice biometrics to verify the customer's identity
              </div>

              <div className="text-center space-y-4">
                {voiceAuthStatus === "idle" && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <Mic className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm">Ask customer to say: "My voice is my password"</p>
                    <Button onClick={handleVoiceAuth} className="gap-2">
                      <Mic className="h-4 w-4" />
                      Start Voice Authentication
                    </Button>
                  </div>
                )}

                {voiceAuthStatus === "recording" && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                      <Mic className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-sm font-medium">Recording voice sample...</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                )}

                {voiceAuthStatus === "verifying" && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                    <p className="text-sm font-medium">Verifying voice pattern...</p>
                  </div>
                )}

                {voiceAuthStatus === "success" && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-green-600">Voice authentication successful!</p>
                  </div>
                )}

                {voiceAuthStatus === "failed" && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-red-600">Voice authentication failed</p>
                    <Button onClick={handleVoiceAuth} variant="outline" size="sm" className="bg-transparent">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
