"use client"

import { useState, useEffect } from "react"
import RequestBuilder from "@/components/request-builder"
import ResponseViewer from "@/components/response-viewer"
import Sidebar from "@/components/sidebar"
import EnvironmentManager from "@/components/environment-manager"
import CollectionManager from "@/components/collection-manager"
import CodeGenerator from "@/components/code-generator"
import MockServer from "@/components/mock-server"
import TestInterface from "@/components/test-interface"
import type {
  RequestData,
  ResponseData,
  Environment,
  Collection,
  AuthConfig,
  MockConfig,
  Test,
  RequestHistory,
} from "@/lib/types"
import { processUrl, processHeaders, processBody } from "@/lib/environment-utils"
import { mockServer } from "@/lib/mock-server"
import * as storage from "@/lib/storage"
import HistoryViewer from "@/components/history-viewer"
import ThemeToggle from "@/components/theme-toggle"
// Fix the import path to match the file name exactly
import Documentation from "@/components/documentation"

// Define the SavedRequest type
interface SavedRequest extends RequestData {
  id: string
  name: string
}

export default function Home() {
  // State for request and response
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<RequestData | null>(null)

  // State for environments
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [activeEnvironment, setActiveEnvironment] = useState("")

  // State for collections
  const [collections, setCollections] = useState<Collection[]>([])

  // State for authentication
  const [authConfig, setAuthConfig] = useState<AuthConfig>({
    type: "none",
    basic: { username: "", password: "" },
    bearer: { token: "" },
    apiKey: { key: "", value: "", addTo: "header" },
    oauth2: { accessToken: "", tokenType: "Bearer" },
  })

  // State for mock server
  const [mocks, setMocks] = useState<MockConfig[]>([])
  const [activeMock, setActiveMock] = useState<string | null>(null)

  // State for tests
  const [tests, setTests] = useState<Test[]>([])

  // State for request history
  const [history, setHistory] = useState<RequestHistory[]>([])

  // Load data from local storage on component mount
  useEffect(() => {
    setEnvironments(storage.getEnvironments())
    setActiveEnvironment(storage.getActiveEnvironment())
    setCollections(storage.getCollections())
    setMocks(storage.getMocks())
    setActiveMock(storage.getActiveMock())
    setTests(storage.getTests())
    setHistory(storage.getHistory())
  }, [])

  // Save data to local storage when it changes
  useEffect(() => {
    storage.saveEnvironments(environments)
  }, [environments])

  useEffect(() => {
    storage.saveActiveEnvironment(activeEnvironment)
  }, [activeEnvironment])

  useEffect(() => {
    storage.saveCollections(collections)
  }, [collections])

  useEffect(() => {
    storage.saveMocks(mocks)
  }, [mocks])

  useEffect(() => {
    storage.saveActiveMock(activeMock)

    // Update the mock server with the active mock
    if (activeMock) {
      const mock = mocks.find((m) => m.id === activeMock) || null
      if (mock) {
        mockServer.setActiveMock(mock)
      } else {
        mockServer.setActiveMock(null)
      }
    } else {
      mockServer.setActiveMock(null)
    }
  }, [activeMock, mocks])

  useEffect(() => {
    storage.saveTests(tests)
  }, [tests])

  const handleSendRequest = async (requestData: RequestData) => {
    setIsLoading(true)
    setCurrentRequest(requestData)

    try {
      // Process environment variables
      const processedUrl = processUrl(requestData.url, environments, activeEnvironment)
      const processedHeaders = processHeaders(requestData.headers, environments, activeEnvironment)
      const processedBody = processBody(requestData.body, environments, activeEnvironment)

      // Check if we should use the mock server
      const mockResponse = await mockServer.handleRequest(
        processedUrl,
        requestData.method,
        Object.fromEntries(processedHeaders.filter((h) => h.key && h.enabled).map((h) => [h.key, h.value])),
        processedBody,
      )

      if (mockResponse) {
        setResponse(mockResponse)

        // Add to history
        const historyItem: RequestHistory = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          request: requestData,
          response: mockResponse,
        }
        storage.addToHistory(historyItem)
        setHistory(storage.getHistory())

        setIsLoading(false)
        return
      }

      // In a real app, we would use a more sophisticated approach to handle
      // different request methods, CORS issues, etc.
      const startTime = Date.now()

      // Prepare headers
      const headerEntries = processedHeaders.filter((h) => h.key && h.enabled).map((h) => [h.key, h.value])

      // Add authentication headers
      if (authConfig.type === "basic") {
        const { username, password } = authConfig.basic
        if (username && password) {
          const base64Credentials = btoa(`${username}:${password}`)
          headerEntries.push(["Authorization", `Basic ${base64Credentials}`])
        }
      } else if (authConfig.type === "bearer") {
        const { token } = authConfig.bearer
        if (token) {
          headerEntries.push(["Authorization", `Bearer ${token}`])
        }
      } else if (authConfig.type === "apiKey" && authConfig.apiKey.addTo === "header") {
        const { key, value } = authConfig.apiKey
        if (key && value) {
          headerEntries.push([key, value])
        }
      } else if (authConfig.type === "oauth2") {
        const { accessToken, tokenType } = authConfig.oauth2
        if (accessToken) {
          headerEntries.push(["Authorization", `${tokenType} ${accessToken}`])
        }
      }

      // Process URL with API key in query params if needed
      let finalUrl = processedUrl
      if (authConfig.type === "apiKey" && authConfig.apiKey.addTo === "query") {
        const { key, value } = authConfig.apiKey
        if (key && value) {
          finalUrl += (finalUrl.includes("?") ? "&" : "?") + `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        }
      }

      const requestOptions: RequestInit = {
        method: requestData.method,
        headers: Object.fromEntries(headerEntries),
      }

      // Handle different content types for the body
      if (["POST", "PUT", "PATCH"].includes(requestData.method) && processedBody) {
        const contentTypeHeader = headerEntries.find(([key]) => key.toLowerCase() === "content-type")
        const contentType = contentTypeHeader ? contentTypeHeader[1] : "application/json"

        if (contentType.includes("form-data")) {
          // For form-data, we need to create a FormData object
          // This is a simplified implementation - in a real app, you'd need to parse the body
          // and handle file uploads properly
          const formData = new FormData()
          try {
            // Try to parse as JSON first (our simplified format)
            const formItems = JSON.parse(processedBody)
            for (const item of formItems) {
              if (item.type === "file" && item.file) {
                formData.append(item.key, item.file)
              } else {
                formData.append(item.key, item.value)
              }
            }
          } catch (e) {
            // If parsing fails, just add as a single field
            formData.append("data", processedBody)
          }
          requestOptions.body = formData

          // Remove the Content-Type header as the browser will set it with the boundary
          requestOptions.headers = Object.fromEntries(
            headerEntries.filter(([key]) => key.toLowerCase() !== "content-type"),
          )
        } else {
          // For other content types, just use the body as is
          requestOptions.body = processedBody
        }
      }

      const response = await fetch(finalUrl, requestOptions)
      const responseTime = Date.now() - startTime

      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let responseBody
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        responseBody = await response.json()
      } else {
        responseBody = await response.text()
      }

      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: responseTime,
        size: JSON.stringify(responseBody).length,
      }

      setResponse(responseData)

      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        request: requestData,
        response: responseData,
      }
      storage.addToHistory(historyItem)
      setHistory(storage.getHistory())
    } catch (error) {
      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        body: error instanceof Error ? error.message : "Unknown error occurred",
        time: 0,
        size: 0,
        error: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadRequest = (savedRequest: SavedRequest | RequestHistory) => {
    // If it's a history item, we need to extract the request
    const request = "request" in savedRequest ? savedRequest.request : savedRequest

    // Set the current request
    setCurrentRequest(request)

    // Scroll to the request builder section
    const requestBuilderElement = document.querySelector(".request-builder-section")
    if (requestBuilderElement) {
      requestBuilderElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collections={collections} history={history} onLoadRequest={handleLoadRequest} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">APInspect</h1>
            <ThemeToggle />
            <Documentation />
          </div>
          <div className="flex flex-wrap gap-2">
            <EnvironmentManager
              activeEnvironment={activeEnvironment}
              setActiveEnvironment={setActiveEnvironment}
              environments={environments}
              setEnvironments={setEnvironments}
            />
            <CollectionManager
              collections={collections}
              setCollections={setCollections}
              currentRequest={currentRequest}
              onLoadRequest={handleLoadRequest}
            />
            <HistoryViewer
              history={history}
              onLoadRequest={handleLoadRequest}
              onClearHistory={() => {
                storage.saveHistory([])
                setHistory([])
              }}
            />
            <CodeGenerator requestData={currentRequest} authConfig={authConfig} />
            <MockServer mocks={mocks} setMocks={setMocks} activeMock={activeMock} setActiveMock={setActiveMock} />
            <TestInterface response={response} tests={tests} setTests={setTests} />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <RequestBuilder
            onSendRequest={handleSendRequest}
            isLoading={isLoading}
            authConfig={authConfig}
            setAuthConfig={setAuthConfig}
            currentRequest={currentRequest}
          />
          <ResponseViewer response={response} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}

