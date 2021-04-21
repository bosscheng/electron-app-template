import {
  LockTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import {Alert, Space, Button} from 'antd';
import React from 'react';
import ProForm, {ProFormText} from '@ant-design/pro-form';
import {connect, Dispatch} from 'umi';
import {StateType} from '@/models/login';
import {LoginParamsType} from "@/api/login";
import {ConnectState} from '@/models/connect';
import styles from './index.less';

interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const {userLogin = {}, submitting} = props;
  const {status} = userLogin;

  const handleSubmit = (values: LoginParamsType) => {
    const {dispatch} = props;
    dispatch({
      type: 'login/login',
      payload: {...values},
    });
  };
  return (
    <div className={styles.main}>
      <h3 className={styles.title}>
        系统登录
      </h3>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => {
          console.log(values);
          handleSubmit(values);
        }}
      >
        {status === 'error' && !submitting && (
          <LoginMessage
            content="账户或密码错误"
          />
        )}
        <>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon}/>,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名"
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockTwoTone className={styles.prefixIcon}/>,
            }}
            placeholder='密码'
            rules={[
              {
                required: true,
                message: '请输入密码'
              },
            ]}
          />
        </>
      </ProForm>
    </div>
  );
};

export default connect(({login, loading}: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
