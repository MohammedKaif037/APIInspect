export interface HeaderParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestData {
  method: string;
  url: string;
  headers: HeaderParam[];
  body?: string;
  contentType?: string;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  time: number;
  size: number;
  error?: boolean;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  enabled: boolean;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvironmentVariable[];
}

export interface SavedRequest {
  id: string;
  name: string;
  request: RequestData;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  requests: SavedRequest[];
}

export interface AuthConfig {
  type: string;
  basic: {
    username: string;
    password: string;
  };
  bearer: {
    token: string;
  };
  apiKey: {
    key: string;
    value: string;
    addTo: string;
  };
  oauth2: {
    accessToken: string;
    tokenType: string;
  };
}

// Enhanced mock server types
export interface MockHeader {
  key: string;
  value: string;
}

export interface MockRule {
  id: string;
  name: string;
  condition: {
    type: "query" | "header" | "body" | "path";
    key?: string;
    value: string;
    operator: "equals" | "contains" | "startsWith" | "endsWith" | "regex" | "exists";
  };
  response: {
    status: number;
    headers: MockHeader[];
    body: string;
    delay: number;
  };
}

export interface MockConfig {
  id: string;
  name: string;
  path: string;
  method: string;
  statusCode: number;
  delay: number;
  headers: MockHeader[];
  body: string;
  rules?: MockRule[];
  dynamicResponse?: boolean;
  responseTemplate?: string;
}

export interface Test {
  id: string;
  name: string;
  script: string;
}

export interface TestResult {
  testId: string;
  name: string;
  passed: boolean;
  error: string | null;
}

export interface RequestHistory {
  id: string;
  timestamp: string;
  request: RequestData;
  response: ResponseData | null;
}

export interface MockServerLog {
  id: string;
  timestamp: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: any;
  };
  mockId: string;
  mockName: string;
  ruleId?: string;
  ruleName?: string;
  latency: number;
}

