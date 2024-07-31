//footer 
import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <Layout>

      <AntFooter style={{ textAlign: 'center' }} className='bg-slate-700'>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </AntFooter>
    </Layout>

  );
};

export default Footer;