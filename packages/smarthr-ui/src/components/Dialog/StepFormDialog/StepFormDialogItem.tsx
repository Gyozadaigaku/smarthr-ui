'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { StepFormDialogContext, type StepItem } from './StepFormDialogProvider'

type Props = PropsWithChildren<StepItem>

export const StepFormDialogItem: FC<Props> = ({ children, id }) => {
  const { currentStep } = useContext(StepFormDialogContext)

  if (currentStep.id !== id) return null

  return children
}
