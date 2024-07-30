import React from 'react';
import '../styles/globals.css';
import { 
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  EllipsisOutlined, MenuOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Image } from 'antd';

import DropdownMenuCheckboxes from '../components/DropdownMenu/DropdownMenu'



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
    name: "Hoài Lâm 1",
    link: "/test",
    icon2: <DropdownMenuCheckboxes name={"Hoài Lâm 1"} name2={"Vào Ngay"} name4={"Thoát Group"} name3={"Thêm thành viên"} link="/test"/>
  },
  {
    icon: (
      <Image
        width={50}
        className="rounded-full"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    ),
    name: "Hoài Lâm 2",
    link: "/test",
    icon2: <DropdownMenuCheckboxes name={"Hoài Lâm 2"} name2={"Vào Ngay"} name4={"Thoát Group"} name3={"Thêm thành viên"} link="/test" />
  },
  {
    icon: (
      <Image
        width={50}
        className="rounded-full"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    ),
    name: "Hoài Lâm 3",
    link: "/test",
    icon2: <DropdownMenuCheckboxes name={"Hoài Lâm 3"} name2={"Vào Ngay"} name4={"Thoát Group"} name3={"Thêm thành viên"} link="/test" /> 
  }
];


const items = iteam2.map((item, index) => ({
  key: String(index + 1),
  icon: (
    <div className="flex items-center">
      {/* <a href={item.link}> */}
        {item.icon}
      {/* </a> */}
    </div>
  ),
  label: (
    <div className="flex items-center">
      {item.name}
      <span className="ml-2">{item.icon2}</span> {/* Move icon2 outside of the clickable area */}
    </div>
  )
}));


const Home: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout className="bg-neutral-900 px-28 h-lvh ">
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
        </Sider>



        <Layout>

          <Content className='bg-slate-800'>

            <div
              className='bg-red-500 hover:bg-red-700'
              style={{
                padding: 24,
                display: 'flex',
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <div className='items-center'>
                <Image
                  width={50}
                  className="rounded-full"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
              </div>

              <div className='text-left ml-5 bg-gray-200 h-full'>
                <h1 className='hover:text-red-500'>User: Hoài Lâm</h1>
                <h4>Thành viên đóng góp đáng kể</h4>
                <p>
                  Hồ Chí Minh: Phòng 12, Nhà 8, Đường số 13, Công viên phần mềm Quang Trung, P. Tân Chánh Hiệp, Q.12, TP.HCM, Quận 12 
                </p>

              </div>

            </div>
          </Content>
        </Layout>
      </Layout>
      
    </>
  );
};

export default Home;
