import React, { useState, useEffect } from 'react';
import { message, Upload, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/dist/antd.css';
import './index.less';
import { getToken } from '@/utils/authority';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const imagePath = null;

interface FileUpLoaderProps {
  value?: string;
  currentCatoryId: number;
  deleteButtonDisabled: boolean;
  updateImage?: (value: string) => void;
  setCurrentImagePath?: (value: string) => void;
}

export const FileUpLoader: React.FC<FileUpLoaderProps> = ({ 
  value, 
  deleteButtonDisabled,
  setCurrentImagePath,
  currentCatoryId,
 }) => {

  
  // 初始化的图片Load进来
  const propToFileList = value => {
    let fileList = [];

    console.log('teee value', value);
    
    if (value && Array.isArray(value) && value[0]) {
      value.forEach((item, index) => {
        fileList.push({
          uid: index,
          name: item,
          status: 'done',
          url: `${item}`,
        });
      });
    }
    console.log('FileUploader22, propToFileList, fileList=', fileList);
    return fileList;
  };

  console.log('currrentItemId79=',currentCatoryId);

  const [loading, setLoading] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState(value ? `${value}` : null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState(propToFileList([value]) || []);

  console.log('FileUploader22,deleteButtonDisabled', deleteButtonDisabled);
  console.log('FileUploader22,propToFileList', propToFileList([value]));
  console.log('FileUploader22,fileList=', fileList);
  
  useEffect(()=>{
    // alert('重载Uploader')
    // const imgInfo = propToFileList([value])
    // setFileList(imgInfo)
  }, [value])

  useEffect(()=>{
    const imgInfo = propToFileList([value])
    setFileList(imgInfo)
  }, [value])

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const onImageChange = info => {
    if (info.file.status === 'uploading')  setLoading(true);

    let fileList = info.fileList;
    fileList = fileList.map(file => {
      console.log('info.file.response', info.file.response);
      
      if (info.file.response) {
        let doneImagePath = info.file.response.replace(/\\/g, '/');
        if (doneImagePath) {
          file.url = `${imagePath}${doneImagePath}`;
        }
      }
      return file;
    });
    setFileList(fileList);

    console.log("info", info);
    console.log("info.file.status", info.file.status);
    
    if (info.file.status === 'done') {
      const doneImagePath = info.file.response.replace(/\\/g, '/');
      console.log("doneImagePath", doneImagePath);  
      setLoading(false);
      setCurrentImagePath(doneImagePath)
    } 
  };

  const handlePreview = file => {
    if (!file.url && !file.preview) {
      file.preview = file.url;
    }
    console.log('file55', file);
    console.log('file55.url', file.url);
    console.log('file55.preview', file.preview);
    
    if(file.url.includes(imagePath)){
      const myUrl = file.url.replace(/null/g, 'http://beautiesapi.gcloud.co.nz/')

      console.log('file55.myurl', myUrl);
      setPreviewVisible(true);
      setPreviewImageSrc(myUrl || file.preview);
    } else {
      setPreviewVisible(true);
      setPreviewImageSrc(file.url || file.preview);
    }

  };

  const handleRemove = file => {
    setFileList([])
    setCurrentImagePath('')
  };

  const handleCancel = () => setPreviewVisible(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div>
      <ImgCrop >
        <Upload
          disabled={currentCatoryId? false: true}
          style={{height: 60, width: 60}}
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          action={`/server/api/items/categories/${currentCatoryId}/images`}
          method="POST"
          headers={{ Authorization: 'Bearer ' + getToken() }}
          beforeUpload={beforeUpload}
          onChange={onImageChange}
          fileList={fileList}
          onPreview={handlePreview}
          onRemove={handleRemove}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      </ImgCrop>

      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img style={{ width: '100%' }} src={previewImageSrc} />
      </Modal>
    
    </div>
  );
};

