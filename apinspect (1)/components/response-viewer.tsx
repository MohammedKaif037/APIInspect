import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ResponseData } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

interface ResponseViewerProps {
  response: ResponseData | null
  isLoading: boolean
}

export default function ResponseViewer({ response, isLoading }: ResponseViewerProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-8 bg-card flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Sending request...</p>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="border rounded-lg p-8 bg-card">
        <div className="text-center text-muted-foreground">
          <p>Send a request to see the response here</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500"
    if (status >= 300 && status < 400) return "bg-blue-500"
    if (status >= 400 && status < 500) return "bg-yellow-500"
    if (status >= 500) return "bg-red-500"
    return "bg-gray-500" // For errors or unknown status
  }

  const formatJson = (data: any) => {
    try {
      if (typeof data === "string") {
        try {
          // Try to parse if it's a JSON string
          data = JSON.parse(data)
        } catch {
          // If it's not valid JSON, keep it as a string
        }
      }

      if (typeof data === "object" && data !== null) {
        return JSON.stringify(data, null, 2)
      }

      return String(data)
    } catch (error) {
      return String(data)
    }
  }

  return (
    <div className="border rounded-lg bg-card">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(response.status)}`}>
            {response.status} {response.statusText}
          </Badge>
          {response.time > 0 && <span className="text-sm text-muted-foreground">{response.time} ms</span>}
        </div>
        {response.size > 0 && (
          <span className="text-sm text-muted-foreground">Size: {(response.size / 1024).toFixed(2)} KB</span>
        )}
      </div>

      <Tabs defaultValue="body">
        <TabsList className="px-4 pt-2">
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="p-4">
          <ScrollArea className="h-[400px] w-full rounded border bg-muted/50 p-4">
            <pre className="font-mono text-sm whitespace-pre-wrap">{formatJson(response.body)}</pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="headers" className="p-4">
          <ScrollArea className="h-[400px] w-full rounded border bg-muted/50 p-4">
            <div className="space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[1fr,2fr] gap-2">
                  <div className="font-medium text-sm">{key}:</div>
                  <div className="text-sm text-muted-foreground">{value}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

