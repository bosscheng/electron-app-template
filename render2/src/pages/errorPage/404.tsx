import {Button, Result} from 'antd';
import React from 'react';
import {history} from 'umi';


const NotFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="抱歉，你访问的页面丢了。"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default NotFoundPage;
