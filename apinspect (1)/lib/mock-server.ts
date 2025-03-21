import type { MockConfig } from "./types"

// This is a simple in-memory mock server implementation
export class MockServer {
  private activeMock: MockConfig | null = null

  setActiveMock(mock: MockConfig | null) {
    this.activeMock = mock
  }

  getActiveMock() {
    return this.activeMock
  }

  async handleRequest(url: string, method: string, headers: Record<string, string>, body?: string) {
    if (!this.activeMock) {
      return null
    }

    // Check if the request matches the mock
    const urlObj = new URL(url)
    const mockPathRegex = new RegExp(this.activeMock.path.replace(/\*/g, ".*"))

    if (method === this.activeMock.method && mockPathRegex.test(urlObj.pathname)) {
      // If there's a delay, wait for it
      if (this.activeMock.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.activeMock.delay))
      }

      // Return the mock response
      return {
        status: this.activeMock.statusCode,
        statusText: this.getStatusText(this.activeMock.statusCode),
        headers: Object.fromEntries(this.activeMock.headers.map((h) => [h.key, h.value])),
        body: this.parseBody(this.activeMock.body),
        time: this.activeMock.delay,
        size: this.activeMock.body.length,
      }
    }

    return null
  }

  private parseBody(body: string) {
    try {
      return JSON.parse(body)
    } catch (e) {
      return body
    }
  }

  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: "OK",
      201: "Created",
      204: "No Content",
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
    }

    return statusTexts[status] || "Unknown"
  }
}

export const mockServer = new MockServer()

