"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, type Contact, type CallSession } from "@/lib/api"
import { Phone, PhoneCall, PhoneOff, Clock, User, Search, Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface CallState {
  currentCall: CallSession | null
  selectedContact: Contact | null
  isDialPadOpen: boolean
  isWrapUpModalOpen: boolean
  callDuration: number
  agentStatus: 'available' | 'busy' | 'break' | 'offline'
  isMuted: boolean
  isHolding: boolean
}

export function FunctionalSoftphone() {
  const [state, setState] = useState<CallState>({
    currentCall: null,
    selectedContact: null,
    isDialPadOpen: false,
    isWrapUpModalOpen: false,
    callDuration: 0,
    agentStatus: 'available',
    isMuted: false,
    isHolding: false
  })
  
  const [contacts, setContacts] = useState<Contact[]>([])
  const [dialNumber, setDialNumber] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [wrapUpNotes, setWrapUpNotes] = useState("")
  const [callOutcome, setCallOutcome] = useState("")
  const [callDisposition, setCallDisposition] = useState("")

  // Load contacts on mount
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactData = await api.getContacts()
        setContacts(contactData)
      } catch (error) {
        console.error('Failed to load contacts:', error)
      }
    }
    loadContacts()
  }, [])

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (state.currentCall?.status === 'connected') {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          callDuration: Math.floor((Date.now() - (prev.currentCall?.startTime.getTime() || 0)) / 1000)
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state.currentCall?.status])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartCall = async (contactId?: string) => {
    try {
      const targetContactId = contactId || state.selectedContact?.id
      if (!targetContactId) return

      setState(prev => ({ ...prev, agentStatus: 'busy' }))
      const callSession = await api.startCall(targetContactId, 'agent1')
      setState(prev => ({ 
        ...prev, 
        currentCall: callSession,
        callDuration: 0,
        isDialPadOpen: false
      }))

      // Simulate call connecting after 3 seconds
      setTimeout(async () => {
        await api.answerCall()
        setState(prev => ({
          ...prev,
          currentCall: { ...prev.currentCall!, status: 'connected' }
        }))
      }, 3000)
    } catch (error) {
      console.error('Failed to start call:', error)
      setState(prev => ({ ...prev, agentStatus: 'available' }))
    }
  }

  const handleEndCall = async () => {
    if (!state.currentCall) return
    setState(prev => ({ ...prev, isWrapUpModalOpen: true }))
  }

  const handleWrapUpComplete = async () => {
    try {
      if (!state.currentCall || !callOutcome || !callDisposition) return

      await api.endCall(callOutcome as any, callDisposition as any, wrapUpNotes)
      setState(prev => ({
        ...prev,
        currentCall: null,
        isWrapUpModalOpen: false,
        callDuration: 0,
        agentStatus: 'available',
        selectedContact: null,
        isMuted: false,
        isHolding: false
      }))
      setWrapUpNotes("")
      setCallOutcome("")
      setCallDisposition("")
    } catch (error) {
      console.error('Failed to end call:', error)
    }
  }

  const handleDialPadCall = async () => {
    if (!dialNumber.trim()) return
    
    try {
      const tempContact = await api.createContact({
        name: `Manual Dial (${dialNumber})`,
        phone: dialNumber,
        tags: ['manual-dial'],
        status: 'active',
        source: 'manual'
      })
      
      await handleStartCall(tempContact.id)
      setDialNumber("")
      setContacts(prev => [...prev, tempContact])
    } catch (error) {
      console.error('Failed to create contact for dialed number:', error)
    }
  }

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'break': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'dialing': return 'bg-blue-500 text-white'
      case 'ringing': return 'bg-yellow-500 text-black'
      case 'connected': return 'bg-green-500 text-white'
      case 'on-hold': return 'bg-orange-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      {/* Agent Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Agent Dashboard</CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(state.agentStatus)}`} />
              <span className="capitalize font-medium">{state.agentStatus}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Call Display */}
      {state.currentCall && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Call</CardTitle>
              <Badge className={getCallStatusColor(state.currentCall.status)}>
                {state.currentCall.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {contacts.find(c => c.id === state.currentCall?.contactId)?.name || 'Unknown Contact'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>
                  {contacts.find(c => c.id === state.currentCall?.contactId)?.phone || 'Unknown Number'}
                </span>
              </div>
              {state.currentCall.status === 'connected' && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-lg text-green-600 font-bold">
                    {formatDuration(state.callDuration)}
                  </span>
                </div>
              )}
              
              {/* Call Controls */}
              {state.currentCall.status === 'connected' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant={state.isMuted ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                  >
                    {state.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {state.isMuted ? 'Unmute' : 'Mute'}
                  </Button>
                  <Button
                    variant={state.isHolding ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setState(prev => ({ ...prev, isHolding: !prev.isHolding }))}
                  >
                    {state.isHolding ? 'Resume' : 'Hold'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Call Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 justify-center">
            {!state.currentCall ? (
              <>
                <Button
                  onClick={() => handleStartCall()}
                  disabled={!state.selectedContact}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setState(prev => ({ ...prev, isDialPadOpen: !prev.isDialPadOpen }))}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Dial
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Call
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dial Pad */}
      {state.isDialPadOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Dial Pad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                placeholder="Enter phone number"
                className="text-center text-lg"
              />
              <div className="grid grid-cols-3 gap-2">
                {dialPadNumbers.flat().map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    className="h-12 text-lg"
                    onClick={() => setDialNumber(prev => prev + num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleDialPadCall}
                  disabled={!dialNumber.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDialNumber("")}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Search & Selection */}
      {!state.currentCall && (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Select Contact</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    state.selectedContact?.id === contact.id
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setState(prev => ({ ...prev, selectedContact: contact }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.phone}</div>
                      {contact.company && (
                        <div className="text-xs text-muted-foreground">{contact.company}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                        {contact.status}
                      </Badge>
                      {contact.tags.length > 0 && (
                        <div className="flex gap-1">
                          {contact.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {contact.notes && (
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                      {contact.notes}
                    </div>
                  )}
                </div>
              ))}
              {filteredContacts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No contacts found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wrap Up Modal */}
      <Dialog open={state.isWrapUpModalOpen} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Call Wrap-Up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Call Outcome</label>
              <Select value={callOutcome} onValueChange={setCallOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="no-answer">No Answer</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                  <SelectItem value="disconnected">Disconnected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Disposition</label>
              <Select value={callDisposition} onValueChange={setCallDisposition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select disposition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="not-interested">Not Interested</SelectItem>
                  <SelectItem value="callback">Callback Requested</SelectItem>
                  <SelectItem value="sale">Sale Made</SelectItem>
                  <SelectItem value="no-contact">No Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={wrapUpNotes}
                onChange={(e) => setWrapUpNotes(e.target.value)}
                placeholder="Add call notes..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setState(prev => ({ ...prev, isWrapUpModalOpen: false }))}>
                Cancel
              </Button>
              <Button 
                onClick={handleWrapUpComplete}
                disabled={!callOutcome || !callDisposition}
              >
                Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
