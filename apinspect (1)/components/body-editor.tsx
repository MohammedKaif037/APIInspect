"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, FileUp, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BodyEditorProps {
  body: string
  contentType: string
  setBody: (body: string) => void
  setContentType: (contentType: string) => void
}

interface FormDataItem {
  key: string
  value: string
  type: "text" | "file"
  enabled: boolean
  file?: File | null
}

export default function BodyEditor({ body, contentType, setBody, setContentType }: BodyEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("raw")
  const [rawType, setRawType] = useState<string>(contentType || "application/json")
  const [formData, setFormData] = useState<FormDataItem[]>([{ key: "", value: "", type: "text", enabled: true }])
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [formUrlEncoded, setFormUrlEncoded] = useState<FormDataItem[]>([
    { key: "", value: "", type: "text", enabled: true },
  ])

  // Initialize the editor based on the content type
  useEffect(() => {
    if (contentType.includes("json")) {
      setActiveTab("raw")
      setRawType("application/json")
    } else if (contentType.includes("xml")) {
      setActiveTab("raw")
      setRawType("application/xml")
    } else if (contentType.includes("form-urlencoded")) {
      setActiveTab("x-www-form-urlencoded")
      try {
        const params = new URLSearchParams(body)
        const items: FormDataItem[] = []
        params.forEach((value, key) => {
          items.push({ key, value, type: "text", enabled: true })
        })
        if (items.length === 0) {
          items.push({ key: "", value: "", type: "text", enabled: true })
        }
        setFormUrlEncoded(items)
      } catch (e) {
        setFormUrlEncoded([{ key: "", value: "", type: "text", enabled: true }])
      }
    } else if (contentType.includes("form-data")) {
      setActiveTab("form-data")
      // Form data is more complex to parse from a string, so we'll just initialize with empty
      setFormData([{ key: "", value: "", type: "text", enabled: true }])
    } else {
      setActiveTab("raw")
      setRawType("text/plain")
    }
  }, [])

  // Update content type when tab or raw type changes
  useEffect(() => {
    if (activeTab === "raw") {
      setContentType(rawType)
    } else if (activeTab === "form-data") {
      setContentType("multipart/form-data")
    } else if (activeTab === "x-www-form-urlencoded") {
      setContentType("application/x-www-form-urlencoded")
    }
  }, [activeTab, rawType, setContentType])

  // Update body when form data changes
  useEffect(() => {
    if (activeTab === "x-www-form-urlencoded") {
      const params = new URLSearchParams()
      formUrlEncoded
        .filter((item) => item.key && item.enabled)
        .forEach((item) => {
          params.append(item.key, item.value)
        })
      setBody(params.toString())
    }
  }, [activeTab, formUrlEncoded, setBody])

  const handleFormatJson = () => {
    if (rawType !== "application/json") return

    try {
      const parsed = JSON.parse(body)
      setBody(JSON.stringify(parsed, null, 2))
      setJsonError(null)
    } catch (e) {
      if (e instanceof Error) {
        setJsonError(e.message)
      } else {
        setJsonError("Invalid JSON")
      }
    }
  }

  const validateJson = () => {
    if (rawType !== "application/json") {
      setJsonError(null)
      return
    }

    try {
      JSON.parse(body)
      setJsonError(null)
    } catch (e) {
      if (e instanceof Error) {
        setJsonError(e.message)
      } else {
        setJsonError("Invalid JSON")
      }
    }
  }

  const addFormDataItem = () => {
    setFormData([...formData, { key: "", value: "", type: "text", enabled: true }])
  }

  const updateFormDataItem = (index: number, field: keyof FormDataItem, value: any) => {
    const newFormData = [...formData]
    newFormData[index] = { ...newFormData[index], [field]: value }
    setFormData(newFormData)
  }

  const removeFormDataItem = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const handleFileChange = async (index: number, file: File | null) => {
    if (!file) {
      updateFormDataItem(index, "file", null)
      updateFormDataItem(index, "value", "")
      return
    }

    updateFormDataItem(index, "file", file)
    updateFormDataItem(index, "value", file.name)

    // In a real app, you might want to read the file and convert it to base64 or handle it differently
    // For now, we'll just store the file object
  }

  const addFormUrlEncodedItem = () => {
    setFormUrlEncoded([...formUrlEncoded, { key: "", value: "", type: "text", enabled: true }])
  }

  const updateFormUrlEncodedItem = (index: number, field: keyof FormDataItem, value: any) => {
    const newFormUrlEncoded = [...formUrlEncoded]
    newFormUrlEncoded[index] = { ...newFormUrlEncoded[index], [field]: value }
    setFormUrlEncoded(newFormUrlEncoded)
  }

  const removeFormUrlEncodedItem = (index: number) => {
    setFormUrlEncoded(formUrlEncoded.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="form-data">Form Data</TabsTrigger>
          <TabsTrigger value="x-www-form-urlencoded">x-www-form-urlencoded</TabsTrigger>
        </TabsList>

        <TabsContent value="raw" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select value={rawType} onValueChange={setRawType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="application/json">JSON</SelectItem>
                <SelectItem value="application/xml">XML</SelectItem>
                <SelectItem value="text/plain">Text</SelectItem>
                <SelectItem value="text/html">HTML</SelectItem>
                <SelectItem value="application/javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>

            {rawType === "application/json" && (
              <Button variant="outline" size="sm" onClick={handleFormatJson}>
                Format JSON
              </Button>
            )}
          </div>

          {jsonError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{jsonError}</AlertDescription>
            </Alert>
          )}

          <Textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              if (rawType === "application/json") {
                validateJson()
              }
            }}
            placeholder={
              rawType === "application/json"
                ? '{\n  "key": "value"\n}'
                : rawType === "application/xml"
                  ? "<root>\n  <element>value</element>\n</root>"
                  : "Enter request body"
            }
            className="font-mono min-h-[300px]"
          />
        </TabsContent>

        <TabsContent value="form-data" className="space-y-4">
          <div className="space-y-2">
            {formData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox
                  id={`form-data-enabled-${index}`}
                  checked={item.enabled}
                  onCheckedChange={(checked) => updateFormDataItem(index, "enabled", !!checked)}
                />
                <Input
                  placeholder="Key"
                  value={item.key}
                  onChange={(e) => updateFormDataItem(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Select value={item.type} onValueChange={(value) => updateFormDataItem(index, "type", value)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                  </SelectContent>
                </Select>
                {item.type === "text" ? (
                  <Input
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) => updateFormDataItem(index, "value", e.target.value)}
                    className="flex-1"
                  />
                ) : (
                  <div className="flex-1 flex gap-2">
                    <Input
                      type="file"
                      id={`file-input-${index}`}
                      className="hidden"
                      onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                    />
                    <Input placeholder="Select a file" value={item.file?.name || ""} readOnly className="flex-1" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById(`file-input-${index}`)?.click()}
                    >
                      <FileUp className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button variant="ghost" size="icon" onClick={() => removeFormDataItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addFormDataItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              Note: Form data with files will be properly formatted when sending the request. The preview below shows
              the keys that will be sent.
            </p>
            <pre className="mt-2 p-2 bg-muted rounded-md text-xs">
              {formData
                .filter((item) => item.key && item.enabled)
                .map((item) => `${item.key}: ${item.type === "file" ? "[FILE]" : item.value}`)
                .join("\n")}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="x-www-form-urlencoded" className="space-y-4">
          <div className="space-y-2">
            {formUrlEncoded.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox
                  id={`form-urlencoded-enabled-${index}`}
                  checked={item.enabled}
                  onCheckedChange={(checked) => updateFormUrlEncodedItem(index, "enabled", !!checked)}
                />
                <Input
                  placeholder="Key"
                  value={item.key}
                  onChange={(e) => updateFormUrlEncodedItem(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => updateFormUrlEncodedItem(index, "value", e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeFormUrlEncodedItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addFormUrlEncodedItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Preview:</p>
            <pre className="mt-2 p-2 bg-muted rounded-md text-xs break-all">
              {formUrlEncoded
                .filter((item) => item.key && item.enabled)
                .map((item) => `${encodeURIComponent(item.key)}=${encodeURIComponent(item.value)}`)
                .join("&")}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

