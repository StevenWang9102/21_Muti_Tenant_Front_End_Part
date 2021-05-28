import ImgCrop from 'antd-img-crop';
import { Upload, Modal, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
// import { getToken } from '@/utils/authority';

export const CreateUploader = ({ fileList, setFileList }) => {
  const [loading, setLoading] = useState(false);
  const [localFile, setLocalFile] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState(null);

  const handleRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

   
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handlePreview = file => {
    setPreviewVisible(true);
    setPreviewImageSrc(previewImageSrc);
  };

  const handleCancel = () => setPreviewVisible(false);

  const beforeUpload = (file) => {
    const name = file.name.slice(-3)
    console.log('beforeUpload4841,file', file);
    console.log('beforeUpload4841,file.name', file.name);
    console.log('beforeUpload4841,file.name', name);
    console.log('beforeUpload4841,file.type', file.type);

    const isLt2M = file.size / 1024 / 1024 < 2;
    const isJpgOrPng = (file.type === 'image/jpeg' || file.type === 'image/png')
    const isNameJpgPng = (name == 'fif' || name == 'bmp' || name == 'svg' || name == 'psd' || name == 'WMF')

    console.log('beforeUpload,isNameJpgPng', isNameJpgPng);
    console.log('beforeUpload,isJpgOrPng', isJpgOrPng);
    console.log('beforeUpload,isLt2M', isJpgOrPng);

    if (!isJpgOrPng || isNameJpgPng) {
      message.error('You can only upload JPEG, GIF, PNG, JPG, TIF file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      setFileList([...fileList, file]);
      return true
    };
  };

  const server = 'http://beautiesapi.gcloud.co.nz/'
  const onImageChange = info => {
    try{
        if (info.file.status === 'uploading')  setLoading(true);
      
        let fileList = info.fileList;
        fileList = fileList.map(file => {
          if (info.file.response) {            
            let doneImagePath = info.file.response && info.file.response.replace(/\\/g, '/');
            if (doneImagePath) {
              file.url = `${server}${doneImagePath}`;
            }
          }
          return file;
        })

        setLocalFile(fileList);
        console.log('doneImagePath,info.status',info.file.status);

        if (info.file.status === 'done') {
          getBase64(info.file.originFileObj, imageUrl =>
           {
            console.log('doneImagePath,info.imageUrl',imageUrl);
            // 设置当前预览图片的地址, 并不用服务器返回的渲染。
            setPreviewImageSrc(imageUrl)
           }
          );
        } 

        if (info.file.status === 'removed') {
          setLoading(false);
        }
    } catch{
      message.error('Upload image fail. You can only upload JPEG, GIF, PNG, JPG, TIF file2!')
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <section>
      <ImgCrop>
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          onPreview={handlePreview}
          onChange={onImageChange}
          onRemove={handleRemove}
          beforeUpload={beforeUpload}
          fileList={localFile}
        >
          {localFile && localFile.length >= 1 ? null : uploadButton}
        </Upload>
      </ImgCrop>

      <Modal 
        width='300px'
        visible={previewVisible} 
        footer={null} 
        onCancel={handleCancel}>
        <img style={{ width: '100%' }} src={previewImageSrc} />
      </Modal>

    </section>
  );
};