"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialPad } from "./dial-pad"
import { CallControls } from "./call-controls"
import { CustomerSidebar } from "./customer-sidebar"
import { WrapUpModal, type WrapUpData } from "./wrap-up-modal"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import type { Call } from "@/types"

export function SoftphonePanel() {
  const { activeCall, setActiveCall, selectedCustomer, setSelectedCustomer, addNotification } = useAppStore()
  const [showWrapUp, setShowWrapUp] = useState(false)
  const [callTimer, setCallTimer] = useState(0)

  // Timer for active calls
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeCall?.callState === "active") {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1)
        setActiveCall({
          ...activeCall,
          duration: callTimer + 1,
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeCall, callTimer, setActiveCall])

  // Mock WebSocket for incoming calls
  useEffect(() => {
    const ws = api.createWebSocket()
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "incoming_call") {
        handleIncomingCall(data.payload)
      }
    })
    return () => ws.close()
  }, [])

  const handleIncomingCall = async (callData: any) => {
    const customer = await api.getCustomer(callData.customerId)
    if (customer) {
      setSelectedCustomer(customer)
    }

    const incomingCall: Call = {
      id: callData.id,
      type: "call",
      customerId: callData.customerId,
      agentId: "1", // Current user
      status: "active",
      startTime: new Date(),
      direction: callData.direction,
      phoneNumber: callData.phoneNumber,
      callState: "ringing",
      isRecording: false,
      isMuted: false,
      duration: 0,
    }

    setActiveCall(incomingCall)
    addNotification({
      type: "info",
      message: `Incoming call from ${callData.phoneNumber}`,
    })
  }

  const handleDial = async (number: string) => {
    // Look up customer by phone number
    const customers = await api.searchCustomers(number)
    const customer = customers.find((c) => c.phone === number)
    if (customer) {
      setSelectedCustomer(customer)
    }

    const outboundCall: Call = {
      id: "call-" + Date.now(),
      type: "call",
      customerId: customer?.id || "",
      agentId: "1",
      status: "active",
      startTime: new Date(),
      direction: "outbound",
      phoneNumber: number,
      callState: "ringing",
      isRecording: false,
      isMuted: false,
      duration: 0,
    }

    setActiveCall(outboundCall)
    setCallTimer(0)

    // Simulate call connecting after 2 seconds
    setTimeout(() => {
      if (outboundCall.id === activeCall?.id) {
        setActiveCall({
          ...outboundCall,
          callState: "active",
        })
      }
    }, 2000)
  }

  const handleAnswer = () => {
    if (activeCall) {
      setActiveCall({
        ...activeCall,
        callState: "active",
      })
      setCallTimer(0)
    }
  }

  const handleHangup = () => {
    if (activeCall) {
      setActiveCall({
        ...activeCall,
        callState: "wrap-up",
        endTime: new Date(),
      })
      setShowWrapUp(true)
    }
  }

  const handleHold = () => {
    if (activeCall) {
      setActiveCall({
        ...activeCall,
        callState: activeCall.callState === "hold" ? "active" : "hold",
      })
    }
  }

  const handleMute = () => {
    if (activeCall) {
      setActiveCall({
        ...activeCall,
        isMuted: !activeCall.isMuted,
      })
    }
  }

  const handleRecord = () => {
    if (activeCall) {
      setActiveCall({
        ...activeCall,
        isRecording: !activeCall.isRecording,
      })
      addNotification({
        type: "info",
        message: activeCall.isRecording ? "Recording stopped" : "Recording started",
      })
    }
  }

  const handleTransfer = () => {
    addNotification({
      type: "info",
      message: "Transfer functionality coming soon",
    })
  }

  const handleConference = () => {
    addNotification({
      type: "info",
      message: "Conference functionality coming soon",
    })
  }

  const handleWrapUpSubmit = (data: WrapUpData) => {
    console.log("Call wrap-up data:", data)
    setActiveCall(null)
    setSelectedCustomer(null)
    setCallTimer(0)
    addNotification({
      type: "info",
      message: "Call completed successfully",
    })
  }

  const handleQuickAction = (action: string) => {
    addNotification({
      type: "info",
      message: `${action} action triggered`,
    })
  }

  return (
    <div className="flex h-full">
      {/* Main Softphone */}
      <div className="flex-1 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Softphone</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeCall ? "call" : "dial"} className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dial">Dial Pad</TabsTrigger>
                <TabsTrigger value="call" disabled={!activeCall}>
                  Active Call
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dial" className="mt-4">
                <DialPad
                  onDial={handleDial}
                  onHangup={handleHangup}
                  isInCall={!!activeCall}
                  disabled={activeCall?.callState === "wrap-up"}
                />
              </TabsContent>

              <TabsContent value="call" className="mt-4">
                {activeCall && (
                  <CallControls
                    call={activeCall}
                    onAnswer={handleAnswer}
                    onHangup={handleHangup}
                    onHold={handleHold}
                    onMute={handleMute}
                    onTransfer={handleTransfer}
                    onConference={handleConference}
                    onRecord={handleRecord}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Customer Sidebar */}
      <CustomerSidebar customer={selectedCustomer} onQuickAction={handleQuickAction} />

      {/* Wrap-up Modal */}
      <WrapUpModal open={showWrapUp} onClose={() => setShowWrapUp(false)} onSubmit={handleWrapUpSubmit} />
    </div>
  )
}
