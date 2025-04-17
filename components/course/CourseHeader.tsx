interface CourseHeaderProps {
    title: string
    description: string
    category: string
    difficulty: string
    duration: string
  }
  
  /**
   * Renders the header section of a course, displaying its title, description, 
   * category, difficulty, and duration.
   *
   * @param {CourseHeaderProps} props - The properties for the CourseHeader component.
   * @param {string} props.title - The title of the course.
   * @param {string} props.description - A brief description of the course.
   * @param {string} props.category - The category to which the course belongs.
   * @param {string} props.difficulty - The difficulty level of the course.
   * @param {string} props.duration - The estimated duration of the course.
   * @returns {JSX.Element} The rendered CourseHeader component.
   */
  
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
  