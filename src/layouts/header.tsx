// Header.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import DropdownMenuCheckboxes2 from "../components/DropdownMenu/DropdownMenu2";
import imgLogo from "../assets/snapedit_1722346985126.png";
import { logout } from "../auth/authSlice";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      
                <DropdownMenuCheckboxes2
                  name={username}
                  name2={"Trực tuyến"}
                  name3={"Cài đặt trạng thái tùy chỉnh"}
                  name4={"Đăng xuất"}

                />
           
    </div>
  );
};

export default Header;
