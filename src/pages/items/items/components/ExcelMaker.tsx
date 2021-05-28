import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


// <ExcelColumn label="Button name" value="name"/>
// <ExcelColumn label="Description" value="description"/>
// <ExcelColumn label="Moniker" value="moniker"/>
// <ExcelColumn label="Is Service" value="service"/>
// <ExcelColumn label="Barcode(unique)" value="code"/>
// <ExcelColumn label="Note" value="note"/>


// <ExcelColumn label="Category" value="category"/>
// <ExcelColumn label="Cost(exclude gst)" value="cost"/>
// <ExcelColumn label="Price" value="price"/>

// <ExcelColumn label="GstRate" value="gst"/>
const dataSet1 = [
    {
        name: "Apple1",
        description: "Apple Description",
        moniker: 'Apple',
        service: true,
        code: 'FGIHO',
        note: 'Apple Note',
        category: "Fruits",
        cost: 10,
        price: 15,
        gst: 0.15
    },
    {
        name: "NZ Orange",
        description: "Orange Description",
        moniker: 'Orange',
        service: true,
        code: 'GKIHO',
        note: 'Orange Note',
        category: "Fruite02",
        cost: 15,
        price: 16,
        gst: 0.12
    },
];

export default class ExcelMaker extends React.Component {
    render() {
        return (
            <ExcelFile element={<a download="456">Download.</a>}>
                <ExcelSheet data={dataSet1} name="Templete">

                {/* public string Name { get; set; }
                public string Description { get; set; }
                public string Moniker { get; set; }
                public bool? IsService { get; set; }
                public string Code { get; set; }
                public string Note { get; set; }
                public string PicturePath { get; set; } // 去掉这个@@@@@@@@@@@@@@@@
                public int? CategoryId { get; set; }  // 不存在则新建，存在着自动填充
                public decimal? CostExclGst { get; set; }
                public decimal? PriceInclGst { get; set; }
                public double? GstRate{ get; set; } // 这个怎么处理呢？
                */}

                <ExcelColumn label="Button name" value="name"/>
                <ExcelColumn label="Description" value="description"/>
                <ExcelColumn label="Moniker" value="moniker"/>
                <ExcelColumn label="Is Service" value="service"/>
                <ExcelColumn label="Barcode(unique)" value="code"/>
                <ExcelColumn label="Note" value="note"/>
                

                <ExcelColumn label="Category" value="category"/>
                <ExcelColumn label="Cost(exclude gst)" value="cost"/>
                <ExcelColumn label="Price" value="price"/>

                <ExcelColumn label="GstRate" value="gst"/>
                 
                </ExcelSheet>

            </ExcelFile>
        );
    }
}