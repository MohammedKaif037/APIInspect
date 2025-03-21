"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import type { QueryParam } from "@/lib/types"

interface ParamsEditorProps {
  params: QueryParam[]
  setParams: (params: QueryParam[]) => void
}

export default function ParamsEditor({ params, setParams }: ParamsEditorProps) {
  const addParam = () => {
    setParams([...params, { key: "", value: "", enabled: true }])
  }

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index))
  }

  const updateParam = (index: number, field: keyof QueryParam, value: string | boolean) => {
    const newParams = [...params]
    newParams[index] = { ...newParams[index], [field]: value }
    setParams(newParams)
  }

  return (
    <div className="space-y-2">
      {params.map((param, index) => (
        <div key={index} className="flex items-center gap-2">
          <Checkbox
            id={`param-enabled-${index}`}
            checked={param.enabled}
            onCheckedChange={(checked) => updateParam(index, "enabled", !!checked)}
          />
          <Input
            placeholder="Parameter name"
            value={param.key}
            onChange={(e) => updateParam(index, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={param.value}
            onChange={(e) => updateParam(index, "value", e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => removeParam(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addParam} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Parameter
      </Button>
    </div>
  )
}

