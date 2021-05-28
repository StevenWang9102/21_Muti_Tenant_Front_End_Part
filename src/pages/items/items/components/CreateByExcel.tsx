import React, { useState } from 'react';
import {
  Col,
  Row,
  Select,
  message,
} from 'antd';
import { ExcelUploader } from './ExcelUploader'
import ExcelMaker from './ExcelMaker'

const { Option } = Select;

export const CreateByExcel = ({
  filesData,
  postData,
  setFileData,
}) => {

  return (
    <>
      <div style={{ margin: 10 }}> <span style={{ fontWeight: 700 }}>Step 1</span>: Download template excel. <ExcelMaker/></div>
      <div style={{ margin: 10 }}> <span style={{ fontWeight: 700 }}>Step 2</span>: Upload your excel with your items data.</div>
      
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
