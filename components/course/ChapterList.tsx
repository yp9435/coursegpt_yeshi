"use client"

import Link from "next/link"
import { Clock } from "lucide-react"

interface Chapter {
  chapterName: string
  about: string
  duration: string
}

interface ChapterListProps {
  chapters: Chapter[]
  courseId: string
}

export function ChapterList({ chapters, courseId }: ChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => (
        <div key={index} className="nes-container is-rounded">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-black">
                {index + 1}. {chapter.chapterName}
              </h3>
              <p className="mt-1 text-sm text-gray-700">{chapter.about}</p>
            </div>

            <div className="mt-2 flex items-center md:mt-0">
              <Clock className="mr-2 h-4 w-4 text-black" />
              <span className="text-sm text-black">{chapter.duration}</span>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href={`/create-course/${courseId}/edit?chapter=${index}`}
              className="nes-btn is-primary text-xs"
            >
              Edit Chapter
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
