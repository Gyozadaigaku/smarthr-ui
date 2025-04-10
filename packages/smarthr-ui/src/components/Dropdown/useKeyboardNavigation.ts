import { type RefObject, useCallback, useContext, useEffect } from 'react'

import { tabbable } from '../../libs/tabbable'

import { DropdownContext } from './Dropdown'
import { getFirstTabbable } from './dropdownHelper'

const KEY_ESCAPE = /^Esc(ape)?$/

export function useKeyboardNavigation(
  wrapperRef: RefObject<HTMLDivElement>,
  dummyFocusRef: RefObject<HTMLElement>,
) {
  const { triggerElementRef, rootTriggerRef, onClickCloser } = useContext(DropdownContext)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (!wrapperRef.current || !triggerElementRef.current || !rootTriggerRef?.current) {
          return
        }

        const tabbablesInContent = tabbable(wrapperRef.current)

        if (tabbablesInContent.length === 0) {
          return
        }

        const trigger = tabbable(triggerElementRef.current).at(-1)
        const firstTabbable = tabbablesInContent[0]

        if (e.target === trigger) {
          if (e.shiftKey) {
            // move focus previous of the Trigger
            return
          }

          // focus a first tabbable element in the dropdown content
          e.preventDefault()
          firstTabbable.focus()

          return
        } else if (e.shiftKey) {
          if (e.target === firstTabbable || e.target === dummyFocusRef.current) {
            // focus the Trigger
            e.preventDefault()
            trigger!.focus()
            onClickCloser()
          }
        } else if (e.target === tabbablesInContent.at(-1)) {
          // move focus next of the Trigger
          const rootTrigger = tabbable(rootTriggerRef.current).at(-1)

          if (rootTrigger) {
            rootTrigger.focus()
            onClickCloser()
          }
        }
      } else if (KEY_ESCAPE.test(e.key)) {
        if (e.target && e.target === dummyFocusRef.current) {
          onClickCloser()

          return
        }

        const trigger = getFirstTabbable(triggerElementRef)

        if (trigger && e.target === trigger) {
          // close the dropdown when the Trigger is focused and Esc key is pressed
          onClickCloser()

          return
        }

        if (wrapperRef.current) {
          for (const inner of tabbable(wrapperRef.current)) {
            if (inner === e.target) {
              // close the dropdown when an element that is included in dropdown content is focused and Esc key is pressed
              onClickCloser()

              break
            }
          }
        }
      }
    },
    [wrapperRef, triggerElementRef, rootTriggerRef, dummyFocusRef, onClickCloser],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
