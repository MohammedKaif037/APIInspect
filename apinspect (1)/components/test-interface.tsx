"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Play, Check, X, FileCode } from "lucide-react"
import type { Test, TestResult, ResponseData } from "@/lib/types"

interface TestInterfaceProps {
  response: ResponseData | null
  tests: Test[]
  setTests: (tests: Test[]) => void
}

export default function TestInterface({ response, tests, setTests }: TestInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [editingTest, setEditingTest] = useState<Test | null>(null)

  const addTest = () => {
    const newTest: Test = {
      id: Date.now().toString(),
      name: `Test ${tests.length + 1}`,
      script: `// Test if status code is 200\npm.test("Status code is 200", function() {\n  pm.expect(response.status).to.equal(200);\n});\n\n// Test if response has the correct structure\npm.test("Response has data property", function() {\n  pm.expect(response.body).to.have.property("data");\n});`,
    }

    setTests([...tests, newTest])
    setEditingTest(newTest)
  }

  const updateTest = (field: keyof Test, value: string) => {
    if (!editingTest) return

    const updatedTest = { ...editingTest, [field]: value }
    setEditingTest(updatedTest)

    setTests(tests.map((test) => (test.id === editingTest.id ? updatedTest : test)))
  }

  const deleteTest = (testId: string) => {
    setTests(tests.filter((test) => test.id !== testId))
    if (editingTest?.id === testId) {
      setEditingTest(null)
    }
  }

  const runTests = () => {
    if (!response) return

    const results: TestResult[] = []

    tests.forEach((test) => {
      try {
        // Create a sandbox environment for test execution
        const testEnv = {
          pm: {
            test: (name: string, fn: () => void) => {
              try {
                fn()
                results.push({
                  testId: test.id,
                  name,
                  passed: true,
                  error: null,
                })
              } catch (error) {
                results.push({
                  testId: test.id,
                  name,
                  passed: false,
                  error: error instanceof Error ? error.message : String(error),
                })
              }
            },
            expect: (actual: any) => ({
              to: {
                equal: (expected: any) => {
                  if (actual !== expected) {
                    throw new Error(`Expected ${expected} but got ${actual}`)
                  }
                },
                have: {
                  property: (prop: string) => {
                    if (!actual || typeof actual !== "object" || !(prop in actual)) {
                      throw new Error(`Expected object to have property "${prop}"`)
                    }
                  },
                },
                be: {
                  an: {
                    array: () => {
                      if (!Array.isArray(actual)) {
                        throw new Error(`Expected an array but got ${typeof actual}`)
                      }
                    },
                  },
                  a: {
                    string: () => {
                      if (typeof actual !== "string") {
                        throw new Error(`Expected a string but got ${typeof actual}`)
                      }
                    },
                    number: () => {
                      if (typeof actual !== "number") {
                        throw new Error(`Expected a number but got ${typeof actual}`)
                      }
                    },
                  },
                },
              },
            }),
          },
          response: {
            status: response.status,
            body: response.body,
            headers: response.headers,
          },
        }

        // Execute the test script in the sandbox
        const scriptFn = new Function("pm", "response", test.script)
        scriptFn(testEnv.pm, testEnv.response)
      } catch (error) {
        results.push({
          testId: test.id,
          name: "Script Error",
          passed: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    })

    setTestResults(results)
  }

  const getTestStatus = (testId: string) => {
    const testResultsForId = testResults.filter((result) => result.testId === testId)
    if (testResultsForId.length === 0) return "not-run"

    return testResultsForId.every((result) => result.passed) ? "passed" : "failed"
  }

  const getTestResultsForTest = (testId: string) => {
    return testResults.filter((result) => result.testId === testId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileCode className="h-4 w-4 mr-2" /> Tests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Interface</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mt-4 overflow-hidden flex-1">
          <div className="w-1/3 border-r pr-4 overflow-y-auto">
            <Button variant="outline" className="w-full mb-4" onClick={addTest}>
              <Plus className="h-4 w-4 mr-2" /> Add Test
            </Button>

            <div className="space-y-2">
              {tests.map((test) => {
                const status = getTestStatus(test.id)
                let statusColor = ""
                let StatusIcon = null

                if (status === "passed") {
                  statusColor = "text-green-500"
                  StatusIcon = Check
                } else if (status === "failed") {
                  statusColor = "text-red-500"
                  StatusIcon = X
                }

                return (
                  <div key={test.id} className="flex items-center">
                    {StatusIcon && (
                      <span className={`mr-2 ${statusColor}`}>
                        <StatusIcon className="h-4 w-4" />
                      </span>
                    )}
                    <Button
                      variant={editingTest?.id === test.id ? "secondary" : "ghost"}
                      className="flex-1 justify-start"
                      onClick={() => setEditingTest(test)}
                    >
                      {test.name}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTest(test.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}

              {tests.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No tests yet. Create one to start testing your API responses.
                </p>
              )}
            </div>
          </div>

          <div className="w-2/3 overflow-y-auto">
            {editingTest ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input id="test-name" value={editingTest.name} onChange={(e) => updateTest("name", e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="test-script">Test Script</Label>
                  <Textarea
                    id="test-script"
                    value={editingTest.script}
                    onChange={(e) => updateTest("script", e.target.value)}
                    className="font-mono min-h-[300px] mt-2"
                  />
                </div>

                {getTestResultsForTest(editingTest.id).length > 0 && (
                  <div>
                    <Label>Test Results</Label>
                    <div className="space-y-2 mt-2">
                      {getTestResultsForTest(editingTest.id).map((result, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md ${result.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                        >
                          <div className="flex items-center">
                            {result.passed ? (
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className={result.passed ? "text-green-700" : "text-red-700"}>{result.name}</span>
                          </div>
                          {!result.passed && result.error && (
                            <p className="text-sm text-red-600 mt-1 ml-6">{result.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a test to edit or create a new one</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={runTests} disabled={!response || tests.length === 0}>
            <Play className="h-4 w-4 mr-2" /> Run Tests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

