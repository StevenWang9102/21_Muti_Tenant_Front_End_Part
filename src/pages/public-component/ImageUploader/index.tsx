import React, { useState, useEffect } from 'react';
import { Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getAuthHeader, getAuthHeaderOfImage, getToken } from '@/utils/authority';
import ImgCrop from 'antd-img-crop';

const server = 'http://beautiesapi.gcloud.co.nz/'

export const ImageUploader = ({
  itemId,
  updateImagePath,
  uploadImageToLibrary,
  closeModal,
  imageUploaderVis,
}) => {

  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  useEffect(()=>{
    setFileList([])
  }, [imageUploaderVis])

  const getAuth = () => {
    const gposToken = getToken();
    console.log('getAuthHeader(gposToken).gposToken', gposToken);
    return `Bearer ${gposToken}`;
  }

  const beforeUpload = file => {
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

  const handleChange = info => {
    try {
      if (info.file.status === 'uploading') setLoading(true);
      let tempFile = info.fileList;

      tempFile = tempFile.map(file => {
        if (info.file.response) {
          let doneImagePath = info.file.response && info.file.response.replace(/\\/g, '/');
          if (doneImagePath) {
            file.url = `${server}${doneImagePath}`;
          }
        }
        return file;
      })

      console.log('onImageChange,fileList', tempFile);
      console.log('doneImagePath,info.file', info.file);

      setFileList(tempFile);

      if (info.file.status === 'done') {
        const doneImagePath = info.file.response.replace(/\\/g, '/');
        setLoading(false);

        // 更新图库传递图, 以及Item的图片
        uploadImageToLibrary(fileList)
        updateImagePath(itemId, doneImagePath)

        setTimeout(() => {
          closeModal()
        }, 100)
      }

      if (info.file.status === 'removed') {
        setLoading(false);
      }
    } catch {
      message.error('Upload image fail. You can only upload JPEG, GIF, PNG, JPG, TIF file4!')
      setLoading(false);
    }

  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  console.log('getAuth18', getAuth());

  return (
    <ImgCrop >
      <Upload
        style={{ width: 50, height: 50 }} // 正确
        name="file"  // 正确
        listType="picture-card"// 正确
        className="avatar-uploader" // 正确
        fileList={fileList} // 正确
        beforeUpload={beforeUpload}// 正确
        action={`/server/api/items/items/${itemId}/images`}
        headers={{ authorization: getAuth() }}
        onChange={handleChange}
      >
        {fileList && fileList.length >= 1 ? null : uploadButton}
      </Upload>
    </ImgCrop>
  );
}