import type { Environment, HeaderParam, QueryParam } from "./types"

export function processUrl(url: string, environments: Environment[], activeEnvironment: string): string {
  if (!url) return url

  // Find active environment and global environment
  const activeEnv = environments.find((env) => env.id === activeEnvironment)
  const globalEnv = environments.find((env) => env.id === "globals")

  // Combine variables from both environments
  const variables: Record<string, string> = {}

  // Add global variables first
  if (globalEnv) {
    globalEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Add active environment variables (will override globals if same key)
  if (activeEnv) {
    activeEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Replace variables in URL
  let processedUrl = url
  Object.entries(variables).forEach(([key, value]) => {
    processedUrl = processedUrl.replace(new RegExp(`{{${key}}}`, "g"), value)
  })

  return processedUrl
}

export function processHeaders(
  headers: HeaderParam[],
  environments: Environment[],
  activeEnvironment: string,
): HeaderParam[] {
  if (!headers || headers.length === 0) return headers

  // Find active environment and global environment
  const activeEnv = environments.find((env) => env.id === activeEnvironment)
  const globalEnv = environments.find((env) => env.id === "globals")

  // Combine variables from both environments
  const variables: Record<string, string> = {}

  // Add global variables first
  if (globalEnv) {
    globalEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Add active environment variables (will override globals if same key)
  if (activeEnv) {
    activeEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Replace variables in headers
  return headers.map((header) => {
    if (!header.enabled) return header

    let processedValue = header.value
    Object.entries(variables).forEach(([key, value]) => {
      processedValue = processedValue.replace(new RegExp(`{{${key}}}`, "g"), value)
    })

    return {
      ...header,
      value: processedValue,
    }
  })
}

export function processParams(
  params: QueryParam[],
  environments: Environment[],
  activeEnvironment: string,
): QueryParam[] {
  if (!params || params.length === 0) return params

  // Find active environment and global environment
  const activeEnv = environments.find((env) => env.id === activeEnvironment)
  const globalEnv = environments.find((env) => env.id === "globals")

  // Combine variables from both environments
  const variables: Record<string, string> = {}

  // Add global variables first
  if (globalEnv) {
    globalEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Add active environment variables (will override globals if same key)
  if (activeEnv) {
    activeEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Replace variables in params
  return params.map((param) => {
    if (!param.enabled) return param

    let processedValue = param.value
    Object.entries(variables).forEach(([key, value]) => {
      processedValue = processedValue.replace(new RegExp(`{{${key}}}`, "g"), value)
    })

    return {
      ...param,
      value: processedValue,
    }
  })
}

export function processBody(
  body: string | undefined,
  environments: Environment[],
  activeEnvironment: string,
): string | undefined {
  if (!body) return body

  // Find active environment and global environment
  const activeEnv = environments.find((env) => env.id === activeEnvironment)
  const globalEnv = environments.find((env) => env.id === "globals")

  // Combine variables from both environments
  const variables: Record<string, string> = {}

  // Add global variables first
  if (globalEnv) {
    globalEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Add active environment variables (will override globals if same key)
  if (activeEnv) {
    activeEnv.variables.forEach((variable) => {
      if (variable.enabled) {
        variables[variable.key] = variable.value
      }
    })
  }

  // Replace variables in body
  let processedBody = body
  Object.entries(variables).forEach(([key, value]) => {
    processedBody = processedBody.replace(new RegExp(`{{${key}}}`, "g"), value)
  })

  return processedBody
}

