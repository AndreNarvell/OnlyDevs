export const parseCategories = (filters: string): number[] => {
  try {
    const array = JSON.parse(filters ?? null)
    if (!Array.isArray(array)) return []

    const safeArray: number[] = []

    array.forEach((item: string) => {
      const int = parseInt(item)
      if (!Number.isNaN(int)) {
        safeArray.push(int)
      }
    })

    return safeArray
  } catch (error) {
    return []
  }
}

export const serialiseCategories = (filters: number[]): string => {
  return JSON.stringify(filters)
}

export const setCategory = (
  id: number,
  present: boolean,
  activeCategories: number[]
): number[] => {
  // Parse the query

  // Toggle the filter
  const index = activeCategories.indexOf(id)
  if (present && index === -1) {
    activeCategories.push(id)
  } else if (!present && index !== -1) {
    activeCategories.splice(index, 1)
  }

  return activeCategories
}
