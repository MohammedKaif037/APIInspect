"use client"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import type { AuthConfig } from "@/lib/types"
import { Lock } from "lucide-react"

interface AuthManagerProps {
  authConfig: AuthConfig
  setAuthConfig: (config: AuthConfig) => void
}

export default function AuthManager({ authConfig, setAuthConfig }: AuthManagerProps) {
  const updateAuthType = (type: string) => {
    setAuthConfig({ ...authConfig, type })
  }

  const updateBasicAuth = (field: "username" | "password", value: string) => {
    setAuthConfig({
      ...authConfig,
      basic: {
        ...authConfig.basic,
        [field]: value,
      },
    })
  }

  const updateBearerToken = (token: string) => {
    setAuthConfig({
      ...authConfig,
      bearer: {
        ...authConfig.bearer,
        token,
      },
    })
  }

  const updateApiKey = (field: "key" | "value" | "addTo", value: string) => {
    setAuthConfig({
      ...authConfig,
      apiKey: {
        ...authConfig.apiKey,
        [field]: value,
      },
    })
  }

  const updateOAuth2 = (field: "accessToken" | "tokenType", value: string) => {
    setAuthConfig({
      ...authConfig,
      oauth2: {
        ...authConfig.oauth2,
        [field]: value,
      },
    })
  }

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center mb-4">
        <Lock className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">Authentication</h3>
      </div>

      <Tabs value={authConfig.type} onValueChange={updateAuthType}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="none">None</TabsTrigger>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="bearer">Bearer</TabsTrigger>
          <TabsTrigger value="apiKey">API Key</TabsTrigger>
          <TabsTrigger value="oauth2">OAuth 2.0</TabsTrigger>
        </TabsList>

        <TabsContent value="none" className="p-2">
          <p className="text-sm text-muted-foreground">No authentication will be used for this request.</p>
        </TabsContent>

        <TabsContent value="basic" className="p-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="basic-username">Username</Label>
            <Input
              id="basic-username"
              value={authConfig.basic.username}
              onChange={(e) => updateBasicAuth("username", e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basic-password">Password</Label>
            <Input
              id="basic-password"
              type="password"
              value={authConfig.basic.password}
              onChange={(e) => updateBasicAuth("password", e.target.value)}
              placeholder="Password"
            />
          </div>
        </TabsContent>

        <TabsContent value="bearer" className="p-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bearer-token">Token</Label>
            <Input
              id="bearer-token"
              value={authConfig.bearer.token}
              onChange={(e) => updateBearerToken(e.target.value)}
              placeholder="Bearer token"
            />
          </div>
        </TabsContent>

        <TabsContent value="apiKey" className="p-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-name">Key</Label>
            <Input
              id="api-key-name"
              value={authConfig.apiKey.key}
              onChange={(e) => updateApiKey("key", e.target.value)}
              placeholder="API key name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key-value">Value</Label>
            <Input
              id="api-key-value"
              value={authConfig.apiKey.value}
              onChange={(e) => updateApiKey("value", e.target.value)}
              placeholder="API key value"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key-add-to">Add to</Label>
            <select
              id="api-key-add-to"
              className="w-full p-2 border rounded-md"
              value={authConfig.apiKey.addTo}
              onChange={(e) => updateApiKey("addTo", e.target.value)}
            >
              <option value="header">Header</option>
              <option value="query">Query Parameter</option>
            </select>
          </div>
        </TabsContent>

        <TabsContent value="oauth2" className="p-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oauth-token">Access Token</Label>
            <Input
              id="oauth-token"
              value={authConfig.oauth2.accessToken}
              onChange={(e) => updateOAuth2("accessToken", e.target.value)}
              placeholder="Access token"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oauth-token-type">Token Type</Label>
            <select
              id="oauth-token-type"
              className="w-full p-2 border rounded-md"
              value={authConfig.oauth2.tokenType}
              onChange={(e) => updateOAuth2("tokenType", e.target.value)}
            >
              <option value="Bearer">Bearer</option>
              <option value="MAC">MAC</option>
            </select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

