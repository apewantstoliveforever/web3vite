"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { MenuOutlined } from '@ant-design/icons';
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/auth/store";
import { logout } from "../../auth/authSlice";
import { db, user } from "@/services/gun";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CarouselDemo2 from "../List/List";

type Checked = DropdownMenuCheckboxItemProps["checked"]

// Define a type for the props
interface DropdownMenuCheckboxesProps {
  name: string;
  name2: string;
  name3: string;
  name4: string;
}

export function DropdownMenuCheckboxes({
  name,
  name2,
  name3,
  name4
}: DropdownMenuCheckboxesProps) {
  // const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  
  // const [showPanel, setShowPanel] = React.useState<Checked>(false)
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLogout = () => {
    user.leave();
    dispatch(logout());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button><MenuOutlined /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>
          <CarouselDemo2 />
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          // checked={showStatusBar}
          // onCheckedChange={setShowStatusBar}
          className="cursor-pointer"
        >
          {name2} <Switch />
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          className="cursor-pointer"
          disabled
        >
          {name3}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className="cursor-pointer"
          onClick={handleLogout}
        >
          {name4}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMenuCheckboxes;
