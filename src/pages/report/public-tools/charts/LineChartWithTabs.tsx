import React from 'react';
import { Tabs } from 'antd';
import { Bar } from 'ant-design-pro/lib/Charts';
import { thisWeekDaysFormated, lastWeekDaysFormated } from '../../public-tools/functions/dates';
const { TabPane } = Tabs;

export const LineChartWithTabs = (props) => {
  const {
    totalSaleSourceData,
    profitsSourceData,
    invoiceSourceData,
    fromPage,
    source,
    setCurrentTabKey,
    searchType,
  } = props;

  let sourceDataLocal = [[], [], []];

  // --------------- 来自 Branch Report ---------------
  if (fromPage === 'BranchReport') {
    sourceDataLocal = source;
  } else if (fromPage === 'Item') {
    // 转化数据结构
    var indexedSource = {};
    source &&
      source.forEach((each) => {
        indexedSource[each.invoiceDate.slice(0, 10)] = {
          totalInclGst: each.totalInclGst,
          profitInclGst: each.profitInclGst,
          itemQuantity: each.itemQuantity,
        };
      });

    var weekData = searchType === 'This Week' ? thisWeekDaysFormated : lastWeekDaysFormated;

    if (source) {
      for (let i = 0; i < 7; i++) {
        let weekDay = weekData[i];

        sourceDataLocal[0].push({
          x: weekDay,
          y: indexedSource[weekDay] ? indexedSource[weekDay].totalInclGst : 0,
        });

        sourceDataLocal[1].push({
          x: weekDay,
          y: indexedSource[weekDay] ? indexedSource[weekDay].profitInclGst : 0,
        });

        sourceDataLocal[2].push({
          x: weekDay,
          y: indexedSource[weekDay] ? indexedSource[weekDay].itemQuantity : 0,
        });
      }
    }
  } else {
  }

  const flag1 = fromPage === 'Item' || fromPage === 'BranchReport';
  const flag2 = fromPage !== 'Item' && fromPage !== 'BranchReport';
  const heigh = 400;

  return (
    <>
      {flag1 && (
        <Tabs
          defaultActiveKey="1"
          centered={true}
          tabPosition="left"
          onTabClick={(key) => {
            setCurrentTabKey(key);
          }}
          style={{ backgroundColor: 'white', padding: 40 }}
        >
          <TabPane tab="Total Sales" key="1">
            <Bar height={heigh} title="" data={sourceDataLocal[0]} />
          </TabPane>

          <TabPane tab="Profit" key="2">
            <Bar height={heigh} title="" data={sourceDataLocal[1]} />
          </TabPane>

          <TabPane tab="Transactions" key="3">
            <Bar height={heigh} title="" data={sourceDataLocal[2]} />
          </TabPane>
        </Tabs>
      )}

      {flag2 && (
        <Tabs
          onTabClick={(key) => {
            setCurrentTabKey(key);
          }}
          defaultActiveKey="1"
          centered={true}
          tabPosition="left"
          style={{ backgroundColor: 'white', padding: 40 }}
        >
          <TabPane tab={fromPage === 'Payment' ? '' : 'Total Sales'} key="1">
            <Bar height={heigh} title="" data={totalSaleSourceData} />
          </TabPane>

          {fromPage !== 'Payment' && (
            <>
              <TabPane tab="Profit" key="2">
                <Bar height={heigh} title="" data={profitsSourceData} />
              </TabPane>

              <TabPane tab="Transactions" key="3">
                <Bar height={heigh} title="" data={invoiceSourceData} />
              </TabPane>
            </>
          )}
        </Tabs>
      )}
    </>
  );
};
