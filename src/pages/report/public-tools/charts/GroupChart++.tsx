import React, { useEffect, useState } from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";

export const GroupChart = ({ sourceData, type }) => {

    let data1 = {}
    let data2 = {}

    
    if (type === 'Sales') {
      data1 = sourceData[0] && sourceData[0][0]
      data2 = sourceData[1] && sourceData[1][0]
    }

    if (type === 'Profits') {
      data1 = sourceData[0] && sourceData[0][1]
      data2 = sourceData[1] && sourceData[1][1]
    }

    if (type === 'Transactions') {
      data1 = sourceData[0] && sourceData[0][2]
      data2 = sourceData[1] && sourceData[1][2]
    }

    const source = [data1, data2]
    const dataSet = new DataSet();
    const dv = dataSet.createView().source(source);
  
    dv.transform({
      type: "fold",
      fields: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      key: "month",
      value: "amount"
    });

  return (
    <div>
      <Chart height={400} data={dv} forceFit>
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
    </div>
  );
}

