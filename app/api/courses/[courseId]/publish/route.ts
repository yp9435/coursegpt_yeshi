import { type NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest, context: { params: { courseId: string } }) {
  const { params } = context; // Unwrap the params object
  const courseId = params.courseId;

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

export async function GET(request: NextRequest, context: { params: { courseId: string } }) {
  const { params } = context; // Unwrap the params object
  const courseId = params.courseId;

  return NextResponse.json({
    message: `GET request received for courseId: ${courseId}`,
  });
}
