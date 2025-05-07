//CM
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Collection, SavedRequest, RequestData } from "@/lib/types"
import { MoreVertical, Pencil, Trash2, Save } from "lucide-react"
import CollectionImporter from "./collection-importer"
import CurlImporter from "./curl-importer"

interface CollectionManagerProps {
  collections: Collection[]
  setCollections: (collections: Collection[]) => void
  currentRequest: RequestData | null
  onLoadRequest: (request: SavedRequest) => void
}

export default function CollectionManager({
  collections,
  setCollections,
  currentRequest,
  onLoadRequest,
}: CollectionManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [requestName, setRequestName] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const addCollection = () => {
    if (!newCollectionName.trim()) return

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName,
      requests: [],
    }

    setCollections([...collections, newCollection])
    setNewCollectionName("")
  }

  const deleteCollection = (collectionId: string) => {
    setCollections(collections.filter((c) => c.id !== collectionId))
  }

  const saveRequest = () => {
    if (!requestName.trim() || !selectedCollection || !currentRequest) return

    const newRequest: SavedRequest = {
      id: Date.now().toString(),
      name: requestName,
      request: { ...currentRequest },
      createdAt: new Date().toISOString(),
    }

    setCollections(
      collections.map((collection) => {
        if (collection.id === selectedCollection) {
          return {
            ...collection,
            requests: [...collection.requests, newRequest],
          }
        }
        return collection
      }),
    )

    setSaveDialogOpen(false)
    setRequestName("")
  }

  const deleteRequest = (collectionId: string, requestId: string) => {
    setCollections(
      collections.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            requests: collection.requests.filter((req) => req.id !== requestId),
          }
        }
        return collection
      }),
    )
  }

  const handleSaveRequest = () => {
    if (!currentRequest) return

    setSaveDialogOpen(true)
    if (collections.length > 0) {
      setSelectedCollection(collections[0].id)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleSaveRequest} disabled={!currentRequest}>
        <Save className="h-4 w-4 mr-2" /> Save Request
      </Button>

      <CollectionImporter collections={collections} setCollections={setCollections} />

      <CurlImporter collections={collections} setCollections={setCollections} onLoadRequest={onLoadRequest} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Collections</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="New collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <Button onClick={addCollection} disabled={!newCollectionName.trim()}>
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {collections.map((collection) => (
                <div key={collection.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{collection.name}</h3>
                    <Button variant="ghost" size="icon" onClick={() => deleteCollection(collection.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {collection.requests.length > 0 ? (
                    <div className="space-y-1">
                      {collection.requests.map((request) => (
                        <div
                          key={request.id}
                          className="flex justify-between items-center py-1 px-2 hover:bg-muted rounded-sm"
                        >
                          <Button
                            variant="ghost"
                            className="h-auto p-1 justify-start text-sm w-full"
                            onClick={() => onLoadRequest(request)}
                          >
                            <span className="font-medium">{request.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">{request.request.method}</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteRequest(collection.id, request.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No saved requests</p>
                  )}
                </div>
              ))}

              {collections.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No collections yet. Create one to start saving requests.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Request Name</label>
              <Input
                placeholder="My API Request"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Collection</label>
              {collections.length > 0 ? (
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedCollection || ""}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No collections available. Please create a collection first.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={saveRequest}
              disabled={!requestName.trim() || !selectedCollection || collections.length === 0}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

