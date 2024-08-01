import React from 'react';
import '../styles/globals.css';
import { Layout, Menu, theme, Image } from 'antd';
import TableDemo from '../components/Table/Table'
import CarouselDemo from '../components/Courses/Courses'
import DropdownMenuCheckboxes from '../components/DropdownMenu/DropdownMenu'
import Profile from '../pages/profile'



const { Content, Sider } = Layout;

const invoices2 = [
  {
    invoice: "Vay hãm không lối thoát",
    img: "https://bloganchoi.com/wp-content/uploads/2023/07/the-roundup-no-way-out-movie-review-2023-3-1.jpg",
    author: "Ma Dong Seok"

  },
  {
    invoice: "Vay hãm không lối thoát 2",
    img: "https://i.imgur.com//olgEJLE.jpg",
    author: "Ma Dong Seok"


  },
  {
    invoice: "Spiderman No Way Home",
    img: "https://thanhnien.mediacdn.vn/Uploaded/nhuvnq/2021_11_17/poster-3930.jpg",
    author: "Ma Dong Seok"


  },
  {
    invoice: "The Dark Knight Rises",
    img: "https://images.mubicdn.net/images/film/87065/cache-48290-1635149421/image-w1280.jpg",
    author: "Ma Dong Seok"


  },
  {
    invoice: "Aquaman: Đế vương Atlantis",
    img: "https://i-giaitri.vnecdn.net/2023/12/24/aquaman-2-1-jpeg-1703384264-8104-1703384605.jpg",
    author: "Ma Dong Seok"

  }
]

const invoices = [
  {
    invoice: "Nhà Giả Kim",
    img: "https://danhkhoireal.vn/wp-content/uploads/2023/06/Nha-gia-kim.jpg",
    author: "Ma Dong Seok"

  },
  {
    invoice: "Nhà Giả Kim",
    img: "https://danhkhoireal.vn/wp-content/uploads/2023/06/Nha-gia-kim.jpg",
    author: "Ma Dong Seok"


  },
  {
    invoice: "Nhà Giả Kim",
    img: "https://danhkhoireal.vn/wp-content/uploads/2023/06/Nha-gia-kim.jpg",
    author: "Ma Dong Seok"


  },
  {
    invoice: "Nhà Giả Kim",
    img: "https://danhkhoireal.vn/wp-content/uploads/2023/06/Nha-gia-kim.jpg",
    author: "Ma Dong Seok"


  },
  {
    invoice: "Nhà Giả Kim",
    img: "https://danhkhoireal.vn/wp-content/uploads/2023/06/Nha-gia-kim.jpg",
    author: "Ma Dong Seok"

  }
]

const invoices3 = [
  {
    invoice: "Suyết nữa thì",
    img: "https://i.ytimg.com/vi/cUmpJ2zwfVU/maxresdefault.jpg",
    author: "Andiez"
  },
  {
    invoice: "Đi cùng em remix",
    img: "https://i.ytimg.com/vi/vZItSREB-3g/maxresdefault.jpg",
    author: "Andiez"
  },
  {
    invoice: "Sống xa anh",
    img: "https://images2.thanhnien.vn/zoom/686_429/Uploaded/nhith/2017_10_28/22789030_1750403834979580_72232644504707987_n_MWBI.jpg",
    author: "Bảo Anh"
  },
  {
    invoice: "Gặp nhau năm ta 60",
    img: "https://cdn.tuoitre.vn/thumb_w/480/471584752817336320/2023/12/22/img4676-1703241787511268795781.png",
    author: "Orange"
  },
  {
    invoice: "Nơi này có anh",
    img: "https://baogiaothong.mediacdn.vn/files/nga.le/2017/02/08/148649666967095-15895410-1925493017678548-30153218272872017-n-1486481570222-1413.jpg",
    author: "Sơn Tùng M-TP"
  }
]

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
    <div className="flex items-center text-black">
      {item.name}
      <span className="ml-2 text-white">{item.icon2}</span>
    </div>
  )
}));


const Home: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout className="bg-slate-400 px-28 h-full ">
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
          <Menu className="bg-slate-300 border-black" theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
        </Sider>
        <Layout>
          <Content className=''>
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
                  {/* <TableDemo array={invoices} name="Books"/>
                  <TableDemo array={invoices2} name="Films"/>
                  <TableDemo array={invoices3} name="Musics"/> */}
                  <Profile />
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
      
    </>
  );
};

export default Home;
