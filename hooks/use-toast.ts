"use client"
// Inspired by react-hot-toast library
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

export interface Toast {
  id: string
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  [key: string]: any
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; toast: Partial<Toast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

let count = 0
function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, NodeJS.Timeout>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer function to manage the state of toast notifications.
 *
 * @param state - The current state of the toast notifications.
 * @param action - The action to perform on the state.
 * @returns The updated state after applying the action.
 *
 * @remarks
 * This reducer handles the following action types:
 * - `"ADD_TOAST"`: Adds a new toast to the state, ensuring the total number of toasts does not exceed the `TOAST_LIMIT`.
 * - `"UPDATE_TOAST"`: Updates an existing toast in the state by matching its `id`.
 * - `"DISMISS_TOAST"`: Marks a toast (or all toasts if no `toastId` is provided) as closed by setting `open` to `false`.
 * - `"REMOVE_TOAST"`: Removes a toast (or all toasts if no `toastId` is provided) from the state.
 *
 * @example
 * // Example usage of the reducer
 * const newState = reducer(currentState, { type: "ADD_TOAST", toast: { id: "1", message: "Hello" } });
 *
 * @see ToastState - The shape of the toast state.
 * @see ToastAction - The shape of the actions that can be dispatched.
 * Why Use Toasts?
Quick Feedback: Toasts provide instant feedback to users without interrupting their workflow.
Non-Intrusive: They don’t block the user from interacting with the rest of the app.
Customizable: You can style and configure them to fit your app’s design and behavior.

A toast is a small, temporary notification that pops up on the screen to give feedback to the user. For example, when you save a file, submit a form, or encounter an error, a toast can appear to show a success message, warning, or error. It usually disappears automatically after a short time or when the user dismisses it.

 */

export const reducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: ToastState) => void> = []

let memoryState: ToastState = { toasts: [] }

function dispatch(action: ToastAction) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function toast(props: Omit<Toast, "id" | "open" | "onOpenChange">) {
  const id = genId()

  const update = (props: Partial<Toast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  const dismiss = () =>
    dispatch({
      type: "DISMISS_TOAST",
      toastId: id,
    })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return { id, dismiss, update }
}

// useToast hook
function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
