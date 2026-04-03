import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

describe("<Tabs />", () => {
  it("should display the content of the selected tab", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content of Tab 1</TabsContent>
        <TabsContent value="tab2">Content of Tab 2</TabsContent>
        <TabsContent value="tab3">Content of Tab 3</TabsContent>
      </Tabs>,
    )

    // Tab 1 content should be visible by default
    expect(screen.getByText("Content of Tab 1")).toBeInTheDocument()
    expect(screen.queryByText("Content of Tab 2")).not.toBeInTheDocument()
    expect(screen.queryByText("Content of Tab 3")).not.toBeInTheDocument()

    // Click on Tab 2
    await user.click(screen.getByRole("tab", { name: "Tab 2" }))

    // Tab 2 content should be visible
    expect(screen.queryByText("Content of Tab 1")).not.toBeInTheDocument()
    expect(screen.getByText("Content of Tab 2")).toBeInTheDocument()
    expect(screen.queryByText("Content of Tab 3")).not.toBeInTheDocument()

    // Click on Tab 3
    await user.click(screen.getByRole("tab", { name: "Tab 3" }))

    // Tab 3 content should be visible
    expect(screen.queryByText("Content of Tab 1")).not.toBeInTheDocument()
    expect(screen.queryByText("Content of Tab 2")).not.toBeInTheDocument()
    expect(screen.getByText("Content of Tab 3")).toBeInTheDocument()
  })

  it("should have the correct accessibility attributes", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content of Tab 1</TabsContent>
        <TabsContent value="tab2">Content of Tab 2</TabsContent>
      </Tabs>,
    )

    // Check that the selected tab has the correct attributes
    const selectedTab = screen.getByRole("tab", { name: "Tab 1" })
    expect(selectedTab).toHaveAttribute("aria-selected", "true")

    // Check that the non-selected tab has the correct attributes
    const nonSelectedTab = screen.getByRole("tab", { name: "Tab 2" })
    expect(nonSelectedTab).toHaveAttribute("aria-selected", "false")
  })
})
