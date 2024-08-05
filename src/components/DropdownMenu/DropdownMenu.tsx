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

// Define the type for the props
interface DropdownMenuCheckboxesProps {
  name: string;
  name2: string;
  name3: string;
  name4: string;
  link: string;
}

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownMenuCheckboxes({ name, name2, name3, name4, link }: DropdownMenuCheckboxesProps) {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button><MenuOutlined /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          // checked={showStatusBar}
          // onCheckedChange={setShowStatusBar}
        >
          <a href={link} className="text-black">
            {name2}
          </a>
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
          disabled
          className="font-bold cursor-pointer"
        >
          {name4}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuCheckboxes;
