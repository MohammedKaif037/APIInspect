"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RequestHistory } from "@/lib/types"
import { History, Clock, Trash2 } from "lucide-react"

interface HistoryViewerProps {
  history: RequestHistory[]
  onLoadRequest: (historyItem: RequestHistory) => void
  onClearHistory: () => void
}

export default function HistoryViewer({ history, onLoadRequest, onClearHistory }: HistoryViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-500"
    if (status >= 300 && status < 400) return "text-blue-500"
    if (status >= 400 && status < 500) return "text-yellow-500"
    if (status >= 500) return "text-red-500"
    return "text-gray-500" // For errors or unknown status
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-blue-500"
      case "POST":
        return "text-green-500"
      case "PUT":
        return "text-orange-500"
      case "DELETE":
        return "text-red-500"
      case "PATCH":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <History className="h-4 w-4 mr-2" /> History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Request History</span>
            <Button variant="destructive" size="sm" onClick={onClearHistory}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear History
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4">
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    onLoadRequest(item)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${getMethodColor(item.request.method)}`}>
                        {item.request.method}
                      </span>
                      <span className="text-sm truncate max-w-[300px]">{item.request.url}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.response && (
                        <span className={`font-mono ${getStatusColor(item.response.status)}`}>
                          {item.response.status}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>

                  {item.response && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>Time: {item.response.time} ms</span>
                        <span>•</span>
                        <span>Size: {(item.response.size / 1024).toFixed(2)} KB</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No request history yet</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

