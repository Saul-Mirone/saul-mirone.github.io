/*
 * Copyright (c) 2015 instructure-react
 * Forked from https://github.com/aaronshaf/react-toggle/
 * + applied https://github.com/aaronshaf/react-toggle/pull/90
 **/
import React from "react"

import "./toggle.css"

const Toggle = React.memo(
  ({ checked, defaultChecked, icons, className, ...inputProps }) => {
    const ref = React.useRef(null)
    const [isChecked, setIsChecked] = React.useState(
      !!(checked || defaultChecked)
    )

    React.useEffect(() => {
      setIsChecked(checked)
    }, [checked])

    const handleClick = React.useCallback(event => {
      const checkbox = ref.current
      if (event.target !== checkbox) {
        event.preventDefault()
        checkbox.focus()
        checkbox.click()
        return
      }
      setIsChecked(checkbox.checked)
    }, [])

    const getIcon = type => {
      if (!icons) {
        return null
      }
      return icons[type]
    }

    const classes = React.useMemo(() => {
      return (
        "react-toggle" +
        (isChecked ? " react-toggle--checked" : "") +
        (className ? " " + className : "")
      )
    }, [isChecked, className])

    return (
      <div
        className={classes}
        onClick={handleClick}
        onKeyDown={handleClick}
        role="switch"
        aria-checked={isChecked.toString()}
        tabIndex={0}
      >
        <div className="react-toggle-track">
          <div className="react-toggle-track-check">{getIcon("checked")}</div>
          <div className="react-toggle-track-x">{getIcon("unchecked")}</div>
        </div>
        <div className="react-toggle-thumb" />

        <input
          {...inputProps}
          checked={isChecked}
          ref={ref}
          className="react-toggle-screenreader-only"
          type="checkbox"
          aria-label="Switch between Dark and Light mode"
        />
      </div>
    )
  }
)
export default Toggle
