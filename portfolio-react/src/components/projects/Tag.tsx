import { useRef } from 'react'
import { useTagTooltip } from '../../context/TagTooltipContext'
import { TAG_DESCRIPTIONS } from './tagDescriptions'

export function Tag({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { show, hide, scheduleHide } = useTagTooltip()
  const description = TAG_DESCRIPTIONS[name]

  if (!description) {
    return <span className="tag">{name}</span>
  }

  return (
    <span
      className="tag"
      ref={ref}
      onMouseEnter={() => ref.current && show(ref.current, description)}
      onMouseLeave={hide}
      onTouchStart={(e) => {
        e.preventDefault()
        if (ref.current) show(ref.current, description)
        scheduleHide(1500)
      }}
    >
      {name}
    </span>
  )
}
