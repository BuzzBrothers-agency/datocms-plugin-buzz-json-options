// @ts-nocheck

import { useState } from 'react'
import './collapsible.css'
import { type TCollapsible } from './collapsible.type'

export default function Collapsible(props: TCollapsible) {
  const [isOpen, setIsOpen] = useState(props.collapsed)

  return (
    <div
      className={`collapsible ${isOpen ? '-open' : ''} ${props?.className ?? ''}`}
    >
      <header className="collapsible_header" onClick={() => setIsOpen(!isOpen)}>
        <div className="collapsible_header-arrow"></div>
        <div className="collapsible_header-title">
          {props.icon ?? ''} {props.label}{' '}
        </div>
      </header>
      <div className="collapsible_content">{props.children}</div>
    </div>
  )
}
