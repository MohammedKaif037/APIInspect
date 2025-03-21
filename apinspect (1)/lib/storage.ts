import type { Collection, Environment, MockConfig, RequestHistory, Test } from "./types"

// Local storage keys
const COLLECTIONS_KEY = "apinspect-collections"
const ENVIRONMENTS_KEY = "apinspect-environments"
const HISTORY_KEY = "apinspect-history"
const MOCKS_KEY = "apinspect-mocks"
const TESTS_KEY = "apinspect-tests"
const ACTIVE_ENV_KEY = "apinspect-active-env"
const ACTIVE_MOCK_KEY = "apinspect-active-mock"

// Helper function to safely parse JSON from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  const stored = localStorage.getItem(key)
  if (!stored) return defaultValue

  try {
    return JSON.parse(stored) as T
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e)
    return defaultValue
  }
}

// Helper function to safely save JSON to localStorage
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e)
  }
}

// Collections
export function getCollections(): Collection[] {
  return getFromStorage<Collection[]>(COLLECTIONS_KEY, [])
}

export function saveCollections(collections: Collection[]): void {
  saveToStorage(COLLECTIONS_KEY, collections)
}

// Environments
export function getEnvironments(): Environment[] {
  return getFromStorage<Environment[]>(ENVIRONMENTS_KEY, [
    {
      id: "globals",
      name: "Globals",
      variables: [],
    },
  ])
}

export function saveEnvironments(environments: Environment[]): void {
  saveToStorage(ENVIRONMENTS_KEY, environments)
}

// Active Environment
export function getActiveEnvironment(): string {
  return getFromStorage<string>(ACTIVE_ENV_KEY, "")
}

export function saveActiveEnvironment(envId: string): void {
  saveToStorage(ACTIVE_ENV_KEY, envId)
}

// Request History
export function getHistory(): RequestHistory[] {
  return getFromStorage<RequestHistory[]>(HISTORY_KEY, [])
}

export function saveHistory(history: RequestHistory[]): void {
  saveToStorage(HISTORY_KEY, history)
}

export function addToHistory(item: RequestHistory): void {
  const history = getHistory()
  // Limit history to 50 items
  const updatedHistory = [item, ...history].slice(0, 50)
  saveHistory(updatedHistory)
}

// Mocks
export function getMocks(): MockConfig[] {
  return getFromStorage<MockConfig[]>(MOCKS_KEY, [])
}

export function saveMocks(mocks: MockConfig[]): void {
  saveToStorage(MOCKS_KEY, mocks)
}

// Active Mock
export function getActiveMock(): string | null {
  return getFromStorage<string | null>(ACTIVE_MOCK_KEY, null)
}

export function saveActiveMock(mockId: string | null): void {
  saveToStorage(ACTIVE_MOCK_KEY, mockId)
}

// Tests
export function getTests(): Test[] {
  return getFromStorage<Test[]>(TESTS_KEY, [])
}

export function saveTests(tests: Test[]): void {
  saveToStorage(TESTS_KEY, tests)
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(COLLECTIONS_KEY)
  localStorage.removeItem(ENVIRONMENTS_KEY)
  localStorage.removeItem(HISTORY_KEY)
  localStorage.removeItem(MOCKS_KEY)
  localStorage.removeItem(TESTS_KEY)
  localStorage.removeItem(ACTIVE_ENV_KEY)
  localStorage.removeItem(ACTIVE_MOCK_KEY)
}

