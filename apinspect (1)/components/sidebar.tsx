"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Save, FolderClosed, Settings, Plus, ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { Collection, RequestHistory, SavedRequest } from "@/lib/types"

interface SidebarProps {
  collections: Collection[]
  history: RequestHistory[]
  onLoadRequest: (request: SavedRequest | RequestHistory) => void
}

export default function Sidebar({ collections, history, onLoadRequest }: SidebarProps) {
  const [collectionsOpen, setCollectionsOpen] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="w-64 border-r bg-muted/30 hidden md:block">
      <div className="p-4 border-b">
        <Button className="w-full" variant="default">
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setCollectionsOpen(!collectionsOpen)}
            >
              {collectionsOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
              <FolderClosed className="h-4 w-4 mr-2" /> Collections
            </Button>

            {collectionsOpen && (
              <div className="pl-6 space-y-1">
                {collections.length > 0 ? (
                  collections.map((collection) => (
                    <div key={collection.id} className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                        {collection.name}
                      </Button>

                      <div className="pl-4 space-y-1">
                        {collection.requests.map((request) => (
                          <Button
                            key={request.id}
                            variant="ghost"
                            className="w-full justify-start text-xs"
                            onClick={() => onLoadRequest(request)}
                          >
                            <span className="truncate">{request.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    + New Collection
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1 mt-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setHistoryOpen(!historyOpen)}>
              {historyOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
              <History className="h-4 w-4 mr-2" /> History
            </Button>

            {historyOpen && (
              <div className="pl-6 space-y-1">
                {history.length > 0 ? (
                  history.slice(0, 10).map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start text-xs"
                      onClick={() => onLoadRequest(item)}
                    >
                      <span className="truncate">
                        {item.request.method} {item.request.url.split("?")[0].split("/").pop()}
                      </span>
                      <span className="ml-auto text-muted-foreground text-xs">{formatDate(item.timestamp)}</span>
                    </Button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground px-2 py-1">No request history yet</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1 mt-2">
            <Button variant="ghost" className="w-full justify-start">
              <Save className="h-4 w-4 mr-2" /> Saved Requests
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

