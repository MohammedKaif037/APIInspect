"use client"
//Add headers
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import type { HeaderParam } from "@/lib/types"

interface HeadersEditorProps {
  headers: HeaderParam[]
  setHeaders: (headers: HeaderParam[]) => void
}

export default function HeadersEditor({ headers, setHeaders }: HeadersEditorProps) {
  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: keyof HeaderParam, value: string | boolean) => {
    const newHeaders = [...headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setHeaders(newHeaders)
  }

  return (
    <div className="space-y-2">
      {headers.map((header, index) => (
        <div key={index} className="flex items-center gap-2">
          <Checkbox
            id={`header-enabled-${index}`}
            checked={header.enabled}
            onCheckedChange={(checked) => updateHeader(index, "enabled", !!checked)}
          />
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
  )
}

