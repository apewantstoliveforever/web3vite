"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { MenuOutlined } from '@ant-design/icons';
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define a type for props
interface DropdownMenuCheckboxes3Props {
  name: string;
  name2: string;
  name3: string;
  name4: string;
  link: string; // Define the type for `link` if it's used
}

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownMenuCheckboxes3({
  name,
  name2,
  name3,
  name4,
  link // Destructure `link` from props
}: DropdownMenuCheckboxes3Props) {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button><MenuOutlined style={{ color: 'white' }} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          // checked={showStatusBar}
          // onCheckedChange={setShowStatusBar}
        >
          {name2}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          className="cursor-pointer"
        >
          {name3}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
          className="cursor-pointer"
        >
          {name4}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuCheckboxes3;
