import type { Meta, StoryObj } from "@storybook/react-vite"

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

const meta = {
  title: "Packages/UI/Typography",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="max-w-prose">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Headings: Story = {
  render: () => (
    <div className="space-y-6">
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4</Heading>
      <Heading level={5}>Heading 5</Heading>
      <Heading level={6}>Heading 6</Heading>
    </div>
  ),
}

export const Paragraph: Story = {
  render: () => (
    <div>
      <P>
        This is a paragraph of text. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl
        aliquet nunc, eget aliquam nisl nunc eget nisl.
      </P>
      <P>
        This is another paragraph. Sed ut perspiciatis unde omnis iste natus
        error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis.
      </P>
    </div>
  ),
}

export const BlockquoteExample: Story = {
  render: () => (
    <Blockquote>
      "After all," he said, "everyone enjoys a good joke, so it's only fair that
      they should pay for the privilege."
    </Blockquote>
  ),
}

export const InlineCodeExample: Story = {
  render: () => <InlineCode>@radix-ui/react-dialog</InlineCode>,
}

export const LeadExample: Story = {
  render: () => (
    <Lead>
      A modal dialog that interrupts the user with important content and expects
      a response.
    </Lead>
  ),
}

export const LargeExample: Story = {
  render: () => <Large>Are you absolutely sure?</Large>,
}

export const SmallExample: Story = {
  render: () => <Small>Email address</Small>,
}

export const MutedExample: Story = {
  render: () => <Muted>Enter your email address.</Muted>,
}

export const ListExample: Story = {
  render: () => (
    <List>
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners: 20 gold coins</li>
    </List>
  ),
}

export const TableExample: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>King's Treasury</TableHead>
          <TableHead>People's happiness</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Empty</TableCell>
          <TableCell>Overflowing</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Modest</TableCell>
          <TableCell>Satisfied</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Full</TableCell>
          <TableCell>Ecstatic</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const TypographyDemo: Story = {
  render: () => (
    <div>
      <Heading level={1}>Taxing Laughter: The Joke Tax Chronicles</Heading>
      <Lead>
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </Lead>
      <Heading level={2}>The King's Plan</Heading>
      <P>
        The king thought long and hard, and finally came up with{" "}
        <a
          href="https://example.com"
          className="font-medium text-primary underline underline-offset-4"
        >
          a brilliant plan
        </a>
        : he would tax the jokes in the kingdom.
      </P>
      <Blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair
        that they should pay for the privilege."
      </Blockquote>
      <Heading level={3}>The Joke Tax</Heading>
      <P>
        The king's subjects were not amused. They grumbled and complained, but
        the king was firm:
      </P>
      <List>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners: 20 gold coins</li>
      </List>
      <P>
        As a result, people stopped telling jokes, and the kingdom fell into a
        gloom. But there was one person who refused to let the king's
        foolishness get him down: a court jester named Jokester.
      </P>
      <Heading level={3}>Jokester's Revolt</Heading>
      <P>
        Jokester began sneaking into the castle in the middle of the night and
        leaving jokes all over the place: under the king's pillow, in his soup,
        even in the royal toilet. The king was furious, but he couldn't seem to
        stop Jokester.
      </P>
      <P>
        And then, one day, the people of the kingdom discovered that the jokes
        left by Jokester were so funny that they couldn't help but laugh. And
        once they started laughing, they couldn't stop.
      </P>
      <Heading level={3}>The People's Rebellion</Heading>
      <P>
        The people of the kingdom, feeling uplifted by the laughter, started to
        tell jokes and puns again, and soon the entire kingdom was in on the
        joke.
      </P>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>King's Treasury</TableHead>
            <TableHead>People's happiness</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Empty</TableCell>
            <TableCell>Overflowing</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Modest</TableCell>
            <TableCell>Satisfied</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Full</TableCell>
            <TableCell>Ecstatic</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <P>
        The king, seeing how much happier his subjects were, realized the error
        of his ways and repealed the joke tax. Jokester was declared a hero, and
        the kingdom lived happily ever after.
      </P>
      <P>
        The moral of the story is: never underestimate the power of a good laugh
        and always be careful of bad ideas.
      </P>
    </div>
  ),
}
