import React from 'react';
import '../styles/globals.css'
import { 
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined, } from '@ant-design/icons';
import { Layout, Menu, theme, Image } from 'antd';


const { Content, Sider } = Layout;

// const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
//   (icon, index) => ({
//     key: String(index + 1),
//     icon:  <div className="flex items-center">

//       <a href={`/chat${index + 1}`}>
//         <Image
//           width={50}
//           className="rounded-full"
//           src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
//         />
//       </a>
//   </div>,
//     label: `Groups ${index + 1}`,
//   }),
// );


const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: (
      <div className="flex items-center">
        {index >= 1 ? (
          <a href={`/test`}>
            <Image
              width={50}
              className="rounded-full"
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </a>
        ) : (
          <Image
            width={50}
            className="rounded-full"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        )}
      </div>
    ),
    label: `Groups ${index + 1}`,
    
  })
);


const Home: React.FC = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (


    <>
      <Layout className="bg-neutral-900 px-28 h-lvh">
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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>


      <Content className='bg-slate-800'>

          {/* <div
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
            </div> */}
        </Content>
    </Layout>
    </>
  );
};

export default Home;



