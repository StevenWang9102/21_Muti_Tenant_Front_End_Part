import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { history } from 'umi';
import { useLocation } from 'react-router-dom'

interface SalesTraceProps {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
}

// class SalesTrace extends Component<SalesTraceProps> {

const SalesTrace = (props) => {
  const { match, location, children } = props;
  console.log('children=', children);


  const handleTabChange = (key: string) => {
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'ordered':
        history.push(`${url}/ordered`);
        break;
      case 'pending':
        history.push(`${url}/pending`);
        break;
      case 'finished':
        history.push(`${url}/finished`);
        break;
      default:
        break;
    }
  };

  const isPrintPage = () => {
    const location = useLocation();
    return location.pathname.includes('print')
  }

  const getTabKey = () => {
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      return tabKey;
    }
    return 'ordered';
  };

  const tabList = [
    {
      key: 'ordered',
      tab: 'Unpaid Order',
    },
    {
      key: 'pending',
      tab: 'Pending Invoice',
    },
    {
      key: 'finished',
      tab: 'Finished Invoice',
    },
  ];

  return (

    <> {isPrintPage() ? <div>{children}</div> : <PageHeaderWrapper
      title="Sales Trace"
      tabList={tabList}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
    >
      {children}
    </PageHeaderWrapper>}
    </>

  );

}

export default connect()(SalesTrace);
