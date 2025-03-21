"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { MockConfig, MockRule, MockHeader, MockServerLog } from "@/lib/types"
import { mockServer } from "@/lib/mock-server"
import { Server, Plus, Trash2, Play, Save, FileJson, Clock, List, Settings, Code, AlertCircle, CheckCircle2, Copy, RotateCw } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<string>("mocks")
  const [logs, setLogs] = useState<MockServerLog[]>([])
  const [newRule, setNewRule] = useState<MockRule | null>(null)
  const [editingRule, setEditingRule] = useState<MockRule | null>(null)
  const [copied, setCopied] = useState(false)

  // Fetch logs when the dialog is opened
  useEffect(() => {
    if (isOpen) {
      setLogs(mockServer.getLogs())
    }
  }, [isOpen])

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
      rules: [],
      dynamicResponse: false,
      responseTemplate: "",
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

  const addRule = () => {
    if (!editingMock) return

    const rule: MockRule = {
      id: Date.now().toString(),
      name: `Rule ${(editingMock.rules?.length || 0) + 1}`,
      condition: {
        type: "query",
        key: "param",
        value: "value",
        operator: "equals",
      },
      response: {
        status: 200,
        headers: [{ key: "Content-Type", value: "application/json" }],
        body: JSON.stringify({ message: "This is a rule response" }, null, 2),
        delay: 0,
      },
    }

    setEditingMock({
      ...editingMock,
      rules: [...(editingMock.rules || []), rule],
    })

    setEditingRule(rule)
  }

  const updateRule = (ruleId: string, field: keyof MockRule, value: any) => {
    if (!editingMock || !editingMock.rules) return

    const updatedRules = editingMock.rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          [field]: value,
        }
      }
      return rule
    })

    setEditingMock({
      ...editingMock,
      rules: updatedRules,
    })

    if (editingRule?.id === ruleId) {
      setEditingRule({
        ...editingRule,
        [field]: value,
      })
    }
  }

  const updateRuleCondition = (ruleId: string, field: keyof MockRule["condition"], value: any) => {
    if (!editingMock || !editingMock.rules) return

    const updatedRules = editingMock.rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          condition: {
            ...rule.condition,
            [field]: value,
          },
        }
      }
      return rule
    })

    setEditingMock({
      ...editingMock,
      rules: updatedRules,
    })

    if (editingRule?.id === ruleId) {
      setEditingRule({
        ...editingRule,
        condition: {
          ...editingRule.condition,
          [field]: value,
        },
      })
    }
  }

  const updateRuleResponse = (ruleId: string, field: keyof MockRule["response"], value: any) => {
    if (!editingMock || !editingMock.rules) return

    const updatedRules = editingMock.rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          response: {
            ...rule.response,
            [field]: value,
          },
        }
      }
      return rule
    })

    setEditingMock({
      ...editingMock,
      rules: updatedRules,
    })

    if (editingRule?.id === ruleId) {
      setEditingRule({
        ...editingRule,
        response: {
          ...editingRule.response,
          [field]: value,
        },
      })
    }
  }

  const updateRuleResponseHeader = (
    ruleId: string,
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    if (!editingMock || !editingMock.rules) return

    const updatedRules = editingMock.rules.map((rule) => {
      if (rule.id === ruleId) {
        const updatedHeaders = [...rule.response.headers]
        updatedHeaders[index] = {
          ...updatedHeaders[index],
          [field]: value,
        }

        return {
          ...rule,
          response: {
            ...rule.response,
            headers: updatedHeaders,
          },
        }
      }
      return rule
    })

    setEditingMock({
      ...editingMock,
      rules: updatedRules,
    })

    if (editingRule?.id === ruleId) {
      const updatedHeaders = [...editingRule.response.headers]
      updatedHeaders[index] = {
        ...updatedHeaders[index],
        [field]: value,
      }

      setEditingRule({
        ...editingRule,
        response: {
          ...editingRule.response,
          headers: updatedHeaders,
        },
      })
    }
  }

  const addRuleResponseHeader = (ruleId: string) => {
    if (!editingMock || !editingMock.rules) return

    const updatedRules = editingMock.rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          response: {
            ...rule.response,
            headers: [...rule.response.headers, { key: "", value: "" }],
          },
        }
      }
      return rule
    })

    setEditingMock({
      ...editingMock,
      rules: updatedRules,
    })

    if (editingRule?.id === ruleId) {
      setEditingRule({
        ...editingRule,
        response: {
          ...editingRule.response,
          headers: [...editingRule.response.headers, { key: "", value: "" }],
        },
      })
    }
  }

  const removeRuleResponseHeader = (ruleId: string, index: number) => {
    if (!editingMock || !editingMock.rules) return

    const updatedRules = editingMock.rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          response: {
            ...rule.response,
            headers: rule.response.headers.filter((_, i) => i !== index),
          },
        }
      }
      return rule
    })

    setEditingMock({
      ...editingMock,
      rules: updatedRules,
    })

    if (editingRule?.id === ruleId) {
      setEditingRule({
        ...editingRule,
        response: {
          ...editingRule.response,
          headers: editingRule.response.headers.filter((_, i) => i !== index),
        },
      })
    }
  }

  const deleteRule = (ruleId: string) => {
    if (!editingMock || !editingMock.rules) return

    const updatedRules = editingMock.rules.filter((rule) => rule.id !== ruleId)

    setEditingMock({
      ...editingMock,
      rules: updatedRules,
    })

    if (editingRule?.id === ruleId) {
      setEditingRule(null)
    }
  }

  const formatRuleResponseJson = (ruleId: string) => {
    if (!editingMock || !editingMock.rules) return

    const rule = editingMock.rules.find((r) => r.id === ruleId)
    if (!rule) return

    try {
      const parsed = JSON.parse(rule.response.body)
      updateRuleResponse(ruleId, "body", JSON.stringify(parsed, null, 2))
    } catch (e) {
      // If not valid JSON, do nothing
    }
  }

  const refreshLogs = () => {
    setLogs(mockServer.getLogs())
  }

  const clearLogs = () => {
    mockServer.clearLogs()
    setLogs([])
  }

  const copyTemplateHelp = () => {
    const help = `
# Mock Server Template Variables

Use these variables in your response template to create dynamic responses:

## Query Parameters
{{query.paramName}} - Value of the query parameter

## Path Parameters
{{path.paramName}} - Value of the path parameter (defined with :paramName in the path)

## Headers
{{header.headerName}} - Value of the request header

## Body Properties
{{body.propName}} - Value of a property in the JSON body
{{body.nested.prop}} - Value of a nested property

## Random Values
{{random.number(min,max)}} - Random number between min and max
{{random.string(length)}} - Random string of specified length

## Date and Time
{{date.now}} - Current date and time in ISO format
{{date.format(YYYY-MM-DD)}} - Current date formatted as specified

## Examples
{
  "id": {{random.number(1,1000)}},
  "name": "{{body.name}}",
  "token": "{{random.string(32)}}",
  "createdAt": "{{date.now}}",
  "queryParam": "{{query.filter}}",
  "requestHeader": "{{header.authorization}}"
}
`.trim()

    navigator.clipboard.writeText(help)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-blue-500";
      case "POST": return "bg-green-500";
      case "PUT": return "bg-orange-500";
      case "DELETE": return "bg-red-500";
      case "PATCH": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-blue-500";
    if (status >= 400 && status < 500) return "bg-yellow-500";
    if (status >= 500) return "bg-red-500";
    return "bg-gray-500";
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Server className="h-4 w-4 mr-2" /> Mock Server
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Mock Server</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="mocks">Mocks</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>

            <TabsContent value="mocks" className="flex-1 overflow-hidden">
              <div className="flex gap-4 h-full overflow-hidden">
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
                      <Tabs defaultValue="basic">
                        <TabsList>
                          <TabsTrigger value="basic">Basic</TabsTrigger>
                          <TabsTrigger value="rules">Rules</TabsTrigger>
                          <TabsTrigger value="dynamic">Dynamic Response</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 mt-4">
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
                        </TabsContent>

                        <TabsContent value="rules" className="space-y-4 mt-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Conditional Rules</h3>
                            <Button onClick={addRule}>
                              <Plus className="h-4 w-4 mr-2" /> Add Rule
                            </Button>
                          </div>

                          {editingMock.rules && editingMock.rules.length > 0 ? (
                            <Accordion
                              type="single"
                              collapsible
                              value={editingRule?.id}
                              onValueChange={(value) => {
                                if (value) {
                                  const rule = editingMock.rules?.find((r) => r.id === value);
                                  setEditingRule(rule || null);
                                } else {
                                  setEditingRule(null);
                                }
                              }}
                            >
                              {editingMock.rules.map((rule) => (
                                <AccordionItem key={rule.id} value={rule.id}>
                                  <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
                                    <div className="flex items-center justify-between w-full pr-4">
                                      <span>{rule.name}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline">{rule.condition.type}</Badge>
                                        <Badge className={getStatusColor(rule.response.status)}>
                                          {rule.response.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-4 p-2">
                                      <div className="flex justify-between items-center">
                                        <Input
                                          value={rule.name}
                                          onChange={(e) => updateRule(rule.id, "name", e.target.value)}
                                          className="max-w-xs"
                                          placeholder="Rule name"
                                        />
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => deleteRule(rule.id)}
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" /> Delete Rule
                                        </Button>
                                      </div>

                                      <div className="border p-4 rounded-md space-y-4">
                                        <h4 className="font-medium">Condition</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Type</Label>
                                            <Select
                                              value={rule.condition.type}
                                              onValueChange={(value) =>
                                                updateRuleCondition(rule.id, "type", value)
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Condition type" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="query">Query Parameter</SelectItem>
                                                <SelectItem value="header">Header</SelectItem>
                                                <SelectItem value="body">Body</SelectItem>
                                                <SelectItem value="path">Path</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label>Operator</Label>
                                            <Select
                                              value={rule.condition.operator}
                                              onValueChange={(value) =>
                                                updateRuleCondition(rule.id, "operator", value)
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Operator" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="equals">Equals</SelectItem>
                                                <SelectItem value="contains">Contains</SelectItem>
                                                <SelectItem value="startsWith">Starts With</SelectItem>
                                                <SelectItem value="endsWith">Ends With</SelectItem>
                                                <SelectItem value="regex">Regex</SelectItem>
                                                <SelectItem value="exists">Exists</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>

                                        {rule.condition.type !== "path" && rule.condition.operator !== "exists" && (
                                          <div>
                                            <Label>Key</Label>
                                            <Input
                                              value={rule.condition.key || ""}
                                              onChange={(e) =>
                                                updateRuleCondition(rule.id, "key", e.target.value)
                                              }
                                              placeholder={
                                                rule.condition.type === "query"
                                                  ? "Query parameter name"
                                                  : rule.condition.type === "header"
                                                  ? "Header name"
                                                  : "Body property path (e.g., user.name)"
                                              }
                                            />
                                          </div>
                                        )}

                                        <div>
                                          <Label>Value</Label>
                                          <Input
                                            value={rule.condition.value}
                                            onChange={(e) =>
                                              updateRuleCondition(rule.id, "value", e.target.value)
                                            }
                                            placeholder="Value to match"
                                          />
                                        </div>
                                      </div>

                                      <div className="border p-4 rounded-md space-y-4">
                                        <h4 className="font-medium">Response</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>Status Code</Label>
                                            <Input
                                              type="number"
                                              value={rule.response.status}
                                              onChange={(e) =>
                                                updateRuleResponse(
                                                  rule.id,
                                                  "status",
                                                  Number.parseInt(e.target.value) || 200
                                                )
                                              }
                                            />
                                          </div>
                                          <div>
                                            <Label>Delay (ms)</Label>
                                            <Input
                                              type="number"
                                              value={rule.response.delay}
                                              onChange={(e) =>
                                                updateRuleResponse(
                                                  rule.id,
                                                  "delay",
                                                  Number.parseInt(e.target.value) || 0
                                                )
                                              }
                                            />
                                          </div>
                                        </div>

                                        <div>
                                          <Label>Headers</Label>
                                          <div className="space-y-2 mt-2">
                                            {rule.response.headers.map((header, index) => (
                                              <div key={index} className="flex items-center gap-2">
                                                <Input
                                                  placeholder="Header name"
                                                  value={header.key}
                                                  onChange={(e) =>
                                                    updateRuleResponseHeader(
                                                      rule.id,
                                                      index,
                                                      "key",
                                                      e.target.value
                                                    )
                                                  }
                                                  className="flex-1"
                                                />
                                                <Input
                                                  placeholder="Value"
                                                  value={header.value}
                                                  onChange={(e) =>
                                                    updateRuleResponseHeader(
                                                      rule.id,
                                                      index,
                                                      "value",
                                                      e.target.value
                                                    )
                                                  }
                                                  className="flex-1"
                                                />
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() => removeRuleResponseHeader(rule.id, index)}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ))}

                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => addRuleResponseHeader(rule.id)}
                                              className="w-full"
                                            >
                                              <Plus className="h-4 w-4 mr-2" /> Add Header
                                            </Button>
                                          </div>
                                        </div>

                                        <div>
                                          <div className="flex justify-between items-center">
                                            <Label>Response Body</Label>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => formatRuleResponseJson(rule.id)}
                                            >
                                              Format JSON
                                            </Button>
                                          </div>
                                          <Textarea
                                            value={rule.response.body}
                                            onChange={(e) =>
                                              updateRuleResponse(rule.id, "body", e.target.value)
                                            }
                                            className="font-mono min-h-[150px] mt-2"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          ) : (
                            <div className="border rounded-md p-4 text-center text-muted-foreground">
                              <p>No rules defined. Rules allow you to return different responses based on conditions.</p>
                              <Button onClick={addRule} className="mt-2">
                                <Plus className="h-4 w-4 mr-2" /> Add Your First Rule
                              </Button>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="dynamic" className="space-y-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="dynamic-response"
                              checked={editingMock.dynamicResponse || false}
                              onCheckedChange={(checked) => updateMock("dynamicResponse", checked)}
                            />
                            <Label htmlFor="dynamic-response">Enable Dynamic Response</Label>
                          </div>

                          <div className="border p-4 rounded-md space-y-4">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="response-template">Response Template</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={copyTemplateHelp}
                                className="flex items-center gap-1"
                              >
                                {copied ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4" /> Copy Template Help
                                  </>
                                )}
                              </Button>
                            </div>
                            <Textarea
                              id="response-template"
                              value={editingMock.responseTemplate || ""}
                              onChange={(e) => updateMock("responseTemplate", e.target.value)}
                              className="font-mono min-h-[300px]"
                              placeholder={`{
  "id": "{{random.number(1,1000)}}",
  "name": "{{body.name}}",
  "email": "{{body.email}}",
  "token": "{{random.string(32)}}",
  "createdAt": "{{date.now}}",
  "queryParam": "{{query.filter}}",
  "requestHeader": "{{header.authorization}}"
}`}
                              disabled={!editingMock.dynamicResponse}
                            />
                            <p className="text-sm text-muted-foreground">
                              Use template variables to create dynamic responses based on the request. See the Help tab
                              for more information.
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>

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
            </TabsContent>

            <TabsContent value="logs" className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Request Logs</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshLogs}>
                    <RotateCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                  <Button variant="destructive" size="sm" onClick={clearLogs}>
                    <Trash2 className="h-4 w-4 mr-2" /> Clear Logs
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[500px] w-full">
                {logs.length > 0 ? (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getMethodColor(log.request.method)}>
                              {log.request.method}
                            </Badge>
                            <span className="text-sm font-medium truncate max-w-[300px]">
                              {log.request.url}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(log.response.status)}>
                              {log.response.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Request</h4>
                            <div className="bg-muted/50 p-2 rounded-md text-xs font-mono h-[150px] overflow-auto">
                              <div className="mb-2">
                                <span className="font-bold">Headers:</span>
                                <pre className="mt-1 whitespace-pre-wrap">
                                  {JSON.stringify(log.request.headers, null, 2)}
                                </pre>
                              </div>
                              {log.request.body && (
                                <div>
                                  <span className="font-bold">Body:</span>
                                  <pre className="mt-1 whitespace-pre-wrap">
                                    {typeof log.request.body === "string"
                                      ? log.request.body
                                      : JSON.stringify(log.request.body, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Response</h4>
                            <div className="bg-muted/50 p-2 rounded-md text-xs font-mono h-[150px] overflow-auto">
                              <div className="mb-2">
                                <span className="font-bold">Headers:</span>
                                <pre className="mt-1 whitespace-pre-wrap">
                                  {JSON.stringify(log.response.headers, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <span className="font-bold">Body:</span>
                                <pre className="mt-1 whitespace-pre-wrap">
                                  {typeof log.response.body === "string"
                                    ? log.response.body
                                    : JSON.stringify(log.response.body, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>
                              <span className="font-medium">Mock:</span> {log.mockName}
                            </span>
                            {log.ruleName && (
                              <span>
                                <span className="font-medium">Rule:</span> {log.ruleName}
                              </span>
                            )}
                            <span>
                              <span className="font-medium">Latency:</span> {log.latency}ms
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No logs yet. Send requests to the mock server to see logs.</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="help" className="flex-1 overflow-auto">
              <div className="space-y-6 p-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Mock Server Overview</h3>
                  <p>
                    The mock server allows you to create mock API endpoints that return predefined responses. This is
                    useful for testing your application without relying on actual backend services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Create a new mock by entering a name and clicking the + button</li>
                    <li>Configure the mock with a path, method, status code, headers, and response body</li>
                    <li>Click "Save Mock" to save your changes</li>
                    <li>Activate the mock by clicking the play button</li>
                    <li>Send requests to the mock server using the configured path</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Path Patterns</h3>
                  <p className="mb-2">
                    You can use patterns in the path to match multiple endpoints:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code className="bg-muted px-1 rounded">/api/users/:id</code> - Matches{" "}
                      <code className="bg-muted px-1 rounded">/api/users/123</code>,{" "}
                      <code className="bg-muted px-1 rounded">/api/users/456</code>, etc.
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">/api/products/*</code> - Matches any path that starts with{" "}
                      <code className="bg-muted px-1 rounded">/api/products/</code>
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">/api/**</code> - Matches any path that starts with{" "}
                      <code className="bg-muted px-1 rounded">/api/</code> including nested paths
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Conditional Rules</h3>
                  <p className="mb-2">
                    Rules allow you to return different responses based on conditions:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Query Parameter</strong> - Match based on query parameters in the URL
                    </li>
                    <li>
                      <strong>Header</strong> - Match based on request headers
                    </li>
                    <li>
                      <strong>Body</strong> - Match based on request body content
                    </li>
                    <li>
                      <strong>Path</strong> - Match based on the request path
                    </li>
                  </ul>
                  <p className="mt-2">
                    Each rule has a condition and a response. If the condition matches, the rule's response is returned
                    instead of the default response.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Dynamic Responses</h3>
                  <p className="mb-2">
                    Dynamic responses allow you to generate response data based on the request:
                  </p>
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Template Variables</h4>
                    <ul className="space-y-2">
                      <li>
                        <code className="font-bold">{"{{query.paramName}}"}</code> - Value of the query parameter
                      </li>
                      <li>
                        <code className="font-bold">{"{{path.paramName}}"}</code> - Value of the path parameter
                      </li>
                      <li>
                        <code className="font-bold">{"{{header.headerName}}"}</code> - Value of the request header
                      </li>
                      <li>
                        <code className="font-bold">{"{{body.propName}}"}</code> - Value of a property in the JSON body
                      </li>
                      <li>
                        <code className="font-bold">{"{{random.number(min,max)}}"}</code> - Random number between min and max
                      </li>
                      <li>
                        <code className="font-bold">{"{{random.string(length)}}"}</code> - Random string of specified length
                      </li>
                      <li>
                        <code className="font-bold">{"{{date.now}}"}</code> - Current date and time in ISO format
                      </li>
                      <li>
                        <code className="font-bold">{"{{date.format(YYYY-MM-DD)}}"}</code> - Current date formatted as specified
                      </li>
                    </ul>
                  </div>
                  <p className="mt-2">
                    Enable dynamic responses in the "Dynamic Response" tab and use template variables in your response template.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Logs</h3>
                  <p>
                    The Logs tab shows a history of requests handled by the mock server. You can see the request details, response, and which mock and rule (if any) was used to generate the response.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
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

