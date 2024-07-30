//header

import React from 'react';
import DropdownMenuCheckboxes2 from '../components/DropdownMenu/DropdownMenu2'

import imgLogo from '../assets/snapedit_1722346985126.png'
const Header = () => {

  return (
    <div>
      <nav>
        <ul className='flex items-center justify-between'>
          <li>
            <a href="/">
              <img className='object-fill w-32 h-32' src={imgLogo} />
            </a>
          </li>
          {/* <li>
            <a href="/chat">Chat</a>
          </li> */}

          <li className='text-4xl'>
            DISCORD WEB3
          </li>

          <li className='text-4xl'>
            <DropdownMenuCheckboxes2 name={"hoailam03999@gmail.com"} name2={"Trực tuyến"} name3={"Cái đặt trạng thái tùy chỉnh"} name4={"Đăng xuất"} />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;