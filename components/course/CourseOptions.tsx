"use client"

import { ChangeEvent } from "react"

interface CourseOptionsProps {
  difficulty: string
  duration: string
  includeYoutube: boolean
  chapterCount: number
  onDifficultyChange: (difficulty: string) => void
  onDurationChange: (duration: string) => void
  onIncludeYoutubeChange: (includeYoutube: boolean) => void
  onChapterCountChange: (chapterCount: number) => void
}

/**
 * Component for configuring course options such as difficulty level, duration, 
 * number of chapters, and whether to include YouTube videos.
 *
 * @param {Object} props - The properties for the CourseOptions component.
 * @param {string} props.difficulty - The selected difficulty level of the course.
 * @param {string} props.duration - The selected duration of the course.
 * @param {boolean} props.includeYoutube - Whether to include YouTube videos in the course.
 * @param {number} props.chapterCount - The number of chapters in the course (1-20).
 * @param {(value: string) => void} props.onDifficultyChange - Callback for when the difficulty level changes.
 * @param {(value: string) => void} props.onDurationChange - Callback for when the course duration changes.
 * @param {(checked: boolean) => void} props.onIncludeYoutubeChange - Callback for when the YouTube inclusion option changes.
 * @param {(value: number) => void} props.onChapterCountChange - Callback for when the number of chapters changes.
 * 
 * @returns {JSX.Element} A form-like UI for selecting course options.
 */

export function CourseOptions({
  difficulty,
  duration,
  includeYoutube,
  chapterCount,
  onDifficultyChange,
  onDurationChange,
  onIncludeYoutubeChange,
  onChapterCountChange,
}: CourseOptionsProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Course Options</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="difficulty" className="mb-2 block text-sm font-medium">
              Difficulty Level
            </label>
            <div className="nes-select w-full">
              <select
                id="difficulty"
                className="w-full"
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value)}
              >
                <option value="">Select difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="duration" className="mb-2 block text-sm font-medium">
              Course Duration
            </label>
            <div className="nes-select w-full">
              <select
                id="duration"
                className="w-full"
                value={duration}
                onChange={(e) => onDurationChange(e.target.value)}
              >
                <option value="">Select duration</option>
                <option value="1 Hour">1 Hour</option>
                <option value="2 Hours">2 Hours</option>
                <option value="3+ Hours">3+ Hours</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="chapterCount" className="mb-2 block text-sm font-medium">
            Number of Chapters (1-20)
          </label>
          <input
            id="chapterCount"
            type="number"
            min={1}
            max={20}
            value={chapterCount}
            onChange={(e) => onChapterCountChange(Number.parseInt(e.target.value) || 1)}
            className="nes-input w-full"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label>
            <input
              type="checkbox"
              className="nes-checkbox"
              checked={includeYoutube}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onIncludeYoutubeChange(e.target.checked)
              }
            />
            <span className="ml-2">Include YouTube Videos</span>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          These options will help the AI generate content that matches your desired course structure.
        </p>
      </div>
    </div>
  )
}
