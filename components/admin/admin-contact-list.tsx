"use client"

import { useState, useEffect } from "react"
import { Mail, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

async function fetchContacts() {
  const response = await fetch('/api/admin/contacts')
  if (!response.ok) throw new Error('Failed to fetch contacts')
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

async function deleteContact(id: string) {
  const response = await fetch(`/api/admin/contacts?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete contact')
  return response.json()
}

export function AdminContactList() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<any>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    try {
      setError(null)
      const data = await fetchContacts()
      setContacts(data)
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
      setError("Failed to load messages")
      toast.error("Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    try {
      await deleteContact(id)
      setContacts(contacts.filter(c => c._id !== id))
      if (selectedContact?._id === id) {
        setSelectedContact(null)
      }
      toast.success("Message deleted")
    } catch (error) {
      console.error("Failed to delete contact:", error)
      toast.error("Failed to delete message")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadContacts}
          className="border border-foreground px-6 py-2 text-xs tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-12 border border-border">
        <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No messages yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Contact list */}
      <div className="lg:col-span-1 border border-border divide-y divide-border max-h-[600px] overflow-y-auto">
        {contacts.map((contact) => (
          <button
            key={contact._id}
            onClick={() => setSelectedContact(contact)}
            className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
              selectedContact?._id === contact._id ? 'bg-muted' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-medium truncate">{contact.name || 'Unknown'}</p>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                {contact.createdAt ? formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true }) : 'N/A'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1 truncate">{contact.subject || 'No subject'}</p>
            <p className="text-xs text-muted-foreground truncate">{contact.email || 'No email'}</p>
          </button>
        ))}
      </div>

      {/* Contact detail */}
      <div className="lg:col-span-2 border border-border p-6 min-h-[400px]">
        {selectedContact ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-serif text-xl mb-1">{selectedContact.name || 'Unknown'}</h3>
                <p className="text-sm text-muted-foreground">{selectedContact.email || 'No email'}</p>
              </div>
              <button
                onClick={() => handleDelete(selectedContact._id)}
                className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                aria-label="Delete message"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Subject
              </p>
              <p className="text-sm font-medium">{selectedContact.subject || 'No subject'}</p>
            </div>

            <div>
              <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">
                Message
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedContact.message || 'No message content'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Received: {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center h-full">
            <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}