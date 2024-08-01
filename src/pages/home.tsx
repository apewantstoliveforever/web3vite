import React, { useState } from 'react';
import '../styles/globals.css';
import { Layout, Menu, theme, Image } from 'antd';
import CarouselDemo from '../components/Courses/Courses';
import DropdownMenuCheckboxes from '../components/DropdownMenu/DropdownMenu';
import Profile from '../pages/profile';
import Test from './test';

const { Content, Sider } = Layout;

const iteam2 = [
  {
    icon: (
      <Image
        width={50}
        className="rounded-full"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    ),
    name: "Profile",
    link: "/test",
    icon2: <DropdownMenuCheckboxes name={"Profile"} name2={"Vào Ngay"} name4={"Thoát Group"} name3={"Thêm thành viên"} link="/test" />
  },
  {
    icon: (
      <Image
        width={50}
        className="rounded-full"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    ),
    name: "Chat",
    link: "/test",
    icon2: <DropdownMenuCheckboxes name={"Chat"} name2={"Vào Ngay"} name4={"Thoát Group"} name3={"Thêm thành viên"} link="/test" />
  },
  {
    icon: (
      <Image
        width={50}
        className="rounded-full"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    ),
    name: "Server",
    link: "/test",
    icon2: <DropdownMenuCheckboxes name={"Groups Chat"} name2={"Vào Ngay"} name4={"Thoát Group"} name3={"Thêm thành viên"} link="/test" />
  }
];

const items = iteam2.map((item, index) => ({
  key: String(index + 1),
  icon: (
    <div className="flex items-center">
      {item.icon}
    </div>
  ),
  label: (
    <div className="flex items-center text-black">
      {item.name}
      <span className="ml-2 text-white">{item.icon2}</span>
    </div>
  )
}));

const Home: React.FC = () => {
  const [activeItem, setActiveItem] = useState('1');

  const handleClick = (e) => {
    setActiveItem(e.key);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout className="bg-slate-400 h-full ">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            className="bg-slate-300 border-black"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
            onClick={handleClick}
          />
        </Sider>

        <Layout className='bg-slate-900 p-2'>
          {activeItem === '1' && (
            <Content>
              <div
                className='bg-red-500 hover:bg-red-700 text-center'
                style={{
                  padding: 24,
                  display: 'flex',
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <div className='w-full flex ml-16'>
                  <CarouselDemo />
                  <div className='w-full ml-16'>
                    <Profile />
                  </div>
                </div>
              </div>
            </Content>
          )}

          {activeItem === '2' && (
            <Content>
              {/* <div style={{color: "white"}}>22222222222</div> */}
              <Test />
            </Content>
          )}

          {activeItem === '3' && (
            <Content>
              <div style={{color: "white"}}>
               33333333333333
              </div>
            </Content>
          )}
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
