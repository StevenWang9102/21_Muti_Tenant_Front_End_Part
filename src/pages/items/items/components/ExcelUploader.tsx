import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import readXlsxFile from 'read-excel-file'

export const ExcelUploader = ({
  postData,
  filesData,
  setFileData
}) => {
  // const [fileList, updateFileList] = useState([]);

  const props = {
    // fileList,
    beforeUpload: file => {
      console.log('file07', file);
      console.log('file07.type', file.type);
      
      let myMessage = []
      const isSpreedSheet = file.type.includes('spreadsheetml.sheet')
      const isMyTemplete = file.name.includes('Download')
      
      if (!isSpreedSheet) {
        myMessage.push(`${file.name} is not a .xlsx file`)
      }

      if (!isMyTemplete) {
        myMessage.push(`You need use the templete you have download.`)
      }

      if(myMessage.length !==0) message.error(myMessage.join(`. `))

      return isSpreedSheet && isMyTemplete;
    },

    onChange: info => {

      if(info.file && info.file.status == 'done') {
        console.log('OnChange1841', info);

        setFileData(info.fileList)
       }
    },
  };

  return (
    <Upload 
      {...props}
      fileList={filesData}
    >
      <Button icon={<UploadOutlined />}>Upload A Excel</Button>
    </Upload>
  );
};
