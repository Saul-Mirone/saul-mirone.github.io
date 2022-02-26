import React from "react"
import { Link } from "gatsby"
import { supportedLanguages } from "../../i18n"

const Panel = ({ children, style = {} }) => {
  return (
    <p
      style={{
        fontSize: "0.9em",
        border: "1px solid var(--hr)",
        borderRadius: "0.75em",
        padding: "0.75em",
        background: "var(--inlineCode-bg)",
        wordBreak: "keep-all",
        ...style,
      }}
    >
      {children}
    </p>
  )
}

const codeToLanguage = l => {
  return supportedLanguages[l]
}

const matchPath = /\/(\w|-)+|-+/g

const Translation = ({ translations, location }) => {
  if (!translations) {
    const [lang, origin] = location.pathname.match(matchPath)
    return (
      <div className="translations">
        <Panel>
          <Link to={origin}>Read the original</Link>
          {" • "}
          <Link to={lang}>View all translated posts</Link>
        </Panel>
      </div>
    )
  }

  if (!translations.length) {
    return null
  }

  return (
    <div className="translations">
      <Panel>
        <span>Translated into: </span>
        <>
          {translations.map(l => {
            console.log(location.pathname)
            return (
              <Link key={l} to={`/${l}/${location.pathname.replaceAll('/', '')}`}>
                {codeToLanguage(l)}
              </Link>
            )
          })}
        </>
      </Panel>
    </div>
  )
}

export default Translation
