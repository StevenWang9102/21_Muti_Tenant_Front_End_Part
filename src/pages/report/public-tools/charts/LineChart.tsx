import React from 'react';
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import { month } from '../../public-tools/functions/dates'

let scale;

interface LineChartInterface {
  fromPage: string,
  type: string,
  source: any,
  searchType: string,
}

export const LineChart = (props: LineChartInterface) => {
  const { source, type, fromPage, searchType } = props
  let sourceData = []
  let filter;
  
  console.log('LineChart,source',source);
  

  // --------------------------- Item ---------------------------
  if (fromPage === 'ItemDailyReport') {

    filter = [
      ['type', (tag) => {
        if (tag === type) return true;
        return false;
      },
      ],
    ]

    scale = {
      axleY: { min: 0 },
      axleX: { 
        alias: "日期",
        type: "time",
        mask: "DD/MMM",
        range: [0.05, 1.00],
        },
    };

    scale = {
      axleY: { min: 0 },
      axleX: { 
        alias: "日期",
        type: "time",
        mask: "DD/MMM",
        range: [0.05, 1.00],
        },
    };

    if (searchType === 'Only_Date_Search' || 
    searchType === 'Branch_Date_Search' ||
    searchType === 'Last Three Month' || searchType === 'Last Month' || searchType === 'This Month' 
    ) {
      if (source) {
        for (let i = 0; i < source.length; i++) {          
          sourceData.push({
            type: type,
            axleX: source[i].x,
            axleY: Math.abs(source[i].y)
          })
        }
      }
    } else {
      if (source) {
        for (let i = 0; i < source.length; i++) {
          sourceData.push({
            type: type,
            axleX: source[i].x,
            axleY: Math.abs(source[i].amount),
          })
        }
      }
    }
  } else if (fromPage === 'DailyReport') {
    
    // --------------------------- DailyReport ---------------------------
    filter = [
      ['type', (tag) => {
        if (tag === type) return true;
        return false;
      }],
    ]

    scale = {
      axleY: { min: 0 },
      axleX: { 
        alias: "日期",
        type: "time",
        mask: "DD/MMM",
        range: [0.05, 1.00],
        },
    };

    if (source) {
      for (let i = 0; i < source.length; i++) {
        console.log(source[i]); 

        let slicedX = source[i].x.slice(1, 2)
        let axleXS = '00'

        if(['5', '0'].includes(slicedX)){
          axleXS =  source[i].x
        }

        console.log(slicedX);
        console.log(axleXS);

        sourceData.push({
          type: type,
          axleX: source[i].x,
          axleXS: axleXS,
          axleY: Math.abs(source[i].y)
        })
      }
    }

  } else {
    // --------------------------- Others ---------------------------
    const yearArray = []
    filter = [
      ['type', (tag) => {
        if (tag === type) return true;
        return false;
      },
      ],
    ]

    scale = {
      axleY: { min: 0 },
      axleX: { 
        alias: "日期",
        type: "time",
        mask: "DD/MMM",
        range: [0.05, 1.00],
        },
    };

    for (let i = 0; i < 30; i++) {
      if (i < 10) {
        yearArray.push(`0${i + 1}/${month + 1}`)
      } else {
        yearArray.push(`${i + 1}/${month + 1}`)
      }
    }

    let attribute
    if (type === 'Sales') attribute = "totalInclGst"
    if (type === 'Profit') attribute = "profitInclGst"
    if (type === 'Transactions') attribute = "itemQuantity"

    if (source) {
      for (let i = 0; i < 30; i++) {
        sourceData.push({
          type: type,
          axleX: yearArray[i],
          axleY: source[i] ? Math.abs(source[i][attribute]) : 0
        })
      }
    }
  }
  
  return (
    <Chart
      filter={filter}
      height={400}
      data={sourceData}
      scale={scale}
      forceFit
    >
      <Axis name="1" />
      <Axis name="2" />
      <Legend />
      <Tooltip crosshairs={{ type: 'y' }} />
      <Geom type="line" position="axleX*axleY" size={2} color="type" />
      <Geom
        type="point"
        position="axleX*axleY"
        size={2}
        shape={'circle'}
        style={{ stroke: '#fff', lineWidth: 1 }}
        color="type"
      />
    </Chart>
  );
};
