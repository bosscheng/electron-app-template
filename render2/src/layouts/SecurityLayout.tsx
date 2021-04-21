import React from 'react';
import {PageLoading} from '@ant-design/pro-layout';
import {Redirect, connect, ConnectProps} from 'umi';
import {stringify} from 'querystring';
import {ConnectState} from '@/models/connect';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  token?: string
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const {dispatch} = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchProfile',
      });
    }
  }

  render() {
    const {isReady} = this.state;
    const {children, loading, token} = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = token;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading/>;
    }
    if (!isLogin && window.location.pathname !== '/login') {
      return <Redirect to={`/login?${queryString}`}/>;
    }
    return children;
  }
}

export default connect(({user, loading}: ConnectState) => ({
  token: user.token,
  loading: loading.models.user,
}))(SecurityLayout);
