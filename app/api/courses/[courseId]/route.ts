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