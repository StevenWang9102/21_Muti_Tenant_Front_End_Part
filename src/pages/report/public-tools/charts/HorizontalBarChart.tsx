import React, { useEffect, useState } from "react";
import { Chart, Geom, Axis, Tooltip, Coord, Label, } from "bizcharts";
import DataSet from "@antv/data-set";

export const HorizontalBarChart = (props) => {
  const { sourceData, type } = props

  let nameY = ''
  if (type === 'Transactions') nameY = 'Transactions'
  if (type === 'Sales') nameY = 'Sales'
  if (type === 'Profit') nameY = 'Profit'


  // 本地对数据进行变形
  const localSource = sourceData && sourceData.map(each => {
    return { x: each.x, [nameY]: Math.abs(each.y) }
  })

  console.log('HorizontalBarChart,sourceData', type, sourceData);
  console.log('HorizontalBarChart,localSource1', localSource);

  let dataSet = new DataSet();
  let dataView = dataSet.createView().source([]);

  useEffect(() => {
    if (sourceData && type && localSource && !localSource.margin) {

      const localSource = sourceData && sourceData.map(each => {
        return { x: each.x, [nameY]: Math.abs(each.y) }
      })

      console.log('HorizontalBarChart,localSource2', localSource);

      dataView.source(localSource)
      dataView.transform({
        type: "sort",
        callback(a, b) {
          console.log(typeof a.y);
          console.log(b);
          return a.y - a.y;
        }
      });
    }
  }, [sourceData]);


  return (
    <div style={{ width: '80%', height: 400 }}>

        <Chart
          data={dataView}
          height={400}
          padding={['auto', 45, 'auto', 'auto']}
          forceFit
        >
          <Coord transpose />
          <Axis name="x" />
          <Axis name="SSS1" visible={false} />
          <Tooltip />

          <Geom type="interval" position={`x*${nameY}`} > {/* Position 负责计算的 */}
            <Label content={`${nameY}`} offset={5} />  {/* content显示动态横坐标的样式 */}
          </Geom>
        </Chart>

    </div>
  );
}

