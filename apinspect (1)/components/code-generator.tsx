"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RequestData, AuthConfig } from "@/lib/types"
import { Code, Copy, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodeGeneratorProps {
  requestData: RequestData | null
  authConfig: AuthConfig
}

export default function CodeGenerator({ requestData, authConfig }: CodeGeneratorProps) {
  const [language, setLanguage] = useState("javascript")
  const [copied, setCopied] = useState(false)

  if (!requestData) {
    return null
  }

  const copyToClipboard = () => {
    const code = generateCode(language, requestData, authConfig)
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Code className="h-4 w-4 mr-2" /> Generate Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Code Snippet</DialogTitle>
        </DialogHeader>

        <Tabs value={language} onValueChange={setLanguage}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
            <TabsTrigger value="java">Java</TabsTrigger>
          </TabsList>

          <div className="mt-4 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>

            <ScrollArea className="h-[400px] w-full rounded-md border bg-muted p-4">
              <pre className="font-mono text-sm">{generateCode(language, requestData, authConfig)}</pre>
            </ScrollArea>
          </div>
        </Tabs>

        <DialogFooter>
          <Button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy to Clipboard"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function generateCode(language: string, requestData: RequestData, authConfig: AuthConfig): string {
  const { method, url, headers, body } = requestData;
  
  // Process headers
  const headerEntries = headers
    .filter(h => h.key && h.enabled)
    .map(h => [h.key, h.value]);
  
  // Add auth headers if needed
  if (authConfig.type === "basic") {
    const { username, password } = authConfig.basic;
    if (username && password) {
      const base64Credentials = btoa(`${username}:${password}`);
      headerEntries.push(["Authorization", `Basic ${base64Credentials}`]);
    }
  } else if (authConfig.type === "bearer") {
    const { token } = authConfig.bearer;
    if (token) {
      headerEntries.push(["Authorization", `Bearer ${token}`]);
    }
  } else if (authConfig.type === "apiKey" && authConfig.apiKey.addTo === "header") {
    const { key, value } = authConfig.apiKey;
    if (key && value) {
      headerEntries.push([key, value]);
    }
  } else if (authConfig.type === "oauth2") {
    const { accessToken, tokenType } = authConfig.oauth2;
    if (accessToken) {\
      headerEnt  {
    const { accessToken, tokenType } = authConfig.oauth2;
    if (accessToken) {
      headerEntries.push(["Authorization", `${tokenType || "Bearer"} ${accessToken}`]);
    }
  }

  // Process URL with API key in query params if needed
  let finalUrl = url;
  if (authConfig.type === "apiKey" && authConfig.apiKey.addTo === "query") {
    const { key, value } = authConfig.apiKey;
    if (key && value) {
      finalUrl += (url.includes("?") ? "&" : "?") + `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }

  switch (language) {
    case "javascript":
      return generateJavaScriptCode(method, finalUrl, headerEntries, body);
    case "python":
      return generatePythonCode(method, finalUrl, headerEntries, body);
    case "curl":
      return generateCurlCode(method, finalUrl, headerEntries, body);
    case "php":
      return generatePhpCode(method, finalUrl, headerEntries, body);
    case "java":
      return generateJavaCode(method, finalUrl, headerEntries, body);
    default:
      return "// Code generation not supported for this language";
  }
}

function generateJavaScriptCode(method: string, url: string, headers: [string, string][], body?: string): string {
  const headersObj = headers.length > 0 
    ? `const headers = {\n${headers.map(([key, value]) => `  "${key}": "${value}"`).join(",\n")}\n};`
    : "";

  const options = [`  method: "${method}"`];
  if (headers.length > 0) {
    options.push("  headers: headers");
  }
  
  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    options.push(`  body: ${JSON.stringify(body)}`);
  }

  return `// Using fetch API
${headersObj}

async function makeRequest() {
  try {
    const response = await fetch("${url}", {
${options.join(",\n")}
    });
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

makeRequest();`;
}

function generatePythonCode(method: string, url: string, headers: [string, string][], body?: string): string {
  const headersDict = headers.length > 0 
    ? `headers = {\n${headers.map(([key, value]) => `    "${key}": "${value}"`).join(",\n")}\n}`
    : "headers = {}";

  let bodyParam = "";
  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    bodyParam = `,\n    json=${body}`;
  }

  return `import requests

${headersDict}

try:
    response = requests.${method.toLowerCase()}(
        "${url}",
        headers=headers${bodyParam}
    )
    
    # Print the response
    print(response.status_code)
    print(response.json())
except Exception as e:
    print(f"Error: {e}")`;
}

function generateCurlCode(method: string, url: string, headers: [string, string][], body?: string): string {
  const headerParams = headers.map(([key, value]) => `-H "${key}: ${value}"`).join(" \\\n  ");
  
  let bodyParam = "";
  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    bodyParam = `-d '${body}' \\`;
  }

  return `curl -X ${method} "${url}" \\
  ${headerParams} \\
  ${bodyParam}
  --compressed`;
}

function generatePhpCode(method: string, url: string, headers: [string, string][], body?: string): string {
  const headersArray = headers.length > 0 
    ? `$headers = array(\n${headers.map(([key, value]) => `    "${key}: ${value}"`).join(",\n")}\n);`
    : "$headers = array();";

  let bodyParam = "";
  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    bodyParam = `$data = '${body}';\ncurl_setopt($curl, CURLOPT_POSTFIELDS, $data);`;
  }

  return `<?php

$curl = curl_init();

${headersArray}

${bodyParam}

curl_setopt_array($curl, array(
  CURLOPT_URL => "${url}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "${method}",
  CURLOPT_HTTPHEADER => $headers,
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`;
}

function generateJavaCode(method: string, url: string, headers: [string, string][], body?: string): string {
  const headersCode = headers.map(([key, value]) => `connection.setRequestProperty("${key}", "${value}");`).join("\n    ");
  
  let bodyCode = "";
  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    bodyCode = `
    // Write request body
    try (OutputStream os = connection.getOutputStream()) {
      byte[] input = "${body}".getBytes("utf-8");
      os.write(input, 0, input.length);
    }`;
  }

  return `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class ApiRequest {
  public static void main(String[] args) {
    try {
      URL url = new URL("${url}");
      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setRequestMethod("${method}");
      
      // Set headers
      ${headersCode}
      
      connection.setUseCaches(false);
      connection.setDoInput(true);
      ${["POST", "PUT", "PATCH"].includes(method) ? "connection.setDoOutput(true);" : ""}
      ${bodyCode}
      
      // Get response
      int responseCode = connection.getResponseCode();
      System.out.println("Response Code: " + responseCode);
      
      try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
        String inputLine;
        StringBuilder response = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
          response.append(inputLine);
        }
        System.out.println(response.toString());
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}`;
}

