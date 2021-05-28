import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';

export const MiltLineChart = (props) => {

  const { source, type, tag } = props;
  const data1 = [];

  console.log('MiltLineChart,source', source);


  let max = 50;
  let heigh = 0
  let width: number | string = 0

  // ----------------------------- Daily Report -----------------------------
  if (type === 'DailyReport') {
    console.log(source);

    const mySource = source;
    heigh = 450
    width = 800

    console.log('mySource93', mySource);

    Array.isArray(mySource) && mySource.forEach((each, index) => {
      data1.push({
        x: each.x,
        tag: tag,
        amount: each.y,
      });

      if (each.y > max) { max = each.y; }
    });

    console.log(data1);

  } else {
  // ----------------------------- 其他 Report -----------------------------

    heigh = 450
    width = 800

    source &&
      source.forEach((each, index) => {
        let after = each.x > 12 ? 'pm' : 'am'
        data1.push({
          x: `${each.x}${after}`,
          tag: each.tag,
          amount: each.amount ,
          realAmount: each.amount * 10000,
        });

        if (each.amount > max) {
          max = each.amount;
        }
      });
  }

  const scale = {
    x: { range: [0, 1], alias: 'Hour' },
    amount: { max: max * 1.1, alias: 'Dolors' },
  };

  return (
    <Chart
      height={heigh}
      width={width}
      style={{ padding: 20, marginLeft: 'auto', marginRight: 'auto', }}
      data={data1}
      scale={scale}
      forceFit={false}
    >
      <Legend />
      <Axis name="x" />
      <Axis
        name="amount"
        label={{
          formatter: (val) => `${val / 1000}k`,
        }}
      />

      <Tooltip
        crosshairs={{
          type: 'y',
        }}
      />

      <Geom
        type="point"
        position="x*amount"
        size={2.5}
        shape={'circle'}
        color={'tag'}
        style={{
          stroke: '#fff',
          lineWidth: 1,
        }}
      />
      <Geom type="line" position="x*amount" size={2} color={'tag'} />
    </Chart>
  );
};