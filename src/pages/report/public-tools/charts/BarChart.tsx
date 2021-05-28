import React from 'react';
import { Tabs } from 'antd';
import { Bar } from 'ant-design-pro/lib/Charts';
const { TabPane } = Tabs;

interface BarChartInterface {
  totalSaleSourceData?: any,
  profitsSourceData?: any,
  invoiceSourceData?: any,
  searchType?: string,
  fromPage: string,
  source: any,
}

export const BarChart = (props: BarChartInterface) => {
  const {
    totalSaleSourceData,
    profitsSourceData,
    invoiceSourceData,
    fromPage,
    source,
  } = props;

  console.log('BarChart110,source',source);
  console.log('BarChart110,profitsSourceData',profitsSourceData);

  const sourceData = profitsSourceData && profitsSourceData.map(each=>{
    return {
      x: each.x,
      y: Math.abs(each.y)
    }
  })

  let sourceDataLocal = [[], [], []];

  if (fromPage === 'BranchReport') {
    sourceDataLocal = source
  } else if (fromPage === 'DailyReport') {
    sourceDataLocal = source;
  } else if (fromPage === 'ItemDailyReport') {
    sourceDataLocal = source;
  } else {
  }

  const heigh = 320;

  console.log('sourceDataLocal1841',sourceDataLocal);
  console.log('sourceDataLocal1841[1]',sourceDataLocal[1]);

  const profit = sourceDataLocal[1] && sourceDataLocal[1].map(each=>{
    return {
      x: each.x,
      y: Math.abs(each.y) 
    }
  })
  

  return (
    <>
      {/* ---------------------------------------- Payment ---------------------------------------- */}
      {fromPage === 'Payment' && (
        <Bar 
          style={{ backgroundColor: 'white', zIndex: 22 }}
          height={heigh} 
          title="" 
          data={totalSaleSourceData} />
      )}

      {/* --------------------------------------- ---------------------------------------- */}
      {(fromPage === 'ItemDailyReport' 
      || fromPage === 'BranchReport' 
      || fromPage === 'DailyReport') && (
        <Tabs
          defaultActiveKey="1"
          centered={true}
          tabPosition="left"
          style={{ backgroundColor: 'white', padding: '10 0' }}
        >
          <TabPane tab="Total Sales" key="1">
            <Bar height={heigh} title="" data={sourceDataLocal[0]} />
          </TabPane>

          <TabPane tab="Profit" key="2">
            <Bar height={heigh} title="" data={profit} />
          </TabPane>

          <TabPane tab="Transactions" key="3">
            <Bar height={heigh} title="" data={sourceDataLocal[2]} />
          </TabPane>
        </Tabs>
      )}

      {/* ---------------------------------------- 其他情况 ---------------------------------------- */}
      {(fromPage !== 'Payment' && fromPage !== 'ItemDailyReport' && fromPage !== 'BranchReport' && fromPage !== 'DailyReport') && (
        <Tabs
          style={{ backgroundColor: 'white', padding: 0, zIndex: 22 }}
          defaultActiveKey="1"
          centered={true}
          tabPosition="left"
        >
          <TabPane tab={fromPage === 'Payment' ? undefined : 'Total Sales'} key="1">
            <Bar height={heigh} title="" data={totalSaleSourceData} />
          </TabPane>

          <TabPane tab="Profit" key="2" style={{zIndex: 11, padding: 0}} >
            <Bar height={heigh} style={{zIndex: 11}} title="" data={sourceData} />
          </TabPane>

          <TabPane tab="Transactions" key="3">
            <Bar height={heigh} title="" data={invoiceSourceData} />
          </TabPane>
        </Tabs>
      )}
    </>
  );
};
