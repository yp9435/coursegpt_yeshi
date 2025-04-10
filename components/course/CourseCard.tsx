import Link from "next/link"
import { Clock, BookOpen, Award } from "lucide-react"

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
  status?: string
}

interface CourseCardProps {
  course: CourseData
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="nes-container bg-white is-rounded with-title">
      <p className="title">{course.category}</p>
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-bold mb-2">{course.courseName}</h3>
        <p className="text-sm text-gray-700 mb-4 flex-grow">
          {course.description.length > 100 ? `${course.description.substring(0, 100)}...` : course.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center text-center">
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs">{course.duration}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-4 w-4 mb-1" />
            <span className="text-xs">{course.noOfChapters} Ch</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Award className="h-4 w-4 mb-1" />
            <span className="text-xs">{course.level}</span>
          </div>
        </div>

        {course.status === "draft" && (
          <div className="mb-4">
            <span className="nes-badge">
              <span className="is-warning">Draft</span>
            </span>
          </div>
        )}

        <Link href={`/course/${course.id}`} className="nes-btn is-primary w-full text-center">
          View Course
        </Link>
      </div>
    </div>
  )
}
