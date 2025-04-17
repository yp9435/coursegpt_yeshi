"use client"

interface TopicFormProps {
  topic: string
  description: string
  onTopicChange: (topic: string) => void
  onDescriptionChange: (description: string) => void
}

/**
 * A React component for rendering a form to input a course topic and description.
 * This form allows users to specify the topic and optionally provide a description
 * for their course. The provided information can be used to generate relevant content.
 *
 * @param {TopicFormProps} props - The props for the `TopicForm` component.
 * @param {string} props.topic - The current value of the course topic.
 * @param {string} props.description - The current value of the course description.
 * @param {(value: string) => void} props.onTopicChange - Callback function to handle changes to the course topic.
 * @param {(value: string) => void} props.onDescriptionChange - Callback function to handle changes to the course description.
 *
 * @returns {JSX.Element} The rendered `TopicForm` component.
 */

export function TopicForm({ topic, description, onTopicChange, onDescriptionChange }: TopicFormProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Course Topic & Description</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="topic" className="mb-2 block text-sm font-medium">
            Course Topic <span className="text-red-500">*</span>
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g., TypeScript Fundamentals, React Hooks, etc."
            className="nes-input"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Be specific about what your course will teach.</p>
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Course Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Provide a brief description of what students will learn in this course..."
            className="nes-textarea h-32"
          />
          <p className="mt-1 text-xs text-gray-500">A good description helps students understand what they&apos;ll learn.</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          The AI will use this information to generate relevant content for your course.
        </p>
      </div>
    </div>
  )
}
