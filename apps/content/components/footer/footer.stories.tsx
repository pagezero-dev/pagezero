import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Footer } from "./footer"

const meta = {
  title: "Apps/Content/Footer",
  component: Footer,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    companyName: faker.company.name(),
    navigation: [
      {
        heading: faker.lorem.word(),
        children: [
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
        ],
      },
      {
        heading: faker.lorem.word(),
        children: [
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
        ],
      },
      {
        heading: faker.lorem.word(),
        children: [
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
        ],
      },
      {
        heading: faker.lorem.word(),
        children: [
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
          { label: faker.lorem.word(), href: faker.internet.url() },
        ],
      },
    ],
    socialMediaUrls: {
      facebookUrl: "https://www.facebook.com",
      instagramUrl: "https://www.instagram.com",
      twitterUrl: "https://www.twitter.com",
      githubUrl: "https://www.github.com",
      youtubeUrl: "https://www.youtube.com",
    },
  },
}
