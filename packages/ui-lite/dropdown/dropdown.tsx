import { type ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem as UIDropdownMenuItem,
} from "@/ui/dropdown-menu"

interface DropdownProps {
  menu: ReactNode
  children: ReactNode
}

export const Dropdown = ({ menu, children }: DropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="inline-flex flex-col">{children}</div>
      </DropdownMenuTrigger>
      {menu}
    </DropdownMenu>
  )
}

interface DropdownMenuProps {
  children: ReactNode
  align?: "start" | "center" | "end"
}

const DropdownMenuComponent = ({ align, children }: DropdownMenuProps) => {
  return <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
}

interface DropdownMenuItemProps {
  children: ReactNode
}

const DropdownMenuItemComponent = ({ children }: DropdownMenuItemProps) => {
  return <UIDropdownMenuItem>{children}</UIDropdownMenuItem>
}

DropdownMenuComponent.displayName = "Dropdown.Menu"
DropdownMenuItemComponent.displayName = "Dropdown.MenuItem"
Dropdown.Menu = DropdownMenuComponent
Dropdown.MenuItem = DropdownMenuItemComponent
