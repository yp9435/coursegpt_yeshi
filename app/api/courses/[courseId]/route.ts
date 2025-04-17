import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params

  try {
    const courseRef = doc(db, "courses", courseId)
    const courseSnap = await getDoc(courseRef)

    if (!courseSnap.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: courseSnap.id,
      ...courseSnap.data(),
    })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

/**
 * Handles the HTTP PUT request to update a course in the database.
 *
 * @param request - The incoming HTTP request object of type `NextRequest`.
 * @param context - An object containing route parameters, including `courseId`.
 * @param context.params - A promise resolving to an object with the `courseId` string.
 *
 * @returns A `NextResponse` object containing the result of the update operation.
 * 
 * @throws Will return a JSON response with an appropriate HTTP status code in the following cases:
 * - `404 Not Found`: If the course with the specified `courseId` does not exist.
 * - `403 Forbidden`: If the `userId` in the request body does not match the `userId` of the course.
 * - `500 Internal Server Error`: If an unexpected error occurs during the update process.
 *
 * The function performs the following steps:
 * 1. Extracts the `courseId` from the route parameters.
 * 2. Parses the request body as JSON.
 * 3. Checks if the course exists in the database.
 * 4. Verifies that the `userId` in the request body matches the `userId` of the course.
 * 5. Updates the course document in the database with the provided data and sets the `updatedAt` timestamp.
 * 6. Returns a success response with the `courseId` if the update is successful.
 */
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params
  const body = await request.json()

  try {
    const courseRef = doc(db, "courses", courseId)
    const courseSnap = await getDoc(courseRef)

    if (!courseSnap.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const courseData = courseSnap.data()
    if (body.userId && courseData.userId !== body.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await updateDoc(courseRef, {
      ...body,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      courseId,
    })
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}