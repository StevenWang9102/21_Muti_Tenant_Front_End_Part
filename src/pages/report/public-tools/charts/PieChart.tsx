import React, { useEffect, useState } from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';

const scale = {
  percent: {
    formatter: (val) => {
      let value;
      value = val * 100;
      value = value.toFixed(2);
      return `${value} %`;
    },
  },
};

function getXY(c, { index: idx = 0, field = 'percent', radius = 0.5 }) {
  const d = c.get('data');
  if (idx > d.length) return;
  const scales = c.get('scales');
  let sum = 0;
  for (let i = 0; i < idx + 1; i++) {
    let val = d && d[i] && d[i][field];
    if (i === idx) {
      val = val / 2;
    }
    sum += val;
  }
  const pt = {
    y: scales[field].scale(sum),
    x: radius,
  };
  const coord = c.get('coord');
  let xy = coord.convert(pt);
  return xy;
}

export const PieChart = (props) => {
  const { fromPage, allReportData, searchType, paymentWithQuery, currentTabKey, sourceData } = props;
  const [ mySourceData, setSourceData] = useState([]);

  const handleSalesReport =()=>{
    let renderData = [];
      var data = [];
      let temp;
      if (currentTabKey === '1') temp = allReportData[0];
      if (currentTabKey === '2') temp = allReportData[1];
      if (currentTabKey === '3') temp = allReportData[2];
      if (searchType === 'Today') renderData = paymentWithQuery;
      else renderData = temp || [];

      if (renderData == []) {
        data.push({
          item: 'NULL',
          count: 100,
        });
      } else {
        if (renderData) {
          for (let i = 0; i < renderData.length; i++) {
            data.push({
              item: renderData[i].x,
              count: renderData[i].y,
            });
          }
        }
      }
      setSourceData(data);
  }

  const handleBranchReport = ()=>{
    let renderData = [];
      var data = [];
      renderData = allReportData[currentTabKey] || [];
      renderData = renderData.filter(each=>each.x !='')
      console.log('handleBranchReport,renderData', renderData);
      
      if (renderData == []) {
        data.push({
          item: 'NULL',
          count: 100,
        });
      } else {
        if (renderData) {
          for (let i = 0; i < renderData.length; i++) {
            data.push({
              item: renderData[i].x,
              count: renderData[i].y,
            });
          }
        }
      }
      setSourceData(data);
  }

  const handleOtherReport =()=>{
    let renderData = [];
      var data = [];
      if (searchType === 'Today') renderData = paymentWithQuery;
      else if (searchType === 'Yesterday') renderData = paymentWithQuery;
      else if (searchType === 'This Week') renderData = paymentWithQuery;
      else if (searchType === 'This Month') renderData = paymentWithQuery;
      else if (searchType === 'Last Week') renderData = paymentWithQuery;
      else if (searchType === 'Last Month') renderData = paymentWithQuery;
      else if (searchType === 'Last Three Month') renderData = paymentWithQuery;
      else if (searchType === 'Only_Date_Search') renderData = paymentWithQuery;
      else if (searchType === 'Branch_Date_Search') renderData = paymentWithQuery;
      else renderData = allReportData || [];

      if (renderData == []) {
        data.push({
          item: 'NULL',
          count: 100,
        });
      } else {
        if (renderData) {
          for (let i = 0; i < renderData.length; i++) {
            data.push({
              item: renderData[i].paymentModeName,
              count: renderData[i].amountInclGst,
            });
          }
        }
      }
      setSourceData(data);
  }

  // ----------------------- SalesReport 、 BranchReport -----------------------
  useEffect(() => {
    if (fromPage === 'SalesReport') {
      handleSalesReport()
    } else if (fromPage === 'BranchReport') {
      handleBranchReport()
    } else {
      handleOtherReport()
    }
  }, [allReportData, paymentWithQuery]);

  // ----------------------- CategoryBranchReport 、 ItemBranchReport -----------------------
  useEffect(() => { 
    console.log('CategoryBranchReport;sourceData',sourceData);
    
    if (fromPage === 'CategoryBranchReport' || fromPage === 'ItemBranchReport') {
      var data = [];
      if (sourceData == []) {
        data.push({ item: 'NULL',  count: 100, });
      } else { 
        data = sourceData || []  
      }      
      setSourceData(data); } 
  }, [sourceData]);

  const { DataView } = DataSet;
  const dv = new DataView();

  dv.source(mySourceData).transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent',
  });

  return (
    <Chart
      style={{marginTop: -60}}
      height={600}
      data={dv}
      scale={scale}
      padding={[100,70,70,100]} // 同样是上有下左的顺序
      forceFit
      onGetG2Instance={(c) => {
        const xy = getXY(c, { index: 0 });
        c.showTooltip(xy);
      }}
    >
      <Coord type="theta" radius={0.85} />
      <Axis name="percent" />

      {/* ----------------- 右侧工具条 ----------------- */}
      <Tooltip
        showTitle={false}
        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      />

      <Geom
        type="intervalStack"
        position="percent"
        color="item"
        tooltip={[
          'item*percent',
          (item, percent) => {
            // percent = (percent * 100).toFixed(4);
            console.log('tooltip,item',item);
            console.log('tooltip,percent',percent);

            return {
              name: item,
              value: `${percent*100} %` ,
            };
          },
        ]}
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
      >
        <Label
          content="percent"
          formatter={(val, item) => {return item.point.item + ': ' + val }}
        />
      </Geom>
    </Chart>
  );
};
