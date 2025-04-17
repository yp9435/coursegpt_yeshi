import { type NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Handles the publishing of a course by updating its status in the database.
 *
 * @param request - The incoming HTTP request object.
 * @param params - An object containing route parameters, including the `courseId`.
 * @returns A JSON response indicating the success or failure of the operation.
 *
 * @throws Will return a JSON response with an appropriate status code and error message
 *         in the following cases:
 *         - If the `userId` is not provided in the request body (400 Bad Request).
 *         - If the course with the given `courseId` does not exist (404 Not Found).
 *         - If the `userId` does not match the owner of the course (403 Forbidden).
 *         - If an unexpected error occurs during the operation (500 Internal Server Error).
 *
 * The function performs the following steps:
 * 1. Extracts the `courseId` from the route parameters.
 * 2. Parses the request body to retrieve the `userId`.
 * 3. Validates the existence of the course in the database.
 * 4. Verifies that the `userId` matches the owner of the course.
 * 5. Updates the course's status to "published" and sets the `publishedAt` and `updatedAt` timestamps.
 * 6. Returns a success response with the `courseId` if the operation is successful.
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    const courseData = courseSnap.data();
    if (courseData.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    await updateDoc(courseRef, {
      status: "published",
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return NextResponse.json({
      success: true,
      message: "Course published successfully",
      courseId,
    });
  } catch (error) {
    console.error("Error publishing course:", error);
    return NextResponse.json({ error: "Failed to publish course" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  
  return NextResponse.json({
    message: `GET request received for courseId: ${courseId}`,
  });
}