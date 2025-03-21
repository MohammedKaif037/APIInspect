/**
 * Utility functions for handling form data in requests
 */

interface FormDataItem {
  key: string
  value: string
  type: "text" | "file"
  enabled: boolean
  file?: File | null
}

/**
 * Creates a FormData object from an array of form data items
 */
export function createFormData(items: FormDataItem[]): FormData {
  const formData = new FormData()

  items
    .filter((item) => item.key && item.enabled)
    .forEach((item) => {
      if (item.type === "file" && item.file) {
        formData.append(item.key, item.file)
      } else {
        formData.append(item.key, item.value)
      }
    })

  return formData
}

/**
 * Creates a URL-encoded string from an array of form data items
 */
export function createUrlEncodedData(items: FormDataItem[]): string {
  return items
    .filter((item) => item.key && item.enabled)
    .map((item) => `${encodeURIComponent(item.key)}=${encodeURIComponent(item.value)}`)
    .join("&")
}

/**
 * Parses a URL-encoded string into an array of form data items
 */
export function parseUrlEncodedData(data: string): FormDataItem[] {
  if (!data) return [{ key: "", value: "", type: "text", enabled: true }]

  try {
    const params = new URLSearchParams(data)
    const items: FormDataItem[] = []

    params.forEach((value, key) => {
      items.push({
        key,
        value,
        type: "text",
        enabled: true,
      })
    })

    if (items.length === 0) {
      items.push({ key: "", value: "", type: "text", enabled: true })
    }

    return items
  } catch (e) {
    return [{ key: "", value: "", type: "text", enabled: true }]
  }
}

