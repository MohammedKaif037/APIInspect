import type { MockConfig, MockRule, MockServerLog, ResponseData } from "./types";

// This is an enhanced in-memory mock server implementation
export class MockServer {
  private activeMock: MockConfig | null = null;
  private logs: MockServerLog[] = [];
  private maxLogs: number = 100;

  setActiveMock(mock: MockConfig | null) {
    this.activeMock = mock;
  }

  getActiveMock() {
    return this.activeMock;
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  async handleRequest(
    url: string, 
    method: string, 
    headers: Record<string, string>, 
    body?: string
  ): Promise<ResponseData | null> {
    if (!this.activeMock) {
      return null;
    }

    const startTime = Date.now();
    
    // Check if the request matches the mock
    const urlObj = new URL(url);
    const mockPathRegex = this.pathToRegex(this.activeMock.path);
    
    if (method !== this.activeMock.method || !mockPathRegex.test(urlObj.pathname)) {
      return null;
    }

    // Check if any rules match
    if (this.activeMock.rules && this.activeMock.rules.length > 0) {
      for (const rule of this.activeMock.rules) {
        if (this.ruleMatches(rule, urlObj, headers, body)) {
          // If there's a delay, wait for it
          if (rule.response.delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, rule.response.delay));
          }

          const response = {
            status: rule.response.status,
            statusText: this.getStatusText(rule.response.status),
            headers: Object.fromEntries(rule.response.headers.map((h) => [h.key, h.value])),
            body: this.parseBody(rule.response.body),
            time: Date.now() - startTime,
            size: rule.response.body.length,
          };

          // Log the request and response
          this.logRequest(
            url, 
            method, 
            headers, 
            body, 
            response, 
            this.activeMock.id, 
            this.activeMock.name,
            rule.id,
            rule.name
          );

          return response;
        }
      }
    }

    // If no rules match or there are no rules, use the default response
    
