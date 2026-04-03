import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Blockquote,
  Heading,
  InlineCode,
  Large,
  Lead,
  List,
  Muted,
  P,
  Small,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./typography"

describe("Typography Components", () => {
  it("renders Heading with level 1 correctly", () => {
    render(<Heading level={1}>Heading 1</Heading>)
    const heading = screen.getByText("Heading 1")
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe("H1")
  })

  it("renders Heading with level 2 correctly", () => {
    render(<Heading level={2}>Heading 2</Heading>)
    const heading = screen.getByText("Heading 2")
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe("H2")
  })

  it("renders P with correct content", () => {
    render(<P>Paragraph text</P>)
    expect(screen.getByText("Paragraph text")).toBeInTheDocument()
  })

  it("renders Blockquote with correct content", () => {
    render(<Blockquote>Quote text</Blockquote>)
    expect(screen.getByText("Quote text")).toBeInTheDocument()
  })

  it("renders InlineCode with correct content", () => {
    render(<InlineCode>code</InlineCode>)
    expect(screen.getByText("code")).toBeInTheDocument()
  })

  it("renders Lead with correct content", () => {
    render(<Lead>Lead text</Lead>)
    expect(screen.getByText("Lead text")).toBeInTheDocument()
  })

  it("renders Large with correct content", () => {
    render(<Large>Large text</Large>)
    expect(screen.getByText("Large text")).toBeInTheDocument()
  })

  it("renders Small with correct content", () => {
    render(<Small>Small text</Small>)
    expect(screen.getByText("Small text")).toBeInTheDocument()
  })

  it("renders Muted with correct content", () => {
    render(<Muted>Muted text</Muted>)
    expect(screen.getByText("Muted text")).toBeInTheDocument()
  })

  it("renders List with correct content", () => {
    render(
      <List>
        <li>Item 1</li>
        <li>Item 2</li>
      </List>,
    )
    expect(screen.getByText("Item 1")).toBeInTheDocument()
    expect(screen.getByText("Item 2")).toBeInTheDocument()
  })

  it("renders Table with correct structure", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
            <TableHead>Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    expect(screen.getByText("Header 1")).toBeInTheDocument()
    expect(screen.getByText("Header 2")).toBeInTheDocument()
    expect(screen.getByText("Cell 1")).toBeInTheDocument()
    expect(screen.getByText("Cell 2")).toBeInTheDocument()
  })
})
