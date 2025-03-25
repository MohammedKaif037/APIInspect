"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { AlertCircle, Terminal, Import } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import type { Collection, SavedRequest, HeaderParam } from "@/lib/types"

interface CurlImporterProps {
  collections: Collection[]
  setCollections: (collections: Collection[]) => void
  onLoadRequest?: (request: SavedRequest) => void
}

export default function CurlImporter({ collections, setCollections, onLoadRequest }: CurlImporterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [curlCommand, setCurlCommand] = useState("")
  const [requestName, setRequestName] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [importedRequest, setImportedRequest] = useState<SavedRequest | null>(null)

  const parseCurl = (curl: string) => {
    setError(null)
    try {
      // Basic curl parsing - this is a simplified version
      const trimmedCurl = curl.trim()

      if (!trimmedCurl.startsWith("curl")) {
        throw new Error("Command must start with 'curl'")
      }

      // Extract method
      let method = "GET"
      if (trimmedCurl.includes("-X ")) {
        const methodMatch = trimmedCurl.match(/-X\s+([A-Z]+)/)
        if (methodMatch && methodMatch[1]) {
          method = methodMatch[1]
        }
      } else if (trimmedCurl.includes("--request ")) {
        const methodMatch = trimmedCurl.match(/--request\s+([A-Z]+)/)
        if (methodMatch && methodMatch[1]) {
          method = methodMatch[1]
        }
      } else if (trimmedCurl.includes("-d ") || trimmedCurl.includes("--data ")) {
        // If there's data but no method specified, it's likely a POST
        method = "POST"
      }

      // Extract URL
      const urlMatch = trimmedCurl.match(/curl\s+['"]?([^'">\s]+)['"]?/)
      if (!urlMatch || !urlMatch[1]) {
        throw new Error("Could not find URL in curl command")
      }
      const url = urlMatch[1]

      // Extract headers
      const headers: HeaderParam[] = []
      const headerMatches = [...trimmedCurl.matchAll(/-H\s+['"]([^'"]+)['"]|--header\s+['"]([^'"]+)['"]/g)]

      headerMatches.forEach((match) => {
        const headerStr = match[1] || match[2]
        const colonIndex = headerStr.indexOf(":")
        if (colonIndex > 0) {
          const key = headerStr.substring(0, colonIndex).trim()
          const value = headerStr.substring(colonIndex + 1).trim()
          headers.push({ key, value, enabled: true })
        }
      })

      // Extract body
      let body = ""
      const dataMatch = trimmedCurl.match(/-d\s+['"]([^'"]+)['"]|--data\s+['"]([^'"]+)['"]/)
      if (dataMatch) {
        body = dataMatch[1] || dataMatch[2] || ""
      }

      // Create the request object
      const request: SavedRequest = {
        id: Date.now().toString(),
        name: requestName || `${method} ${new URL(url).pathname}`,
        request: {
          method,
          url,
          headers,
          body,
          contentType: headers.find((h) => h.key.toLowerCase() === "content-type")?.value || "application/json",
        },
        createdAt: new Date().toISOString(),
      }

      setImportedRequest(request)
      return request
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse cURL command")
      return null
    }
  }

  const handleImport = () => {
    const request = parseCurl(curlCommand)
    if (!request) return

    if (selectedCollection) {
      // Add to existing collection
      setCollections(
        collections.map((collection) => {
          if (collection.id === selectedCollection) {
            return {
              ...collection,
              requests: [...collection.requests, request],
            }
          }
          return collection
        }),
      )
    } else if (collectionName) {
      // Create new collection
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: collectionName,
        requests: [request],
      }
      setCollections([...collections, newCollection])
    } else {
      // Just load the request without saving to a collection
      if (onLoadRequest) {
        onLoadRequest(request)
      }
    }

    setIsOpen(false)
    setCurlCommand("")
    setRequestName("")
    setCollectionName("")
    setSelectedCollection(null)
    setImportedRequest(null)
  }

  const handleParse = () => {
    parseCurl(curlCommand)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Terminal className="h-4 w-4 mr-2" /> Import cURL
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import from cURL</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">Paste a cURL command to import it as a request.</p>

          <Textarea
            value={curlCommand}
            onChange={(e) => setCurlCommand(e.target.value)}
            placeholder="curl -X GET https://api.example.com/endpoint -H 'Content-Type: application/json'"
            className="min-h-[100px] font-mono text-sm"
          />

          <Button onClick={handleParse} disabled={!curlCommand.trim()}>
            Parse cURL
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {importedRequest && (
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Parsed Request</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Method</Label>
                  <div className="p-2 bg-muted rounded-md mt-1">{importedRequest.request.method}</div>
                </div>
                <div>
                  <Label>URL</Label>
                  <div className="p-2 bg-muted rounded-md mt-1 truncate">{importedRequest.request.url}</div>
                </div>
              </div>

              {importedRequest.request.headers.length > 0 && (
                <div>
                  <Label>Headers</Label>
                  <div className="p-2 bg-muted rounded-md mt-1 space-y-1">
                    {importedRequest.request.headers.map((header, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{header.key}:</span> {header.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importedRequest.request.body && (
                <div>
                  <Label>Body</Label>
                  <div className="p-2 bg-muted rounded-md mt-1 font-mono text-xs">{importedRequest.request.body}</div>
                </div>
              )}

              <div>
                <Label htmlFor="request-name">Request Name</Label>
                <Input
                  id="request-name"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="My API Request"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Save to Collection</Label>
                {collections.length > 0 ? (
                  <select
                    className="w-full p-2 border rounded-md mt-1"
                    value={selectedCollection || ""}
                    onChange={(e) => {
                      setSelectedCollection(e.target.value || null)
                      setCollectionName("")
                    }}
                  >
                    <option value="">Create new collection</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    No collections available. Create a new one below.
                  </p>
                )}
              </div>

              {!selectedCollection && (
                <div>
                  <Label htmlFor="collection-name">New Collection Name</Label>
                  <Input
                    id="collection-name"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="My Collection"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleImport}
            disabled={!importedRequest || (!selectedCollection && !collectionName && !onLoadRequest)}
          >
            <Import className="h-4 w-4 mr-2" />
            {selectedCollection || collectionName ? "Save to Collection" : "Load Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

