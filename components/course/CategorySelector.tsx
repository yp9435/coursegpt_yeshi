"use client"

import type React from "react"
import { Code, BookOpen, Briefcase, Cloud, Gamepad } from "lucide-react"

interface CategorySelectorProps {
  selectedCategory: string
  customCategory: string
  onSelectCategory: (category: string) => void
  onCustomCategoryChange: (category: string) => void
}

interface CategoryOption {
  id: string
  name: string
  icon: React.ElementType
}

/**
 * A component that allows users to select a category for their course from a predefined list
 * or specify a custom category if "Others" is selected.
 *
 * @param {CategorySelectorProps} props - The props for the `CategorySelector` component.
 * @param {string} props.selectedCategory - The currently selected category ID.
 * @param {string} props.customCategory - The value of the custom category input field.
 * @param {(categoryId: string) => void} props.onSelectCategory - Callback function triggered when a category is selected.
 * @param {(customCategory: string) => void} props.onCustomCategoryChange - Callback function triggered when the custom category input value changes.
 *
 * @returns {JSX.Element} The rendered `CategorySelector` component.
 *
 * @remarks
 * - The component displays a grid of predefined categories, each with an icon and name.
 * - When the "Others" category is selected, an input field is displayed for entering a custom category.
 * - The selected category is visually highlighted, and the component provides a brief description
 *   to guide users in selecting an appropriate category.
 *
 * @example
 * ```tsx
 * <CategorySelector
 *   selectedCategory="Programming"
 *   customCategory=""
 *   onSelectCategory={(id) => console.log("Selected category:", id)}
 *   onCustomCategoryChange={(value) => console.log("Custom category:", value)}
 * />
 * ```
 */
export function CategorySelector({
  selectedCategory,
  customCategory,
  onSelectCategory,
  onCustomCategoryChange,
}: CategorySelectorProps) {
  const categories: CategoryOption[] = [
    { id: "Programming", name: "Programming", icon: Code },
    { id: "Development", name: "Development", icon: BookOpen },
    { id: "Interview", name: "Interview Preparation", icon: Briefcase },
    { id: "Deployment", name: "Deployment", icon: Cloud },
    { id: "Others", name: "Others", icon: Gamepad },
  ]

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Select a Category</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.id}
              className={`nes-container is-rounded cursor-pointer p-4 transition-all hover:bg-gray-100 ${
                selectedCategory === category.id ? "is-dark" : ""
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="flex flex-col items-center justify-center">
                <Icon className="mb-2 h-8 w-8" />
                <span className="text-center text-sm">{category.name}</span>
              </div>
            </div>
          )
        })}
      </div>

      {selectedCategory === "Others" && (
        <div className="mt-6">
          <label htmlFor="custom-category" className="mb-2 block text-sm font-medium">
            Enter Custom Category
          </label>
          <input
            id="custom-category"
            type="text"
            value={customCategory}
            onChange={(e) => onCustomCategoryChange(e.target.value)}
            placeholder="e.g., Data Science, Machine Learning, etc."
            className="nes-input w-full"
          />
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Select a category that best describes your course. This will help users find your course more easily.
        </p>
      </div>
    </div>
  )
}
