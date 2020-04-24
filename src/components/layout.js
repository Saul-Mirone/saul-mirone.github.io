import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import Toggle from "./toggle"
import moon from "../../content/assets/moon.png"
import sun from "../../content/assets/sun.png"

const Header = ({ title, location }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  if (location.pathname === rootPath) {
    return (
      <h1
        style={{
          ...scale(0.75),
          marginBottom: 0,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  }

  return (
    <h3
      style={{
        fontFamily: `Montserrat, sans-serif`,
        marginBottom: 0,
        marginTop: 0,
      }}
    >
      <Link
        style={{
          boxShadow: `none`,
          color: "var(--textLink)",
        }}
        to={`/`}
      >
        {title}
      </Link>
    </h3>
  )
}

const themeKey = "theme"

const Layout = ({ location, title, children }) => {
  const [theme, setTheme] = React.useState(
    typeof window !== "undefined"
      ? window.localStorage.getItem(themeKey) || "light"
      : "light"
  )

  React.useEffect(() => {
    document.body.className = theme
    if (typeof window !== "undefined") {
      window.localStorage.setItem(themeKey, theme)
    }
  }, [theme])

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.625rem",
        }}
      >
        <Header location={location} title={title} />
        <Toggle
          icons={{
            checked: (
              <img
                src={moon}
                width="16"
                height="16"
                role="presentation"
                style={{ pointerEvents: "none" }}
                alt="moon"
              />
            ),
            unchecked: (
              <img
                src={sun}
                width="16"
                height="16"
                role="presentation"
                style={{ pointerEvents: "none" }}
                alt="sun"
              />
            ),
          }}
          checked={theme === "night"}
          onChange={e => {
            const nextTheme = e.target.checked ? "night" : "light"
            setTheme(nextTheme)
          }}
        />
      </header>
      <main>{children}</main>
      <footer>
        <div style={{ float: "right" }}>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            rss
          </a>
        </div>
        <a
          href="https://mobile.twitter.com/SaulMirone"
          target="_blank"
          rel="noopener noreferrer"
        >
          twitter
        </a>{" "}
        &bull;{" "}
        <a
          href="https://github.com/Saul-Mirone"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
      </footer>
    </div>
  )
}

export default Layout
