"use client"

import { useState } from "react"
import { YoutubeEmbed } from "@/components/course/YoutubeEmbed"
import Image from "next/image"

interface Chapter {
  chapterName: string
  about: string
  duration: string
  content?: {
    title: string
    explanation: string
    codeExample?: string
  }[]
  youtubeVideos?: string[]
}

interface EditorProps {
  chapter: Chapter
  onUpdateChapter: (chapter: Chapter) => void
  onGenerateContent: () => void
  onFetchYoutubeVideos: () => void
}

/**
 * The `Editor` component provides an interface for editing a chapter's details, content, and associated YouTube videos.
 * It allows users to switch between three tabs: "details", "content", and "videos", each offering specific functionality.
 *
 * @param {EditorProps} props - The props for the `Editor` component.
 * @param {Chapter} props.chapter - The current chapter data being edited.
 * @param {(updatedChapter: Chapter) => void} props.onUpdateChapter - Callback function to update the chapter data.
 * @param {() => void} props.onGenerateContent - Callback function to generate content for the chapter using AI.
 * @param {() => void} props.onFetchYoutubeVideos - Callback function to fetch YouTube videos related to the chapter.
 *
 * @returns {JSX.Element} The rendered `Editor` component.
 *
 * ## Tabs:
 * - **Details**: Allows editing the chapter's name, description, and duration.
 * - **Content**: Displays and manages sections of the chapter, including title, explanation, and optional code examples.
 * - **Videos**: Displays and manages YouTube videos associated with the chapter, including selecting and fetching videos.
 *
 * ## Features:
 * - **Details Tab**:
 *   - Edit chapter name, description, and duration.
 * - **Content Tab**:
 *   - Add, edit, or remove sections of the chapter.
 *   - Regenerate content using AI.
 * - **Videos Tab**:
 *   - View and select a YouTube video.
 *   - Fetch additional YouTube videos.
 *
 * ## State:
 * - `activeTab` (`string`): Tracks the currently active tab ("details", "content", or "videos").
 * - `selectedVideoIndex` (`number`): Tracks the index of the currently selected YouTube video.
 *
 * ## Methods:
 * - `handleChange(field, value)`: Updates a specific field of the chapter.
 * - `handleContentChange(index, field, value)`: Updates a specific field of a content section.
 * - `addSection()`: Adds a new section to the chapter content.
 * - `removeSection(index)`: Removes a section from the chapter content.
 */


export function Editor({ chapter, onUpdateChapter, onGenerateContent, onFetchYoutubeVideos }: EditorProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)

  const handleChange = (field: keyof Chapter, value: string | string[] | undefined) => {
    onUpdateChapter({ ...chapter, [field]: value })
  }

  const handleContentChange = (index: number, field: string, value: string) => {
    if (!chapter.content) return
    const updated = [...chapter.content]
    updated[index] = { ...updated[index], [field]: value }
    onUpdateChapter({ ...chapter, content: updated })
  }

  const addSection = () => {
    const updated = chapter.content ? [...chapter.content] : []
    updated.push({ title: "New Section", explanation: "", codeExample: "" })
    onUpdateChapter({ ...chapter, content: updated })
  }

  const removeSection = (index: number) => {
    if (!chapter.content) return
    const updated = [...chapter.content]
    updated.splice(index, 1)
    onUpdateChapter({ ...chapter, content: updated })
  }

  return (
    <div className="text-black">
      <div className="flex space-x-4 mb-6">
        {["details", "content", "videos"].map(tab => (
          <button
            key={tab}
            className={`nes-btn ${activeTab === tab ? "is-primary" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "details" ? "Chapter Details" : tab === "content" ? "Content" : "YouTube Videos"}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Chapter Name</label>
            <input
              type="text"
              value={chapter.chapterName}
              onChange={(e) => handleChange("chapterName", e.target.value)}
              className="nes-input w-full"
            />
          </div>

          <div>
            <label className="block mb-1">About</label>
            <textarea
              value={chapter.about}
              onChange={(e) => handleChange("about", e.target.value)}
              className="nes-textarea w-full h-32"
            />
          </div>

          <div>
            <label className="block mb-1">Duration</label>
            <input
              type="text"
              value={chapter.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              placeholder="e.g. 15 minutes"
              className="nes-input w-full"
            />
          </div>
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-6">
          {(!chapter.content || chapter.content.length === 0) ? (
            <div className="nes-container is-rounded flex flex-col items-center text-center space-y-4">
              <p>No content yet. Generate or add manually.</p>
              <button className="nes-btn is-primary" onClick={onGenerateContent}>
                Generate Content with AI
              </button>
            </div>
          ) : (
            <>
              {chapter.content.map((section, index) => (
                <div key={index} className="nes-container is-rounded">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Section {index + 1}</h3>
                    <button className="nes-btn is-error text-xs" onClick={() => removeSection(index)}>
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Section Title</label>
                      <input
                        value={section.title}
                        onChange={(e) => handleContentChange(index, "title", e.target.value)}
                        className="nes-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Explanation</label>
                      <textarea
                        value={section.explanation}
                        onChange={(e) => handleContentChange(index, "explanation", e.target.value)}
                        className="nes-textarea w-full h-32"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Code Example (Optional)</label>
                      <textarea
                        value={section.codeExample || ""}
                        onChange={(e) => handleContentChange(index, "codeExample", e.target.value)}
                        className="nes-textarea w-full h-32 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <button className="nes-btn" onClick={addSection}>
                  Add Section
                </button>
                <button className="nes-btn is-primary" onClick={onGenerateContent}>
                  Regenerate Content
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "videos" && (
        <div className="space-y-6">
          {(!chapter.youtubeVideos || chapter.youtubeVideos.length === 0) ? (
            <div className="nes-container is-rounded flex flex-col items-center text-center space-y-4">
              <p>No YouTube videos yet. Fetch or add manually.</p>
              <button className="nes-btn is-primary" onClick={onFetchYoutubeVideos}>
                Fetch YouTube Videos
              </button>
            </div>
          ) : (
            <>
              <div className="nes-container is-rounded">
                <h3 className="font-bold mb-2">Selected Video</h3>
                <YoutubeEmbed videoId={chapter.youtubeVideos[selectedVideoIndex]} />
              </div>

              <div>
                <h3 className="mb-2 font-bold">Available Videos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {chapter.youtubeVideos.map((videoId, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer p-2 border rounded-md ${selectedVideoIndex === index ? "bg-gray-200" : ""}`}
                      onClick={() => setSelectedVideoIndex(index)}
                    >
                      <Image
                        width={500}
                        height={300}
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt={`Video thumbnail ${index + 1}`}
                        className="w-full rounded"
                      />
                      <p className="text-xs text-center mt-1">Video {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="nes-btn is-primary" onClick={onFetchYoutubeVideos}>
                Fetch More Videos
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
