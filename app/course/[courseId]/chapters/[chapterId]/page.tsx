"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CourseSidebar } from "@/components/course/CourseSidebar"
import { ChapterContent } from "@/components/course/ChapterContent"
import { YoutubeEmbed } from "@/components/course/YoutubeEmbed"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CourseData {
  id: string
  userId: string
  courseName: string
  description: string
  category: string
  topic: string
  level: string
  duration: string
  noOfChapters: number
  chapters: {
    chapterName: string
    about: string
    duration: string
    content?: {
      title: string
      explanation: string
      codeExample?: string
    }[]
    youtubeVideos?: string[]
  }[]
  status: string
  createdAt: Date
  updatedAt: Date
}

export default function ChapterPage({
  params,
}: {
  params: { courseId: string; chapterId: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [course, setCourse] = useState<CourseData | null>(null)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)

  const chapterIndex = Number.parseInt(params.chapterId)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, "courses", params.courseId)
        const courseSnap = await getDoc(courseRef)

        if (courseSnap.exists()) {
          const courseData = courseSnap.data() as CourseData
          if (courseData.status === "published" || (user && courseData.userId === user.uid)) {
            setCourse({ ...courseData, id: courseSnap.id })
          } else {
            toast({
              title: "Access denied",
              description: "This course is not published yet",
              variant: "destructive",
            })
            router.push("/explore")
          }
        } else {
          toast({
            title: "Course not found",
            description: "The requested course could not be found",
            variant: "destructive",
          })
          router.push("/explore")
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error loading course",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseId, router, toast, user])

  const handlePreviousChapter = () => {
    if (chapterIndex > 0) {
      router.push(`/course/${params.courseId}/chapters/${chapterIndex - 1}`)
    } else {
      router.push(`/course/${params.courseId}`)
    }
  }

  const handleNextChapter = () => {
    if (course && chapterIndex < course.chapters.length - 1) {
      router.push(`/course/${params.courseId}/chapters/${chapterIndex + 1}`)
    } else if (course) {
      router.push(`/course/${params.courseId}/complete`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black">
        <div className="nes-text is-primary">Loading chapter...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="nes-container is-rounded with-title bg-white text-black">
        <p className="title">Error</p>
        <p>Course not found. Please try exploring other courses.</p>
        <button
          onClick={() => router.push("/explore")}
          className="nes-btn is-primary mt-4"
        >
          Explore Courses
        </button>
      </div>
    )
  }

  if (isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= course.chapters.length) {
    return (
      <div className="nes-container is-rounded with-title bg-white text-black">
        <p className="title">Error</p>
        <p>Chapter not found. Please select a valid chapter.</p>
        <button
          onClick={() => router.push(`/course/${params.courseId}`)}
          className="nes-btn is-primary mt-4"
        >
          Back to Course
        </button>
      </div>
    )
  }

  const chapter = course.chapters[chapterIndex]

  return (
    <div className="flex min-h-screen flex-col bg-white text-black md:flex-row">
      <CourseSidebar course={course} activeChapter={chapterIndex} />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold">
              Chapter {chapterIndex + 1}: {chapter.chapterName}
            </h1>
            <p className="mb-4 text-gray-700">{chapter.about}</p>
            <div className="flex items-center">
              <span className="nes-badge">
                <span className="is-dark">{chapter.duration}</span>
              </span>
            </div>
          </div>

          {chapter.youtubeVideos && chapter.youtubeVideos.length > 0 && (
            <div className="mb-8">
              <div className="nes-container is-rounded with-title">
                <p className="title">Video Tutorial</p>
                <YoutubeEmbed videoId={chapter.youtubeVideos[activeVideoIndex]} />
                {chapter.youtubeVideos.length > 1 && (
                  <div className="mt-4">
                    <h3 className="mb-2 text-sm font-bold">More Videos</h3>
                    <div className="flex flex-wrap gap-2">
                      {chapter.youtubeVideos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveVideoIndex(index)}
                          className={`nes-btn is-small ${
                            activeVideoIndex === index ? "is-primary" : ""
                          }`}
                        >
                          Video {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {chapter.content && chapter.content.length > 0 ? (
            <ChapterContent content={chapter.content} />
          ) : (
            <div className="nes-container is-rounded with-title">
              <p className="title">Content</p>
              <p className="text-center py-8">No content available for this chapter.</p>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button onClick={handlePreviousChapter} className="nes-btn flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {chapterIndex === 0 ? "Back to Overview" : "Previous Chapter"}
            </button>

            <button
              onClick={handleNextChapter}
              className="nes-btn is-primary flex items-center"
            >
              {chapterIndex < course.chapters.length - 1 ? "Next Chapter" : "Complete Course"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
