"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { Check, AlertTriangle } from "lucide-react"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

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
    content?: any[]
    youtubeVideos?: string[]
  }[]
  status: string
  createdAt: any
  updatedAt: any
}

export default function FinishCoursePage({
  params,
}: {
  params: { courseId: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [course, setCourse] = useState<CourseData | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) {
        router.push("/sign-in")
        return
      }

      try {
        const courseRef = doc(db, "courses", params.courseId)
        const courseSnap = await getDoc(courseRef)

        if (courseSnap.exists()) {
          const courseData = courseSnap.data() as CourseData

          if (courseData.userId !== user.uid) {
            toast({
              title: "Access denied",
              description: "You don't have permission to publish this course",
              variant: "destructive",
            })
            router.push("/dashboard")
            return
          }

          setCourse({ ...courseData, id: courseSnap.id })
        } else {
          toast({
            title: "Course not found",
            description: "The requested course could not be found",
            variant: "destructive",
          })
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

  const getCompletionStatus = () => {
    if (!course) return { complete: false, chaptersWithContent: 0, chaptersWithVideos: 0 }

    const chaptersWithContent = course.chapters.filter(
      (chapter) => chapter.content && chapter.content.length > 0,
    ).length

    const chaptersWithVideos = course.chapters.filter(
      (chapter) => chapter.youtubeVideos && chapter.youtubeVideos.length > 0,
    ).length

    const complete = chaptersWithContent === course.noOfChapters

    return {
      complete,
      chaptersWithContent,
      chaptersWithVideos,
    }
  }

  const handlePublishCourse = async () => {
    if (!course || !user) return

    try {
      setIsPublishing(true)

      const courseRef = doc(db, "courses", params.courseId)

      await updateDoc(courseRef, {
        status: "published",
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Course published successfully!",
        description: "Your course is now available to users.",
      })

      router.push(`/course/${params.courseId}`)
    } catch (error) {
      console.error("Error publishing course:", error)
      toast({
        title: "Error publishing course",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="nes-text is-primary">Loading course details...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="nes-container is-rounded with-title">
        <p className="title">Error</p>
        <p>Course not found. Please try again or create a new course.</p>
        <button
          onClick={() => router.push("/create-course")}
          className="nes-btn is-primary mt-4"
        >
          Create New Course
        </button>
      </div>
    )
  }

  const { complete, chaptersWithContent, chaptersWithVideos } = getCompletionStatus()

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="nes-container with-title is-rounded">
        <p className="title">Finish & Publish Course</p>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">{course.courseName}</h2>
          <p className="mb-2">{course.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="nes-container is-rounded">
              <p className="text-sm font-bold">Category</p>
              <p>{course.category}</p>
            </div>
            <div className="nes-container is-rounded">
              <p className="text-sm font-bold">Difficulty</p>
              <p>{course.level}</p>
            </div>
            <div className="nes-container is-rounded">
              <p className="text-sm font-bold">Duration</p>
              <p>{course.duration}</p>
            </div>
            <div className="nes-container is-rounded">
              <p className="text-sm font-bold">Chapters</p>
              <p>{course.noOfChapters}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-4 text-lg font-bold">Course Completion Status</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              {complete ? (
                <Check className="mr-2 h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              )}
              <span>
                {chaptersWithContent} of {course.noOfChapters} chapters have content
              </span>
            </div>

            <div className="flex items-center">
              {chaptersWithVideos === course.noOfChapters ? (
                <Check className="mr-2 h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              )}
              <span>
                {chaptersWithVideos} of {course.noOfChapters} chapters have YouTube videos
              </span>
            </div>

            <div className="nes-progress mt-4">
              <progress
                className="nes-progress is-success"
                value={chaptersWithContent}
                max={course.noOfChapters}
              ></progress>
            </div>
          </div>
        </div>

        {!complete && (
          <div className="mb-8 rounded-md bg-yellow-100 p-4">
            <p className="text-yellow-800">
              Some chapters are missing content. You can still publish your course, but it's recommended to complete all chapters first.
            </p>
            <button
              onClick={() => router.push(`/create-course/${params.courseId}/edit`)}
              className="nes-btn is-warning mt-4"
            >
              Go Back to Edit
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push(`/create-course/${params.courseId}`)}
            className="nes-btn"
          >
            Back to Preview
          </button>
          <button
            onClick={handlePublishCourse}
            disabled={isPublishing}
            className={`nes-btn is-success ${isPublishing ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isPublishing ? "Publishing..." : "Publish Course"}
          </button>
        </div>
      </div>
    </div>
  )
}
