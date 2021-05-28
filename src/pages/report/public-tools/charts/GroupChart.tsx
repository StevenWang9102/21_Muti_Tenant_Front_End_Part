import React, { useEffect, useState } from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";

export const GroupChart = (props) => {
    const { sourceData, type } = props
    let dataSet = new DataSet();
    let dataView = dataSet.createView().source([]);
  
    dataView.transform({
      type: "fold",
      fields: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      key: "month",
      value: "amount"
    });

    useEffect(()=>{

      let data1 = {}
      let data2 = {}
      
      if (type === 'Sales') {
        data1 = sourceData[0] && sourceData[0][0]
        data2 = sourceData[1] && sourceData[1][0]
      }
  
      if (type === 'Profits') {
        console.log('sourceData[0]', sourceData[0]);
        console.log('sourceData[1]', sourceData[1]);
        
        data1 = sourceData[0] && sourceData[0][1]
        data2 = sourceData[1] && sourceData[1][1]
      }
  
      if (type === 'Transaction') {
        data1 = sourceData[0] && sourceData[0][2]
        data2 = sourceData[1] && sourceData[1][2]
      }
  
      const source = [data1, data2]
      if(source && source[0] && source[1]){
        dataView.source(source).transform({
          type: "fold",
          fields: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          key: "month",
          value: "amount"
        });
      }
  
    },[sourceData])
    
  return (
      <Chart height={400} data={dataView} forceFit style={{zIndex: 10}}>
        <Axis name="month" />
        <Axis name="amount" />
        <Legend />
        <Tooltip crosshairs={{ type: "y" }} />
        <Geom
          type="interval"
          position="month*amount"
          color={"name"}
          adjust={[{ type: "dodge", marginRatio: 1 / 32 }]}
        />
      </Chart>
  );
}

