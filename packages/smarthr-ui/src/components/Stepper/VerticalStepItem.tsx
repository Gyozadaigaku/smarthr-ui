import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { Section } from '../SectioningContent/SectioningContent'

import { StepCounter } from './StepCounter'

import type { VerticalStep } from './types'

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-group/stepItem',
    headingWrapper: 'shr-flex shr-items-center shr-gap-1',
    heading: 'shr-inline-block',
    body: [
      // body > (:before + inner) という構造
      'shr-flex',
      // body の before 疑似要素がステップを繋ぐ線
      'before:shr-block before:shr-content-[""] before:shr-relative before:shr-mx-1 before:shr-bg-border before:shr-w-[theme(borderWidth.2)]',
      // 最後のステップの線を消す
      'group-last/stepItem:before:shr-bg-transparent',
      'forced-colors:before:shr-bg-[ButtonBorder]',
    ],
    inner: 'shr-grow shr-ms-1 shr-pt-0.5 shr-pb-1.5',
  },
  variants: {
    status: {
      completed: {
        body: ['before:shr-bg-main', 'forced-colors:before:shr-bg-[Highlight]'],
      },
      closed: {},
    },
    current: {
      true: {
        heading: 'shr-font-bold',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      status: ['completed', 'closed'],
      current: false,
      className: {
        heading: 'shr-text-grey',
      },
    },
  ],
})

type Props = VerticalStep & {
  /** ステップ数 */
  stepNumber: number
  /** 現在地かどうか */
  current: boolean
}

export const VerticalStepItem: FC<Props> = ({ stepNumber, label, status, children, current }) => {
  const classNames = useMemo(() => {
    const { wrapper, headingWrapper, heading, body, inner } = classNameGenerator({
      status: typeof status === 'object' ? status.type : status,
      current,
    })

    return {
      wrapper: wrapper(),
      headingWrapper: headingWrapper(),
      heading: heading(),
      body: body(),
      inner: inner(),
    }
  }, [current, status])

  return (
    <li aria-current={current ? 'step' : undefined} className={classNames.wrapper}>
      <Section>
        <StepHeading
          status={status}
          current={current}
          stepNumber={stepNumber}
          className={classNames.headingWrapper}
          headingClassName={classNames.heading}
        >
          {label}
        </StepHeading>
        <div className={classNames.body}>
          <div className={classNames.inner}>{children}</div>
        </div>
      </Section>
    </li>
  )
}

const StepHeading = memo<
  Pick<Props, 'status' | 'current' | 'stepNumber'> &
    PropsWithChildren<{ className: string; headingClassName: string }>
>(({ status, current, stepNumber, children, className, headingClassName }) => (
  <div className={className}>
    <StepCounter status={status} current={current} stepNumber={stepNumber} />
    <Heading type="sectionTitle" className={headingClassName}>
      {children}
    </Heading>
  </div>
))
