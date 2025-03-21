"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Save, Trash2, Settings } from "lucide-react"
import type { Environment, EnvironmentVariable } from "@/lib/types"

interface EnvironmentManagerProps {
  activeEnvironment: string
  setActiveEnvironment: (env: string) => void
  environments: Environment[]
  setEnvironments: (environments: Environment[]) => void
}

export default function EnvironmentManager({
  activeEnvironment,
  setActiveEnvironment,
  environments,
  setEnvironments,
}: EnvironmentManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newEnvName, setNewEnvName] = useState("")
  const [currentTab, setCurrentTab] = useState(activeEnvironment || "globals")
  const [localEnvironments, setLocalEnvironments] = useState<Environment[]>(environments)

  useEffect(() => {
    setLocalEnvironments(environments)
    setCurrentTab(activeEnvironment || "globals")
  }, [environments, activeEnvironment, isOpen])

  const handleSaveEnvironments = () => {
    setEnvironments(localEnvironments)
    setIsOpen(false)
  }

  const addEnvironment = () => {
    if (!newEnvName.trim()) return

    const newEnv: Environment = {
      id: newEnvName.toLowerCase().replace(/\s+/g, "-"),
      name: newEnvName,
      variables: [],
    }

    setLocalEnvironments([...localEnvironments, newEnv])
    setCurrentTab(newEnv.id)
    setNewEnvName("")
  }

  const deleteEnvironment = (envId: string) => {
    setLocalEnvironments(localEnvironments.filter((env) => env.id !== envId))
    if (currentTab === envId) {
      setCurrentTab("globals")
    }
  }

  const addVariable = (envId: string) => {
    setLocalEnvironments(
      localEnvironments.map((env) => {
        if (env.id === envId) {
          return {
            ...env,
            variables: [...env.variables, { key: "", value: "", enabled: true }],
          }
        }
        return env
      }),
    )
  }

  const updateVariable = (envId: string, index: number, field: keyof EnvironmentVariable, value: string | boolean) => {
    setLocalEnvironments(
      localEnvironments.map((env) => {
        if (env.id === envId) {
          const updatedVariables = [...env.variables]
          updatedVariables[index] = { ...updatedVariables[index], [field]: value }
          return { ...env, variables: updatedVariables }
        }
        return env
      }),
    )
  }

  const removeVariable = (envId: string, index: number) => {
    setLocalEnvironments(
      localEnvironments.map((env) => {
        if (env.id === envId) {
          return {
            ...env,
            variables: env.variables.filter((_, i) => i !== index),
          }
        }
        return env
      }),
    )
  }

  // Find the global environment or create it if it doesn't exist
  const globalEnv = localEnvironments.find((env) => env.id === "globals") || {
    id: "globals",
    name: "Globals",
    variables: [],
  }

  // Other environments (excluding globals)
  const otherEnvs = localEnvironments.filter((env) => env.id !== "globals")

  return (
    <div>
      <div className="flex items-center gap-2">
        <Select value={activeEnvironment} onValueChange={setActiveEnvironment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="No Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">No Environment</SelectItem>
            {environments.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Manage Environments</DialogTitle>
            </DialogHeader>

            <div className="flex gap-4 mt-4">
              <div className="w-1/3 border-r pr-4">
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New environment name"
                      value={newEnvName}
                      onChange={(e) => setNewEnvName(e.target.value)}
                    />
                    <Button onClick={addEnvironment} disabled={!newEnvName.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Button
                    variant={currentTab === "globals" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("globals")}
                  >
                    Globals
                  </Button>

                  {otherEnvs.map((env) => (
                    <div key={env.id} className="flex items-center">
                      <Button
                        variant={currentTab === env.id ? "secondary" : "ghost"}
                        className="flex-1 justify-start"
                        onClick={() => setCurrentTab(env.id)}
                      >
                        {env.name}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteEnvironment(env.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-2/3">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="hidden">
                    <TabsTrigger value="globals">Globals</TabsTrigger>
                    {otherEnvs.map((env) => (
                      <TabsTrigger key={env.id} value={env.id}>
                        {env.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="globals">
                    <h3 className="text-lg font-medium mb-2">Global Variables</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      These variables are available in all environments
                    </p>

                    <div className="space-y-2">
                      {globalEnv.variables.map((variable, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder="Variable name"
                            value={variable.key}
                            onChange={(e) => updateVariable("globals", index, "key", e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={variable.value}
                            onChange={(e) => updateVariable("globals", index, "value", e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeVariable("globals", index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Button variant="outline" size="sm" onClick={() => addVariable("globals")} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add Variable
                      </Button>
                    </div>
                  </TabsContent>

                  {otherEnvs.map((env) => (
                    <TabsContent key={env.id} value={env.id}>
                      <h3 className="text-lg font-medium mb-2">{env.name} Variables</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        These variables are only available when this environment is active
                      </p>

                      <div className="space-y-2">
                        {env.variables.map((variable, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder="Variable name"
                              value={variable.key}
                              onChange={(e) => updateVariable(env.id, index, "key", e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Value"
                              value={variable.value}
                              onChange={(e) => updateVariable(env.id, index, "value", e.target.value)}
                              className="flex-1"
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeVariable(env.id, index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button variant="outline" size="sm" onClick={() => addVariable(env.id)} className="w-full">
                          <Plus className="h-4 w-4 mr-2" /> Add Variable
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveEnvironments}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

