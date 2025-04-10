import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { fetchYoutubeVideos } from "@/lib/youtube"

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
