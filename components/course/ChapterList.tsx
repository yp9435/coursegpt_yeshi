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

/**
 * Component to render a list of chapters for a course.
 *
 * @param {ChapterListProps} props - The properties for the ChapterList component.
 * @param {Array} props.chapters - An array of chapter objects to display.
 * @param {string} props.courseId - The unique identifier for the course.
 *
 * Each chapter object in the `chapters` array should have the following structure:
 * - `chapterName` (string): The name of the chapter.
 * - `about` (string): A brief description of the chapter.
 * - `duration` (string): The duration of the chapter.
 *
 * @returns {JSX.Element} A styled list of chapters, each with its name, description, duration, 
 * and an "Edit Chapter" button linking to the edit page for the chapter.
 */

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
