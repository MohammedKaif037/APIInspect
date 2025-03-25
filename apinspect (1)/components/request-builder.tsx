"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RequestData, AuthConfig } from "@/lib/types"
import HeadersEditor from "./headers-editor"
import ParamsEditor from "./params-editor"
import BodyEditor from "./body-editor"
import AuthManager from "./auth-manager"

// Define HTTP_METHODS here
const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]

// Update the RequestBuilderProps interface to include currentRequest
interface RequestBuilderProps {
  onSendRequest: (requestData: RequestData) => void
  isLoading: boolean
  authConfig: AuthConfig
  setAuthConfig: (config: AuthConfig) => void
  currentRequest: RequestData | null
}

// Update the function signature to include currentRequest
export default function RequestBuilder({
  onSendRequest,
  isLoading,
  authConfig,
  setAuthConfig,
  currentRequest,
}: RequestBuilderProps) {
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts")
  const [headers, setHeaders] = useState([{ key: "Content-Type", value: "application/json", enabled: true }])
  const [params, setParams] = useState([{ key: "", value: "", enabled: true }])
  const [body, setBody] = useState("")
  const [contentType, setContentType] = useState("application/json")

  // Add a useEffect to update the form when currentRequest changes
  useEffect(() => {
    if (currentRequest) {
      setMethod(currentRequest.method)
      setUrl(currentRequest.url)

      if (currentRequest.headers && currentRequest.headers.length > 0) {
        setHeaders(currentRequest.headers)
      }

      // Update content type if present
      const contentTypeHeader = currentRequest.headers?.find((h) => h.key.toLowerCase() === "content-type")
      if (contentTypeHeader) {
        setContentType(contentTypeHeader.value)
      }

      // Clear params by default
      setParams([{ key: "", value: "", enabled: true }])

      // Set body if present
      if (currentRequest.body) {
        setBody(currentRequest.body)
      } else {
        setBody("")
      }
    }
  }, [currentRequest])

  // Update Content-Type header when contentType changes
  const updateContentTypeHeader = (newContentType: string) => {
    setContentType(newContentType)

    // Find if there's already a Content-Type header
    const contentTypeHeaderIndex = headers.findIndex((h) => h.key.toLowerCase() === "content-type")

    if (contentTypeHeaderIndex >= 0) {
      // Update existing header
      const newHeaders = [...headers]
      newHeaders[contentTypeHeaderIndex] = {
        ...newHeaders[contentTypeHeaderIndex],
        value: newContentType,
        enabled: true,
      }
      setHeaders(newHeaders)
    } else {
      // Add new Content-Type header
      setHeaders([...headers, { key: "Content-Type", value: newContentType, enabled: true }])
    }
  }

  const handleSend = () => {
    // Process URL with query parameters
    let finalUrl = url
    const queryParams = params
      .filter((param) => param.key && param.enabled)
      .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
      .join("&")

    if (queryParams) {
      finalUrl += (url.includes("?") ? "&" : "?") + queryParams
    }

    onSendRequest({
      method,
      url: finalUrl,
      headers,
      body,
      contentType,
    })
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-card request-builder-section">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-32">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter request URL"
            className="w-full"
          />
        </div>
        <Button onClick={handleSend} disabled={isLoading || !url.trim()} className="w-full sm:w-auto">
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>

      <Tabs defaultValue="params">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="body" disabled={["GET", "HEAD"].includes(method)}>
            Body
          </TabsTrigger>
        </TabsList>
        <TabsContent value="params" className="p-2">
          <ParamsEditor params={params} setParams={setParams} />
        </TabsContent>
        <TabsContent value="headers" className="p-2">
          <HeadersEditor headers={headers} setHeaders={setHeaders} />
        </TabsContent>
        <TabsContent value="auth" className="p-2">
          <AuthManager authConfig={authConfig} setAuthConfig={setAuthConfig} />
        </TabsContent>
        <TabsContent value="body" className="p-2">
          <BodyEditor
            body={body}
            contentType={contentType}
            setBody={setBody}
            setContentType={updateContentTypeHeader}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

