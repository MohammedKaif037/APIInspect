"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MockConfig } from "@/lib/types"
import { Server, Plus, Trash2, Play, Save } from "lucide-react"

interface MockServerProps {
  mocks: MockConfig[]
  setMocks: (mocks: MockConfig[]) => void
  activeMock: string | null
  setActiveMock: (mockId: string | null) => void
}

export default function MockServer({ mocks, setMocks, activeMock, setActiveMock }: MockServerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newMockName, setNewMockName] = useState("")
  const [editingMock, setEditingMock] = useState<MockConfig | null>(null)

  const addMock = () => {
    if (!newMockName.trim()) return

    const newMock: MockConfig = {
      id: Date.now().toString(),
      name: newMockName,
      path: "/api/mock",
      method: "GET",
      statusCode: 200,
      delay: 0,
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: JSON.stringify({ message: "This is a mock response" }, null, 2),
    }

    setMocks([...mocks, newMock])
    setNewMockName("")
    setEditingMock(newMock)
  }

  const deleteMock = (mockId: string) => {
    setMocks(mocks.filter((mock) => mock.id !== mockId))
    if (activeMock === mockId) {
      setActiveMock(null)
    }
    if (editingMock?.id === mockId) {
      setEditingMock(null)
    }
  }

  const updateMock = (field: keyof MockConfig, value: any) => {
    if (!editingMock) return

    setEditingMock({
      ...editingMock,
      [field]: value,
    })
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    if (!editingMock) return

    const updatedHeaders = [...editingMock.headers]
    updatedHeaders[index] = {
      ...updatedHeaders[index],
      [field]: value,
    }

    setEditingMock({
      ...editingMock,
      headers: updatedHeaders,
    })
  }

  const addHeader = () => {
    if (!editingMock) return

    setEditingMock({
      ...editingMock,
      headers: [...editingMock.headers, { key: "", value: "" }],
    })
  }

  const removeHeader = (index: number) => {
    if (!editingMock) return

    setEditingMock({
      ...editingMock,
      headers: editingMock.headers.filter((_, i) => i !== index),
    })
  }

  const saveMock = () => {
    if (!editingMock) return

    setMocks(mocks.map((mock) => (mock.id === editingMock.id ? editingMock : mock)))
  }

  const activateMock = (mockId: string) => {
    setActiveMock(activeMock === mockId ? null : mockId)
  }

  const formatJson = () => {
    if (!editingMock) return

    try {
      const parsed = JSON.parse(editingMock.body)
      updateMock("body", JSON.stringify(parsed, null, 2))
    } catch (e) {
      // If not valid JSON, do nothing
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Server className="h-4 w-4 mr-2" /> Mock Server
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Mock Server</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4 mt-4 overflow-hidden flex-1">
            <div className="w-1/3 border-r pr-4 overflow-y-auto">
              <div className="mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="New mock name"
                    value={newMockName}
                    onChange={(e) => setNewMockName(e.target.value)}
                  />
                  <Button onClick={addMock} disabled={!newMockName.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {mocks.map((mock) => (
                  <div key={mock.id} className="flex items-center">
                    <Button variant="ghost" className="flex-1 justify-start" onClick={() => setEditingMock(mock)}>
                      {mock.name}
                    </Button>
                    <Button
                      variant={activeMock === mock.id ? "default" : "outline"}
                      size="icon"
                      onClick={() => activateMock(mock.id)}
                      title={activeMock === mock.id ? "Deactivate" : "Activate"}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMock(mock.id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {mocks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No mocks yet. Create one to start mocking API responses.
                  </p>
                )}
              </div>
            </div>

            <div className="w-2/3 overflow-y-auto">
              {editingMock ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mock-name">Name</Label>
                      <Input
                        id="mock-name"
                        value={editingMock.name}
                        onChange={(e) => updateMock("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mock-path">Path</Label>
                      <Input
                        id="mock-path"
                        value={editingMock.path}
                        onChange={(e) => updateMock("path", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="mock-method">Method</Label>
                      <Select value={editingMock.method} onValueChange={(value) => updateMock("method", value)}>
                        <SelectTrigger id="mock-method">
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mock-status">Status Code</Label>
                      <Input
                        id="mock-status"
                        type="number"
                        value={editingMock.statusCode}
                        onChange={(e) => updateMock("statusCode", Number.parseInt(e.target.value) || 200)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mock-delay">Delay (ms)</Label>
                      <Input
                        id="mock-delay"
                        type="number"
                        value={editingMock.delay}
                        onChange={(e) => updateMock("delay", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Headers</Label>
                    <div className="space-y-2 mt-2">
                      {editingMock.headers.map((header, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder="Header name"
                            value={header.key}
                            onChange={(e) => updateHeader(index, "key", e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={header.value}
                            onChange={(e) => updateHeader(index, "value", e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Button variant="outline" size="sm" onClick={addHeader} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add Header
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="mock-body">Response Body</Label>
                      <Button variant="outline" size="sm" onClick={formatJson}>
                        Format JSON
                      </Button>
                    </div>
                    <Textarea
                      id="mock-body"
                      value={editingMock.body}
                      onChange={(e) => updateMock("body", e.target.value)}
                      className="font-mono min-h-[200px] mt-2"
                    />
                  </div>

                  <Button onClick={saveMock}>
                    <Save className="h-4 w-4 mr-2" /> Save Mock
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a mock to edit or create a new one</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {activeMock && (
        <div className="ml-2 inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
          <Server className="h-3 w-3 mr-1" /> Mock active
        </div>
      )}
    </div>
  )
}

