import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

export default class Donut extends React.Component {
  
  render() {
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data = [
      {
        item: "事例一",
        count: 40
      },
      {
        item: "事例二",
        count: 21
      },
      {
        item: "事例三",
        count: 17
      },
      {
        item: "事例四",
        count: 13
      },
      {
        item: "事例五",
        count: 9
      }
    ];

    const data1 = this.props.data

    console.log('this.props,pie', this.props);
    console.log('this.props,data1', data1);

    var totalSales=0
    const source =[]
    data1.forEach(each => {
      console.log('this.props,each', each);

      totalSales= totalSales + each.totalInclGst
      source.push({
        item: each.categoryName,
        count: each.totalInclGst
      })
    });

    const dv = new DataView();
    
    dv.source(source).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    
    const cols = {
      percent: {
        formatter: val => {
          console.log('formatter,val', val);

          val = (val * 100).toFixed(2) + "%";
          return val;
        }
      }
    };

    return (
      <div>
        <Chart
          height={500}
          data={dv}
          scale={cols}
          padding={[20, 60, 20, 60]}
          forceFit
        >
          <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend
            position="bottom"
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Guide>
            <Html
              position={["50%", "50%"]}
              html={`
              <div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>
                Total Sales<br><span style=&quot;color:#262626;font-size:2.5em&quot;>
                $ ${totalSales.toFixed(2) || 0}</span></div>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              "item*percent",
              (item, percent) => {
                percent = percent * 100 + "%";
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ": " + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