    // If there's a delay, wait for it
    if (this.activeMock.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.activeMock.delay));
    }

    let responseBody = this.activeMock.body;
    
    // Handle dynamic response if enabled
    if (this.activeMock.dynamicResponse && this.activeMock.responseTemplate) {
      responseBody = this.generateDynamicResponse(
        this.activeMock.responseTemplate,
        urlObj,
        headers,
        body
      );
    }

    const response = {
      status: this.activeMock.statusCode,
      statusText: this.getStatusText(this.activeMock.statusCode),
      headers: Object.fromEntries(this.activeMock.headers.map((h) => [h.key, h.value])),
      body: this.parseBody(responseBody),
      time: Date.now() - startTime,
      size: responseBody.length,
    };

    // Log the request and response
    this.logRequest(
      url, 
      method, 
      headers, 
      body, 
      response, 
      this.activeMock.id, 
      this.activeMock.name
    );

    return response;
  }

  private pathToRegex(path: string): RegExp {
    // Convert path pattern to regex
    // Replace :param with named capture groups
    const regexPath = path
      .replace(/\/\*\*$/, '(?:/.*)?') // Handle /** wildcard at the end
      .replace(/\/\*$/, '(?:/[^/]*)?') // Handle /* wildcard at the end
      .replace(/:(\w+)/g, '(?<$1>[^/]+)') // Replace :param with named capture groups
      .replace(/\*/g, '.*'); // Replace other * with .*
    
    return new RegExp(`^${regexPath}$`);
  }

  private ruleMatches(
    rule: MockRule, 
    url: URL, 
    headers: Record<string, string>, 
    body?: string
  ): boolean {
    const { condition } = rule;
    
    switch (condition.type) {
      case "query":
        return this.matchCondition(
          url.searchParams.get(condition.key || '') || '',
          condition.value,
          condition.operator
        );
      
      case "header":
        return this.matchCondition(
          headers[condition.key?.toLowerCase() || ''] || '',
          condition.value,
          condition.operator
        );
      
      case "body":
        if (!body) return false;
        
        if (condition.key) {
          try {
            const bodyObj = JSON.parse(body);
            const value = this.getNestedProperty(bodyObj, condition.key);
            return this.matchCondition(
              value !== undefined ? String(value) : '',
              condition.value,
              condition.operator
            );
          } catch {
            return false;
          }
        } else {
          return this.matchCondition(body, condition.value, condition.operator);
        }
      
      case "path":
        return this.matchCondition(
          url.pathname,
          condition.value,
          condition.operator
        );
      
      default:
        return false;
    }
  }

  private matchCondition(
    actual: string, 
    expected: string, 
    operator: string
  ): boolean {
    switch (operator) {
      case "equals":
        return actual === expected;
      
      case "contains":
        return actual.includes(expected);
      
      case "startsWith":
        return actual.startsWith(expected);
      
      case "endsWith":
        return actual.endsWith(expected);
      
      case "regex":
        try {
          const regex = new RegExp(expected);
          return regex.test(actual);
        } catch {
          return false;
        }
      
      case "exists":
        return actual !== undefined && actual !== null && actual !== '';
      
      default:
        return false;
    }
  }

  private getNestedProperty(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      
      current = current[part];
    }
    
    return current;
  }

  private generateDynamicResponse(
    template: string,
    url: URL,
    headers: Record<string, string>,
    body?: string
  ): string {
    try {
      // Replace template variables with actual values
      let result = template;
      
      // Replace query parameters: {{query.paramName}}
      result = result.replace(/\{\{query\.(\w+)\}\}/g, (_, param) => {
        return url.searchParams.get(param) || '';
      });
      
      // Replace path parameters: {{path.paramName}}
      const pathParams = this.extractPathParams(url.pathname, this.activeMock?.path || '');
      result = result.replace(/\{\{path\.(\w+)\}\}/g, (_, param) => {
        return pathParams[param] || '';
      });
      
      // Replace headers: {{header.headerName}}
      result = result.replace(/\{\{header\.(\w+)\}\}/g, (_, header) => {
        return headers[header.toLowerCase()] || '';
      });
      
      // Replace body properties: {{body.propName}}
      if (body) {
        try {
          const bodyObj = JSON.parse(body);
          result = result.replace(/\{\{body\.([^}]+)\}\}/g, (_, path) => {
            const value = this.getNestedProperty(bodyObj, path);
            return value !== undefined ? JSON.stringify(value) : '';
          });
        } catch {
          // If body is not valid JSON, don't replace body variables
        }
      }
      
      // Replace random values: {{random.number(min,max)}}
      result = result.replace(/\{\{random\.number\((\d+),(\d+)\)\}\}/g, (_, min, max) => {
        return String(Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min));
      });
      
      // Replace random string: {{random.string(length)}}
      result = result.replace(/\{\{random\.string\((\d+)\)\}\}/g, (_, length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < Number(length); i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      });
      
      // Replace date: {{date.now}}
      result = result.replace(/\{\{date\.now\}\}/g, () => {
        return new Date().toISOString();
      });
      
      // Replace date with format: {{date.format(format)}}
      result = result.replace(/\{\{date\.format\(([^)]+)\)\}\}/g, (_, format) => {
        const date = new Date();
        return this.formatDate(date, format);
      });
      
      return result;
    } catch (error) {
      console.error('Error generating dynamic response:', error);
      return template;
    }
  }

  private extractPathParams(actualPath: string, templatePath: string): Record<string, string> {
    const params: Record<string, string> = {};
    
    const templateParts = templatePath.split('/');
    const actualParts = actualPath.split('/');
    
    for (let i = 0; i < templateParts.length; i++) {
      if (templateParts[i].startsWith(':')) {
        const paramName = templateParts[i].substring(1);
        params[paramName] = actualParts[i] || '';
      }
    }
    
    return params;
  }

  private formatDate(date: Date, format: string): string {
    // Simple date formatter
    const tokens: Record<string, () => string> = {
      'YYYY': () => String(date.getFullYear()),
      'MM': () => String(date.getMonth() + 1).padStart(2, '0'),
      'DD': () => String(date.getDate()).padStart(2, '0'),
      'HH': () => String(date.getHours()).padStart(2, '0'),
      'mm': () => String(date.getMinutes()).padStart(2, '0'),
      'ss': () => String(date.getSeconds()).padStart(2, '0'),
    };
    
    let result = format;
    for (const [token, fn] of Object.entries(tokens)) {
      result = result.replace(token, fn());
    }
    
    return result;
  }

  private parseBody(body: string) {
    try {
      return JSON.parse(body);
    } catch (e) {
      return body;
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
    };

    return statusTexts[status] || "Unknown";
  }

  private logRequest(
    url: string,
    method: string,
    headers: Record<string, string>,
    body: string | undefined,
    response: ResponseData,
    mockId: string,
    mockName: string,
    ruleId?: string,
    ruleName?: string
  ) {
    const log: MockServerLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      request: {
        method,
        url,
        headers,
        body,
      },
      response: {
        status: response.status,
        headers: response.headers,
        body: response.body,
      },
      mockId,
      mockName,
      ruleId,
      ruleName,
      latency: response.time,
    };

    this.logs.unshift(log);
    
    // Limit the number of logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }
}

export const mockServer = new MockServer();

