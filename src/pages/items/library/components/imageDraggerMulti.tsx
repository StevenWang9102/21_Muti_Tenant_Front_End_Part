import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { getToken } from '@/utils/authority';
import ImgCrop from 'antd-img-crop';
import ReactCrop from 'react-image-crop';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;


export const ImageDragger = ({
    onUploadFinished,
}) => {

    const [fileList, setFileList] = useState([])

    const beforeUpload = file => {
        const name = file.name.slice(-3)
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
        } else return true;
    };

    const props = {
        name: 'file',
        multiple: true,
        action: '/server/api/items/uploadToGallery',
        onChange(info) {
            const { status } = info.file;
            console.log('onChange.info', info);

            // const temp = [...fileList]
            // temp.push(info.file)

            // console.log('onChange.temp', temp);
            // setFileList(temp)

            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }

            // if (status === 'done') {
            //     message.success(`File uploaded successfully.`);

            //     // 完成上传后跳转并且清空
            //     // setTimeout(function () {
            //     //     onUploadFinished()
            //     //     setFileList([])
            //     // }, 700)

            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
        },
    };


    const getAuth = () => {
        const gposToken = getToken();
        console.log('getAuthHeader(gposToken).gposToken', gposToken);
        return `Bearer ${gposToken}`;
    }


    return (
        <>
            <ImgCrop modalTitle='Title111'>
                <Dragger
                    style={{ padding: 10 }}
                    {...props}
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    headers={{ authorization: getAuth() }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. You can only upload JPEG, GIF, PNG, JPG, TIF file. Image must smaller than 2MB!
                    </p>
                </Dragger>
            </ImgCrop>

            {/* {fileList.map(each => {
                return (<div>
                    <ImgCrop modalTitle='Title111'>
                        <Dragger
                            style={{ padding: 10 }}
                            {...props}
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            headers={{ authorization: getAuth() }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single upload. You can only upload JPEG, GIF, PNG, JPG, TIF file. Image must smaller than 2MB!
                            </p>
                        </Dragger>
                    </ImgCrop>
                </div>)
            })} */}
        </>
    );
}
