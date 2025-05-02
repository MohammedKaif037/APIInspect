"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Code, Server, Database, Lock, FileJson, TestTube, History } from "lucide-react"

export default function Documentation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" /> Documentation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>APInspect Documentation</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="overview" className="p-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">APInspect: API Testing Tool</h2>
                <p className="text-lg">
                  APInspect is a comprehensive API testing tool designed to help developers test, debug, and document
                  their APIs. It provides a user-friendly interface for sending HTTP requests, viewing responses,
                  managing collections, and much more.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>HTTP request builder with support for all methods</li>
                    <li>Response viewer with JSON formatting</li>
                    <li>Environment variables management</li>
                    <li>Request collections and history</li>
                    <li>Authentication support (Basic, Bearer, API Key, OAuth)</li>
                    <li>Mock server for API simulation</li>
                    <li>Test scripts for response validation</li>
                    <li>Code snippet generation</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Technologies Used</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>React with Next.js framework</li>
                    <li>TypeScript for type safety</li>
                    <li>Tailwind CSS for styling</li>
                    <li>Shadcn UI components</li>
                    <li>Local storage for data persistence</li>
                    <li>Fetch API for HTTP requests</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
                <p>
                  To use APInspect, simply enter a URL in the request builder, select the HTTP method, and click "Send".
                  You can add headers, query parameters, and a request body as needed. The response will be displayed in
                  the response viewer below.
                </p>
                <p className="mt-2">
                  For more advanced features, explore the various tools in the toolbar, such as the environment manager,
                  collections, mock server, and test interface.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 p-4">
              <div>
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <p>
                  APInspect offers a wide range of features to help you test and debug your APIs. Here's a detailed
                  overview of each feature:
                </p>
              </div>

              <div className="space-y-8">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Request Builder</h3>
                  </div>
                  <p className="mb-2">
                    The request builder allows you to create and send HTTP requests with various methods, headers,
                    parameters, and body content.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Support for GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS methods</li>
                    <li>URL input with environment variable support</li>
                    <li>Query parameters editor</li>
                    <li>Headers editor</li>
                    <li>Body editor with support for JSON, XML, form data, and URL-encoded data</li>
                    <li>File upload support for multipart/form-data</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FileJson className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Response Viewer</h3>
                  </div>
                  <p className="mb-2">
                    The response viewer displays the response from the API, including status code, headers, and body
                    content.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Status code and status text display</li>
                    <li>Response time and size metrics</li>
                    <li>Headers viewer</li>
                    <li>Body viewer with JSON formatting</li>
                    <li>Loading state during request</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Database className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Environment Manager</h3>
                  </div>
                  <p className="mb-2">
                    The environment manager allows you to define and use variables in your requests, making it easy to
                    switch between different environments (e.g., development, staging, production).
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Global variables available in all environments</li>
                    <li>Environment-specific variables</li>
                    <li>Variable substitution in URLs, headers, parameters, and body content</li>
                    <li>Easy switching between environments</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <History className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Collections and History</h3>
                  </div>
                  <p className="mb-2">
                    Collections allow you to save and organize your requests, while history keeps track of your recent
                    requests.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Create and manage collections</li>
                    <li>Save requests to collections</li>
                    <li>View and load requests from history</li>
                    <li>Automatic history tracking</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Authentication</h3>
                  </div>
                  <p className="mb-2">APInspect supports various authentication methods for API requests.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Basic authentication with username and password</li>
                    <li>Bearer token authentication</li>
                    <li>API key authentication (in header or query parameter)</li>
                    <li>OAuth 2.0 authentication</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Server className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Mock Server</h3>
                  </div>
                  <p className="mb-2">
                    The mock server allows you to create mock API endpoints that return predefined responses, useful for
                    testing without a real backend.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Create and manage mock endpoints</li>
                    <li>Configure response status, headers, and body</li>
                    <li>Add conditional rules for different responses</li>
                    <li>Dynamic response generation with templates</li>
                    <li>Request logging and inspection</li>
                    <li>Path patterns with parameters and wildcards</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <TestTube className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Test Interface</h3>
                  </div>
                  <p className="mb-2">
                    The test interface allows you to write and run tests against API responses to validate their
                    correctness.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Create and manage test scripts</li>
                    <li>Write tests using a simple JavaScript-like syntax</li>
                    <li>Validate status codes, headers, and response body</li>
                    <li>Run tests against responses</li>
                    <li>View test results with pass/fail status</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 mr-2" />
                    <h3 className="text-xl font-semibold">Code Generator</h3>
                  </div>
                  <p className="mb-2">
                    The code generator creates code snippets for your requests in various programming languages.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Generate code for JavaScript, Python, cURL, PHP, and Java</li>
                    <li>Includes headers, authentication, and body content</li>
                    <li>Copy code to clipboard</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-6 p-4">
              <div>
                <h2 className="text-2xl font-bold mb-4">Components</h2>
                <p>
                  APInspect is built with a modular architecture, with each feature implemented as a separate component.
                  Here's an overview of the main components:
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">RequestBuilder</h3>
                  <p className="mb-2">
                    The RequestBuilder component allows users to create and configure HTTP requests.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/request-builder.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> onSendRequest, isLoading, authConfig, setAuthConfig
                    </li>
                    <li>
                      <strong>State:</strong> method, url, headers, params, body, contentType
                    </li>
                    <li>
                      <strong>Sub-components:</strong> HeadersEditor, ParamsEditor, BodyEditor, AuthManager
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">ResponseViewer</h3>
                  <p className="mb-2">The ResponseViewer component displays the response from an API request.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/response-viewer.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> response, isLoading
                    </li>
                    <li>
                      <strong>Features:</strong> Status display, headers viewer, body viewer with formatting
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">EnvironmentManager</h3>
                  <p className="mb-2">The EnvironmentManager component manages environment variables for requests.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/environment-manager.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> activeEnvironment, setActiveEnvironment, environments, setEnvironments
                    </li>
                    <li>
                      <strong>Features:</strong> Environment selection, variable management, global variables
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">CollectionManager</h3>
                  <p className="mb-2">The CollectionManager component manages collections of saved requests.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/collection-manager.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> collections, setCollections, currentRequest, onLoadRequest
                    </li>
                    <li>
                      <strong>Features:</strong> Collection creation, request saving, request loading
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">AuthManager</h3>
                  <p className="mb-2">The AuthManager component handles authentication configuration for requests.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/auth-manager.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> authConfig, setAuthConfig
                    </li>
                    <li>
                      <strong>Features:</strong> Basic auth, Bearer token, API key, OAuth 2.0
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">MockServer</h3>
                  <p className="mb-2">The MockServer component creates and manages mock API endpoints.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/mock-server.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> mocks, setMocks, activeMock, setActiveMock
                    </li>
                    <li>
                      <strong>Features:</strong> Mock creation, rule management, dynamic responses, logs
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">TestInterface</h3>
                  <p className="mb-2">
                    The TestInterface component allows users to create and run tests against API responses.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/test-interface.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> response, tests, setTests
                    </li>
                    <li>
                      <strong>Features:</strong> Test creation, test execution, result display
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">CodeGenerator</h3>
                  <p className="mb-2">The CodeGenerator component generates code snippets for requests.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/code-generator.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> requestData, authConfig
                    </li>
                    <li>
                      <strong>Features:</strong> Code generation for multiple languages, syntax highlighting
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">BodyEditor</h3>
                  <p className="mb-2">The BodyEditor component allows users to edit request body content.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/body-editor.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> body, contentType, setBody, setContentType
                    </li>
                    <li>
                      <strong>Features:</strong> JSON, XML, form data, URL-encoded data, file uploads
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">HistoryViewer</h3>
                  <p className="mb-2">The HistoryViewer component displays and manages request history.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>File:</strong> components/history-viewer.tsx
                    </li>
                    <li>
                      <strong>Props:</strong> history, onLoadRequest, onClearHistory
                    </li>
                    <li>
                      <strong>Features:</strong> History display, request loading, history clearing
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6 p-4">
              <div>
                <h2 className="text-2xl font-bold mb-4">Architecture</h2>
                <p>
                  APInspect follows a modular architecture with clear separation of concerns. Here's an overview of the
                  project structure and how the components interact:
                </p>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Project Structure</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                    {`apinspect/
├── app/
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout with theme provider
│   └── globals.css        # Global styles
├── components/
│   ├── request-builder.tsx
│   ├── response-viewer.tsx
│   ├── environment-manager.tsx
│   ├── collection-manager.tsx
│   ├── auth-manager.tsx
│   ├── mock-server.tsx
│   ├── test-interface.tsx
│   ├── code-generator.tsx
│   ├── body-editor.tsx
│   ├── headers-editor.tsx
│   ├── params-editor.tsx
│   ├── history-viewer.tsx
│   ├── sidebar.tsx
│   ├── theme-toggle.tsx
│   └── documentation.tsx
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── mock-server.ts     # Mock server implementation
│   ├── environment-utils.ts # Environment variable utilities
│   ├── form-data-utils.ts # Form data handling utilities
│   └── storage.ts         # Local storage utilities
└── components/ui/         # UI components from shadcn/ui`}
                  </pre>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Data Flow</h3>
                  <p className="mb-2">APInspect uses a unidirectional data flow pattern:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      <strong>State Management:</strong> The main state is managed in the root component (page.tsx) and
                      passed down to child components via props.
                    </li>
                    <li>
                      <strong>User Interactions:</strong> User interactions trigger callbacks that update the state in
                      the parent component.
                    </li>
                    <li>
                      <strong>Data Persistence:</strong> State changes are persisted to local storage using the storage
                      utilities.
                    </li>
                    <li>
                      <strong>API Requests:</strong> Requests are sent using the Fetch API, with request data processed
                      by utility functions.
                    </li>
                    <li>
                      <strong>Mock Server:</strong> The mock server intercepts requests and returns mock responses based
                      on configuration.
                    </li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Key Interfaces</h3>
                  <p className="mb-2">The main data structures used throughout the application:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>RequestData:</strong> Represents an HTTP request with method, URL, headers, and body.
                    </li>
                    <li>
                      <strong>ResponseData:</strong> Represents an HTTP response with status, headers, and body.
                    </li>
                    <li>
                      <strong>Environment:</strong> Represents an environment with variables.
                    </li>
                    <li>
                      <strong>Collection:</strong> Represents a collection of saved requests.
                    </li>
                    <li>
                      <strong>AuthConfig:</strong> Represents authentication configuration.
                    </li>
                    <li>
                      <strong>MockConfig:</strong> Represents a mock server configuration.
                    </li>
                    <li>
                      <strong>Test:</strong> Represents a test script for validating responses.
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Local Storage</h3>
                  <p className="mb-2">APInspect uses local storage to persist data between sessions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>apinspect-collections:</strong> Saved request collections
                    </li>
                    <li>
                      <strong>apinspect-environments:</strong> Environment configurations
                    </li>
                    <li>
                      <strong>apinspect-history:</strong> Request history
                    </li>
                    <li>
                      <strong>apinspect-mocks:</strong> Mock server configurations
                    </li>
                    <li>
                      <strong>apinspect-tests:</strong> Test scripts
                    </li>
                    <li>
                      <strong>apinspect-active-env:</strong> Active environment ID
                    </li>
                    <li>
                      <strong>apinspect-active-mock:</strong> Active mock ID
                    </li>
                    <li>
                      <strong>apinspect-theme:</strong> UI theme preference
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Future Enhancements</h3>
                  <p className="mb-2">Potential areas for future development:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>WebSocket support for real-time API testing</li>
                    <li>Import/export functionality for collections and environments</li>
                    <li>GraphQL support with query builder</li>
                    <li>Response visualization tools (charts, tables)</li>
                    <li>Certificate manager for HTTPS requests</li>
                    <li>Team collaboration features</li>
                    <li>Request comparison tool</li>
                    <li>Performance testing capabilities</li>
                    <li>API documentation generation</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

