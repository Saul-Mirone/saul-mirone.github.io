const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { supportedLanguages } = require("./i18n")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  Object.keys(supportedLanguages).forEach(langKey => {
    createPage({
      path: langKey === "en" ? "/" : `/${langKey}/`,
      component: path.resolve("./src/templates/blog-index.js"),
      context: {
        langKey,
      },
    })
  })

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: {frontmatter: {date: DESC}}
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                langKey
                directoryName
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges
  const allSlugs = posts.reduce((result, post) => {
    result.add(post.node.fields.slug)
    return result
  }, new Set())

  const translationsByDirectory = posts.reduce((result, post) => {
    const { directoryName } = post.node.fields
    const { langKey } = post.node.fields

    if (directoryName && langKey && langKey !== "en") {
      ;(result[directoryName] || (result[directoryName] = [])).push(langKey)
    }

    return result
  }, {})

  const defaultLangPosts = posts.filter(
    ({ node }) => node.fields.langKey === "en"
  )
  const otherLangPosts = posts.filter(
    ({ node }) => node.fields.langKey !== "en"
  )

  defaultLangPosts.forEach((post, index) => {
    const previous =
      index === defaultLangPosts.length - 1
        ? null
        : defaultLangPosts[index + 1].node
    const next = index === 0 ? null : defaultLangPosts[index - 1].node

    const translations =
      translationsByDirectory[post.node.fields.directoryName] || []

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        langKey: post.node.fields.langKey,
        translations,
        previous,
        next,
      },
    })
  })

  otherLangPosts.forEach(post => {
    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        langKey: post.node.fields.langKey,
        slug: post.node.fields.slug,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: "directoryName",
      value: path.basename(path.dirname(node.fileAbsolutePath)),
    })
  }
}
