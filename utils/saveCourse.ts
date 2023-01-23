export const saveCourse = async (courseId: string) => {
  const response = await fetch("/api/profile/saved-courses", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseId),
    redirect: "follow",
  })

  if (!response.ok) {
    throw new Error("Error while toggling saved course")
  }

  return response.json() as Promise<string[]>
}
