interface CourseHeaderProps {
    title: string
    description: string
    category: string
    difficulty: string
    duration: string
  }
  
  export function CourseHeader({ title, description, category, difficulty, duration }: CourseHeaderProps) {
    return (
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="mb-4 text-gray-700">{description}</p>
  
        <div className="flex flex-wrap gap-2">
          <span className="nes-badge">
            <span className="is-dark">{category}</span>
          </span>
          <span className="nes-badge">
            <span className="is-primary">{difficulty}</span>
          </span>
          <span className="nes-badge">
            <span className="is-success">{duration}</span>
          </span>
        </div>
      </div>
    )
  }
  