import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { fetchYoutubeVideos } from "@/lib/youtube"

/**
 * Handles the POST request to fetch YouTube videos for a specific course chapter
 * and update the course data with the fetched video IDs.
 *
 * @param {NextRequest} request - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} A JSON response containing the updated course data
 * or an error message with the appropriate HTTP status code.
 *
 * @throws {Error} Returns a 500 status code if an unexpected error occurs during processing.
 *
 * The request body should include the following fields:
 * - `userId` (string): The ID of the user making the request.
 * - `courseId` (string): The ID of the course to update.
 * - `chapterIndex` (number): The index of the chapter to update.
 * - `chapterName` (string): The name of the chapter.
 * - `courseTopic` (string): The topic of the course.
 * - `difficulty` (string, optional): The difficulty level of the chapter.
 *
 * The function performs the following steps:
 * 1. Validates the presence of required fields in the request body.
 * 2. Fetches the course document from the database using the provided `courseId`.
 * 3. Verifies that the course exists and that the `userId` matches the course owner.
 * 4. Constructs a search query using the `courseTopic`, `chapterName`, and optional `difficulty`.
 * 5. Fetches YouTube videos matching the search query.
 * 6. Updates the specified chapter in the course with the fetched YouTube video IDs.
 * 7. Saves the updated course data back to the database.
 * 8. Returns a JSON response containing the updated course data.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId, chapterIndex, chapterName, courseTopic, difficulty } = body

    if (!userId || !courseId || chapterIndex === undefined || !chapterName || !courseTopic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const courseRef = doc(db, "courses", courseId)
    const courseSnap = await getDoc(courseRef)

    if (!courseSnap.exists()) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const courseData = courseSnap.data()
    if (courseData.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const searchQuery = `${courseTopic} ${chapterName} ${difficulty || ""} tutorial`

    const videos = await fetchYoutubeVideos(searchQuery)

    interface YouTubeVideo {
      id: {
      videoId: string;
      };
    }

    const videoIds: string[] = (videos as YouTubeVideo[]).map((video) => video.id.videoId);

    const chapters = [...courseData.chapters]
    chapters[chapterIndex] = {
      ...chapters[chapterIndex],
      youtubeVideos: videoIds,
    }

    await updateDoc(courseRef, {
      chapters,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      courseId,
      chapterIndex,
      videoIds,
    })
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
