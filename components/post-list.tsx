import { FC } from 'react'
import Link from 'next/link'
import type Post from '../interfaces/post'
import { DateFormatter } from './date-formatter'

export type PostPreview = Omit<Post, 'content'>

const PostListItem = ({ title, slug, date, excerpt }: PostPreview) => {
    return (
        <article>
            <header>
                <h3>
                    <Link
                        as={`/posts/${slug}`}
                        href="/posts/[slug]"
                        className="hover:underline"
                    >
                        {title}
                    </Link>
                </h3>
                <small><DateFormatter dateString={date} /></small>
            </header>
            <section>
                <p>{excerpt}</p>
            </section>
        </article>
    )
}

export const PostList: FC<{ posts: PostPreview[] }> = ({ posts }) => {
    return (
        <>
            {posts.map((post, i) => <PostListItem key={i.toString()} {...post} />)}
        </>
    )
}
