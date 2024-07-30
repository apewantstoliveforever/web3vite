//header

import React from 'react';
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
          <h2>Welcome: Hoài Lâm</h2>
            
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;