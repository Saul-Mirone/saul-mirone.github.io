import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import { PostList, PostPreview } from '../components/post-list'
import { Layout } from '../components/layout'
import { Container } from '../components/container'

type Props = {
  allPosts: PostPreview[]
}

export default function Index({ allPosts }: Props) {
  return (
    <Layout>
      <Head>
        <title>{`Next.js Blog Example with ${CMS_NAME}`}</title>
      </Head>
      <Container>
        <PostList posts={allPosts} />
      </Container>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
