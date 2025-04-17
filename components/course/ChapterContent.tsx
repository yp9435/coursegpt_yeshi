"use client"

import { useState } from "react"

interface ContentSection {
  title: string
  explanation: string
  codeExample?: string
}

interface ChapterContentProps {
  content: ContentSection[]
}

/**
 * Component to display chapter content with a tabbed interface for "Content" and "Notes".
 *
 * @param {ChapterContentProps} props - The props for the component.
 * @param {Array<{ title: string; explanation: string; codeExample?: string }>} props.content - 
 * An array of sections representing the chapter content. Each section includes:
 * - `title`: The title of the section.
 * - `explanation`: The explanation or description of the section.
 * - `codeExample` (optional): A code snippet related to the section.
 *
 * @returns {JSX.Element} A styled container with tabs for viewing chapter content and taking notes.
 *
 * @remarks
 * - The "Content" tab displays the chapter sections, including titles, explanations, and optional code examples.
 * - The "Notes" tab provides a textarea for users to take notes and a button to save them.
 * - The component uses the NES.css library for styling.
 *
 * @example
 * ```tsx
 * const chapterContent = [
 *   {
 *     title: "Introduction to React",
 *     explanation: "React is a JavaScript library for building user interfaces.",
 *     codeExample: "const element = <h1>Hello, world!</h1>;"
 *   },
 *   {
 *     title: "State and Props",
 *     explanation: "State and props are core concepts in React.",
 *   }
 * ];
 *
 * <ChapterContent content={chapterContent} />
 * ```
 */

export function ChapterContent({ content }: ChapterContentProps) {
  const [activeTab, setActiveTab] = useState("content")

  return (
    <div className="nes-container is-rounded with-title">
      <p className="title">Chapter Content</p>

      <div className="mb-4 flex gap-2">
        <button
          className={`nes-btn ${activeTab === "content" ? "is-primary" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          Content
        </button>
        <button
          className={`nes-btn ${activeTab === "notes" ? "is-primary" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
      </div>

      {activeTab === "content" && (
        <div className="space-y-8">
          {content.map((section, index) => (
            <div key={index} className="border-b border-gray-300 pb-6 last:border-0">
              <h3 className="mb-4 text-lg font-bold">{section.title}</h3>
              <div className="mb-4 whitespace-pre-line">{section.explanation}</div>

              {section.codeExample && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-bold">Code Example:</h4>
                  <pre className="nes-container is-dark overflow-x-auto p-4">
                    <code className="text-sm">{section.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="nes-container is-rounded">
          <h3 className="mb-4 text-lg font-bold">Your Notes</h3>
          <textarea
            className="nes-textarea h-64 w-full"
            placeholder="Take notes here..."
          ></textarea>
          <div className="mt-4 text-right">
            <button className="nes-btn is-primary">Save Notes</button>
          </div>
        </div>
      )}
    </div>
  )
}
