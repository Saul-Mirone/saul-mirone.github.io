/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import avatar from "../../content/assets/avatar.png"

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author
          social {
            twitter
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <img
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
          width: rhythm(2),
          height: rhythm(2),
        }}
        src={avatar}
      />
      <p style={{ whiteSpace: "pre-wrap" }}>
        Personal blog by{" "}
        <a href={`https://twitter.com/${social.twitter}`}>{author}</a>.{"\n"}
        Kiss the demons out of my dreams.
      </p>
    </div>
  )
}

export default Bio
