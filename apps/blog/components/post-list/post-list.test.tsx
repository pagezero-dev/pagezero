import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { BlogPostSummary } from "@/blog/types"
import { PostList } from "./post-list"

const samplePosts: BlogPostSummary[] = [
  {
    slug: "first-post",
    title: "First post",
    description: "First description",
    date: "2024-01-15",
    imgSrc: "https://example.com/1.jpg",
    author: { name: "Jane Doe" },
  },
  {
    slug: "second-post",
    title: "Second post",
    description: "Second description",
    date: "2024-02-20",
    imgSrc: "https://example.com/2.jpg",
    author: { name: "John Doe", role: "Editor" },
  },
]

async function renderPostList(posts: BlogPostSummary[]) {
  const rootRoute = createRootRoute({
    component: () => <PostList posts={posts} />,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  })
  await router.load()

  return render(<RouterProvider router={router} />)
}

describe("<PostList />", () => {
  it("renders post titles and descriptions", async () => {
    await renderPostList(samplePosts)
    expect(screen.getByText("First post")).toBeInTheDocument()
    expect(screen.getByText("First description")).toBeInTheDocument()
    expect(screen.getByText("Second post")).toBeInTheDocument()
    expect(screen.getByText("Second description")).toBeInTheDocument()
  })

  it("links to each post slug", async () => {
    await renderPostList(samplePosts)
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute("href", "/blog/first-post")
    expect(links[1]).toHaveAttribute("href", "/blog/second-post")
  })
})
