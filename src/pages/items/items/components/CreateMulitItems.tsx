import React, { useState } from 'react';
import {
  Col,
  Row,
  Select,
  message,
} from 'antd';
import { ExcelUploader } from './ExcelUploader'
import ExcelMaker from '../components/ExcelMaker'

const { Option } = Select;

export const CreateMulitItems = ({
  filesData,
  postData,
  setFileData,
  filtedCategoryId,
  setFiltedCategoryId,
  categories,
  gstRate,
  setGstRage,
}) => {

  return (
    <>
      <div style={{ margin: 10 }}><span style={{ fontWeight: 700 }}>Step 1</span>: Please Select a Category.</div>
      <Row>
        <Col span={12} >
          <Select
            showSearch
            style={{ width: 200, marginLeft: 54, marginBottom: 20 }}
            value={filtedCategoryId}
            placeholder="Select a category"
            optionFilterProp="children"
            onChange={(id) => { setFiltedCategoryId(id) }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {categories.map(each => {
              return <Option value={each.id}>{each.name}</Option>
            })}
          </Select>
        </Col>
      </Row>

      <div style={{ margin: 10 }}><span style={{ fontWeight: 700 }}>Step 2</span>: Please Select Gst Rate.</div>
      
      <Row>
        <Col span={12} >
          <Select
            showSearch
            style={{ width: 200, marginLeft: 54, marginBottom: 20 }}
            value={gstRate}
            placeholder="Select a gst rate"
            optionFilterProp="children"
            onChange={(value) => { setGstRage(value) }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={0.15}>15%</Option>
            <Option value={0.12}>12%</Option>
            <Option value={0.10}>10%</Option>
            <Option value={0.08}>8%</Option>
            <Option value={0.05}>5%</Option>
          </Select>
        </Col>
      </Row>

      <div style={{ margin: 10 }}> <span style={{fontWeight: 700}}>Attention</span>: 01 In the excel below, button name, cost, price is essential. 02 Barcode is unique.</div>
      <div style={{ margin: 10 }}> <span style={{ fontWeight: 700 }}>Step 3</span>: Download template excel. <ExcelMaker/></div>
      <div style={{ margin: 10 }}> <span style={{ fontWeight: 700 }}>Step 4</span>: Upload your excel with your items data.</div>
      
      <Row>
        <div style={{ marginLeft: 54, marginTop: 13 }}>
          <ExcelUploader
            postData={postData}
            filesData={filesData}
            setFileData={setFileData}
          />
        </div>
      </Row>
    </>
  );
};
