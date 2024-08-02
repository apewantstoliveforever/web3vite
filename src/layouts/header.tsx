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
      <nav>
        <ul className="flex items-center justify-between">
          <li>
            <a href="/">
              <img
                className="object-fill w-12 h-12"
                src={imgLogo}
                alt="Logo"
              />
            </a>
          </li>
          <li className="text-1xl">DISCORD WEB3</li>
          <li className="text-1xl">
                <DropdownMenuCheckboxes2
                  name={username}
                  name2={"Trực tuyến"}
                  name3={"Cài đặt trạng thái tùy chỉnh"}
                  name4={"Đăng xuất"}

                />
              </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
