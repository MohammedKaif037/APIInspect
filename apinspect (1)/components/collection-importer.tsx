"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { AlertCircle, FileUp, Import } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Collection, SavedRequest } from "@/lib/types"

interface CollectionImporterProps {
  collections: Collection[]
  setCollections: (collections: Collection[]) => void
}

interface PostmanRequest {
  method: string
  header: Array<{ key: string; value: string }>
  body?: {
    mode: string
    raw?: string
  }
  url: {
    raw: string
    protocol?: string
    host?: string[]
    port?: string
    path?: string[]
  }
}

interface PostmanItem {
  name: string
  request: PostmanRequest
  item?: PostmanItem[]
}

interface PostmanCollection {
  info: {
    _postman_id: string
    name: string
  }
  item: PostmanItem[]
}

export default function CollectionImporter({ collections, setCollections }: CollectionImporterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importText, setImportText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleImport = () => {
    try {
      setError(null)

      // Parse the JSON
      const postmanCollection = JSON.parse(importText) as PostmanCollection

      if (!postmanCollection.info || !postmanCollection.item) {
        throw new Error("Invalid Postman collection format")
      }

      // Create a new collection
      const newCollection: Collection = {
        id: postmanCollection.info._postman_id || Date.now().toString(),
        name: postmanCollection.info.name || "Imported Collection",
        requests: [],
      }

      // Process all items recursively
      const processItems = (items: PostmanItem[], parentPath = "") => {
        items.forEach((item) => {
          if (item.item) {
            // This is a folder, process its children
            processItems(item.item, parentPath ? `${parentPath}/${item.name}` : item.name)
          } else if (item.request) {
            // This is a request
            const request = item.request

            // Extract headers
            const headers =
              request.header?.map((h) => ({
                key: h.key,
                value: h.value,
                enabled: true,
              })) || []

            // Extract URL
            const url = request.url.raw || ""

            // Extract body
            let body = ""
            if (request.body?.mode === "raw" && request.body.raw) {
              body = request.body.raw
            }

            // Create saved request
            const savedRequest: SavedRequest = {
              id: Date.now().toString() + Math.random().toString(36).substring(2),
              name: parentPath ? `${parentPath}/${item.name}` : item.name,
              request: {
                method: request.method,
                url,
                headers,
                body,
                contentType: headers.find((h) => h.key.toLowerCase() === "content-type")?.value || "application/json",
              },
              createdAt: new Date().toISOString(),
            }

            newCollection.requests.push(savedRequest)
          }
        })
      }

      processItems(postmanCollection.item)

      // Add the new collection to existing collections
      setCollections([...collections, newCollection])

      // Close the dialog and reset the input
      setIsOpen(false)
      setImportText("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import collection")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Import className="h-4 w-4 mr-2" /> Import Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">Paste a Postman Collection JSON to import it into APInspect.</p>

          <Textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste Postman Collection JSON here..."
            className="min-h-[300px] font-mono text-sm"
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleImport} disabled={!importText.trim()}>
            <FileUp className="h-4 w-4 mr-2" /> Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

