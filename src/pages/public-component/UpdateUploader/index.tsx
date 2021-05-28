import React, { useState, useEffect } from 'react';
import { message, Upload, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/dist/antd.css';
import './index.less';
import { getToken } from '@/utils/authority';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const serverPath = null;

interface FileUpLoaderProps {
  currentImagePath?: string;
  fromPage:string;
  fileList: any;
  setFileList: (value: any) => void;
  picturePathOfForm: string;
  disabled?: boolean;
  currentCatoryId?: string;
  currentItemId?: number;
  currentBundleId?: number;
  paymentModeId?: number;
  setCurrentImagePath: (value: string) => void;
}

export const FileUpLoader: React.FC<FileUpLoaderProps> = ({
  currentCatoryId,
  currentImagePath,
  currentItemId,
  fileList,
  setFileList,
  currentBundleId,
  fromPage,
  picturePathOfForm,
  paymentModeId,
  setCurrentImagePath,
 }) => {

  console.log('picturePathOfForm809,picturePathOfForm',picturePathOfForm);
  console.log('picturePathOfForm809,currentImagePath',currentImagePath);
  
  const server = 'http://beautiesapi.gcloud.co.nz/'
  const imagePath = (picturePathOfForm && picturePathOfForm !=='' && picturePathOfForm !=='undefined') ?
   `${server}${picturePathOfForm}`: ''
  
  var actions;
  if(fromPage == 'Category') actions = `/server/api/items/categories/${currentCatoryId}/images`
  if(fromPage == 'Item') actions = `/server/api/items/items/${currentItemId}/images`
  if(fromPage == 'Bundle') actions = `/server/api/items/bundles/${currentBundleId}/images`
  if(fromPage == 'PaymentMode') actions = `/server/api/settings/PaymentModes/${paymentModeId}/images`

  useEffect(()=>{
    setCurrentImagePath(picturePathOfForm || '')
  },[])


  useEffect(()=>{
    setFileList(myFileList)
  },[picturePathOfForm])


  useEffect(()=>{
    console.log('useEffect12,imagePath',imagePath);
    setCurrentImagePath(picturePathOfForm || '')
    const files = propToFileList([imagePath])
    if(imagePath =='' || imagePath == null || imagePath == undefined){
      setFileList([])
    } else {
      console.log('useEffect12,files',files);
      setFileList(files)
    }
  },[imagePath, currentCatoryId])


  // 初始化的图片Load进来
  const propToFileList = value => {
    console.log('propToFileList value=', value);
    let fileList = [];
    if (value && Array.isArray(value)) {
      value.forEach((item, index) => {
        fileList.push({
          uid: index,
          name: item,
          status: 'done',
          url: `${item}`,
        });
      });
    }
    console.log(' propToFileList, fileList=', fileList);
    return fileList;
  }

  const myFileList = imagePath? propToFileList([imagePath]) : []
  const [loading, setLoading] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState(imagePath ? `${serverPath}${imagePath}` : null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImageSrcLocal, setPreviewImageLocal] = useState('');


  const beforeUpload = file => {
      const name = file.name.slice(-3)
      console.log('beforeUpload4841,file',file);
      console.log('beforeUpload4841,file.name',file.name);
      console.log('beforeUpload4841,file.name',name);
      console.log('beforeUpload4841,file.type',file.type);

      const isLt2M = file.size / 1024 / 1024 < 2;
      const isJpgOrPng = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isNameJpgPng = (name == 'fif' || name == 'bmp' || name == 'svg' || name == 'psd' || name == 'WMF')
      
      console.log('beforeUpload,isNameJpgPng',isNameJpgPng);
      console.log('beforeUpload,isJpgOrPng',isJpgOrPng);
      console.log('beforeUpload,isLt2M',isJpgOrPng);

      if (!isJpgOrPng || isNameJpgPng) {
        message.error('You can only upload JPEG, GIF, PNG, JPG, TIF file!'); 
        return false
      } else if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        return false
      } else return true;
  };

 
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const onImageChange = info => {
    try{
        if (info.file.status === 'uploading')  setLoading(true);
      
        let fileList = info.fileList;

        console.log('onImageChange,fileList1',fileList);


        fileList = fileList.map(file => {
          if (info.file.response) {            
            let doneImagePath = info.file.response && info.file.response.replace(/\\/g, '/');
            if (doneImagePath) {
              file.url = `${server}${doneImagePath}`;
            }
          }
          return file;
        })

        console.log('onImageChange,fileList',fileList);
        

        setFileList(fileList);
        console.log('doneImagePath,info.status',info.file.status);

        if (info.file.status === 'done') {
          getBase64(info.file.originFileObj, imageUrl =>
           {
            console.log('doneImagePath,info.imageUrl',imageUrl);
            // 设置当前预览图片的地址, 并不适用服务器返回的渲染。
            setPreviewImageLocal(imageUrl)
           }
          );
        } 
        
        if (info.file.status === 'removed') {
          setLoading(false);
          setCurrentImagePath('')
        }
    } catch{
      message.error('Upload image fail. You can only upload JPEG, GIF, PNG, JPG, TIF file4!')
      setLoading(false);
    }
    
  };

  const handlePreview = file => {
    console.log('handlePreview,file',file);
    // 如果服务器的存在，使用服务器的预览，如果本地的存在，使用本地的预览
    if(previewImageSrcLocal ==''){
      if (!file.url && !file.preview) {
        file.preview = file.url;
      }
      setPreviewVisible(true);
      setPreviewImageSrc(file.url || file.preview);
    } else {
      setPreviewVisible(true);
      setPreviewImageSrc(previewImageSrcLocal);
    }
  };

  const handleRemove = file => {
    setFileList([])
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
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          fileList={fileList}

          beforeUpload={beforeUpload}
          onChange={onImageChange}
          onPreview={handlePreview}
          onRemove={handleRemove}
        >
          {fileList && fileList.length >= 1 ? null : uploadButton}
        </Upload>
      </ImgCrop>

      <Modal 
        width='300px'
        visible={previewVisible} 
        footer={null} 
        onCancel={handleCancel}>
        <img style={{ width: '100%' }} src={previewImageSrc} />
      </Modal>
    
    </div>
  );
};

