'use client'

import {
  type ComponentProps,
  type FC,
  type ReactElement,
  cloneElement,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react'

import { ActionDialog } from '../ActionDialog'

type ToggleModalActionType = () => void

export const ActionDialogWithTrigger: FC<
  Omit<ComponentProps<typeof ActionDialog>, 'isOpen' | 'onClickClose' | 'onPressEscape'> & {
    trigger: Omit<ReactElement, 'onClick' | 'aria-haspopup' | 'aria-controls'>
    onClickTrigger?: (open: ToggleModalActionType) => void
    onClickClose?: (close: ToggleModalActionType) => void
    onPressEscape?: (close: ToggleModalActionType) => void
  }
> = ({ id, trigger, onClickTrigger, onClickClose, onPressEscape, ...props }) => {
  const generatedId = useId()
  const actualId = id || generatedId
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const onClickOpen = useMemo(
    () => (onClickTrigger ? () => onClickTrigger(open) : open),
    [onClickTrigger, open],
  )

  const actualOnClickClose = useMemo(
    () => (onClickClose ? () => onClickClose(close) : close),
    [onClickClose, close],
  )

  const actualOnPressEscape = useMemo(
    () => (onPressEscape ? () => onPressEscape(close) : close),
    [onPressEscape, close],
  )

  const actualTrigger = useMemo(
    () =>
      cloneElement(trigger as ReactElement, {
        onClick: onClickOpen,
        'aria-haspopup': 'true',
        'aria-controls': actualId,
      }),
    [trigger, actualId, onClickOpen],
  )

  return (
    <>
      {actualTrigger}
      <ActionDialog
        {...props}
        isOpen={isOpen}
        onClickClose={actualOnClickClose}
        onPressEscape={actualOnPressEscape}
        id={actualId}
      />
    </>
  )
}
