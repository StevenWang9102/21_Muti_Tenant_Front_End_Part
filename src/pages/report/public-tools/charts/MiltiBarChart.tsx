// data-set 可以按需引入，除此之外不要引入别的包
import React, { useEffect } from 'react';
import { Chart, Axis, Tooltip, Geom, View } from 'bizcharts';
import DataSet from '@antv/data-set';

const data = [
  { "label": '0.1', 'Sold Amount': 2800, 'Average Price': 2800, 'Sold Quantity': 2260, },
  { "label": '0.2', 'Sold Amount': 1800, 'Average Price': 1800, 'Sold Quantity': 1300, },
  { "label": '0.3', 'Sold Amount': 950, 'Average Price': 950, 'Sold Quantity': 900, },
  { "label": '0.4', 'Sold Amount': 500, 'Average Price': 500, 'Sold Quantity': 390, },
  { "label": '0.5', 'Sold Amount': 170, 'Average Price': 170, 'Sold Quantity': 100, },
  { "label": '0.6', 'Sold Amount': 170, 'Average Price': 170, 'Sold Quantity': 100, },
  { "label": '0.7', 'Sold Amount': 170, 'Average Price': 170, 'Sold Quantity': 100, },
  { "label": '0.8', 'Sold Amount': 170, 'Average Price': 170, 'Sold Quantity': 100, },
  { "label": '0.9', 'Sold Amount': 170, 'Average Price': 170, 'Sold Quantity': 100, },
  { "label": '1.0', 'Sold Amount': 170, 'Average Price': 170, 'Sold Quantity': 100, },
];


const scale = {
  总收益率: {
    type: 'linear',
    min: 0,
    max: 10,
  },
  value: {
    alias: ' '
  }
};


export const MiltiBarChart = (props) => {

  const { sourceData } = props

  // 创建图形界面
  let dataSet = new DataSet();
  let dataView = dataSet.createView().source([]); // 初始注入的数据

  // 数据变形一次
  dataView.transform({
    type: 'fold',
    fields: ['Sold Amount', 'Average Price', 'Sold Quantity'],
    key: 'type', 
    value: 'value', 
  }) 

  useEffect(() => {
    // 当异步数据载入是，重新set数据
    if(sourceData && !sourceData.totalSales){
     dataView.source(sourceData).transform({
      type: 'fold',
      fields: ['Sold Amount', 'Average Price', 'Sold Quantity'], 
      key: 'type', 
      value: 'value', 
    })
    }
  }, [sourceData])


  return (
    <Chart
      height={400}
      width={500}
      forceFit
      data={dataView}
      scale={scale}
      padding="auto"
    >
      <Axis name="label" />
      <Axis name="value" title={{ textStyle: { rotate: 0 } }} position={'left'} />
      <Tooltip />
      <Geom
        type="interval"
        position="label*value"
        color={['type', (value) => {
          if (value === 'Sold Amount') {
            return '#2b6cbb';
          }
          if (value === 'Average Price') {
            return '#41a2fc';
          }
          if (value === 'Sold Quantity') {
            return '#54ca76';
          } else {
            return '#54ca76';
          }
        }]}
        adjust={[{
          type: 'dodge',
          marginRatio: 1 / 32,
        }]}
      />
      <View data={data} >
        <Axis name="总收益率" position="right" />
      </View>
    </Chart>
  );
}
