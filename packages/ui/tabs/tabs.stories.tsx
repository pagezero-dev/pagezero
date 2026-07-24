import type { Meta, StoryObj } from "@storybook/tanstack-react"
import { Image, Music, Video } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta = {
  title: "Packages/UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4">
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Make changes to your account settings here. Click save when you're done.
        </p>
      </TabsContent>
      <TabsContent value="password" className="p-4">
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Change your password here. After saving, you'll be logged out.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="p-4">
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage your account settings and set email preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="music">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="music">
          <Music className="h-4 w-4" />
          Music
        </TabsTrigger>
        <TabsTrigger value="photos">
          <Image className="h-4 w-4" />
          Photos
        </TabsTrigger>
        <TabsTrigger value="videos">
          <Video className="h-4 w-4" />
          Videos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="music" className="p-4">
        <h3 className="text-lg font-medium">Music</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Listen to your favorite tunes and discover new music.
        </p>
      </TabsContent>
      <TabsContent value="photos" className="p-4">
        <h3 className="text-lg font-medium">Photos</h3>
        <p className="text-muted-foreground mt-2 text-sm">View and manage your photo library.</p>
      </TabsContent>
      <TabsContent value="videos" className="p-4">
        <h3 className="text-lg font-medium">Videos</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Watch your saved videos and discover new content.
        </p>
      </TabsContent>
    </Tabs>
  ),
}
