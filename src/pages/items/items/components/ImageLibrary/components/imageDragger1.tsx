import React, { useState, useEffect } from 'react';
import { Upload, message, Button, Modal, Input } from 'antd';
import { getToken } from '@/utils/authority';
import ImgCrop from 'antd-img-crop';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export const ImageDragger1 = ({
    inputImageName,
    setInputName,
    onUploadFinished,
    selectedCategoryId,
}) => {

    const [fileList, setFileList] = useState([])
    const [visible, setVisible] = useState(false)

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
        }
        else return true;
    };

    const props = {
        name: 'file',
        onChange(info) {
            const { status } = info.file;
            console.log('onChange.info', info);
            console.log('onChange.status', status);
            console.log('onChange.info.fileList', info.fileList);

            const fileList = [info.fileList[0].originFileObj]

            if (status === 'done') {
                setVisible(true)
                setFileList(fileList)
            } else if (status === 'error') {
                setFileList([])
                message.error(`File upload failed.`);
            }
        },
    };

    const uploadImageToGallery = () => {
        const hide = message.loading('Loading')

        const formData = new FormData();
        const name = fileList[0].name;
        const config = { type: fileList[0].type }
        const uploadedName = `(${selectedCategoryId})(${inputImageName})${name}`
        const myFile = new File(fileList, uploadedName, config);

        console.log('handleImageUpload,name=', name);
        console.log('handleImageUpload,type=', fileList[0].type);
        console.log('handleImageUpload,myFile=', myFile);

        formData.append('file', myFile);

        fetch(`/server/api/items/uploadToGallery`, {
            method: 'POST',
            headers: { authorization: `Bearer ${getToken()}` },
            body: formData,
        })
            .then((response) => response.text())
            .then((response) => {
                hide()
                console.log('handleImageUpload,response', response);
            }).catch(() => {
                message.error('Upload Failed.')
            });

        // 完成上传后跳转并且清空
        setTimeout(function () {
            hide()
            onUploadFinished()
            setFileList([])
            setVisible(false)
        }, 700)
    }

    const getAuth = () => {
        const gposToken = getToken();
        console.log('getAuthHeader(gposToken).gposToken', gposToken);
        return `Bearer ${gposToken}`;
    }

    return (
        <section>
            <ImgCrop>
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

            <Modal
                title='Picture Name'
                maskClosable={true}
                visible={visible}
                destroyOnClose={true}
                onCancel={() => setVisible(false)}
                width='450px'
                bodyStyle={{ padding: '40px 60px' }}
                footer={[
                    <Button
                        type="primary"
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                            if (inputImageName == '') {
                                message.error('You need input an image name.');
                            } else {
                                uploadImageToGallery()
                                
                            }
                        }}
                    >
                        Comfirm
                    </Button>,
                    <Button
                        onClick={() => setVisible(false)}
                    >
                        Cancel
                    </Button>]}
            >
                <Input
                    // placeholder="Please input picture name."
                    width={'100%'}
                    onChange={(event) => {
                        console.log('value41506', event);
                        setInputName(event.target.value)
                    }}
                ></Input>
            </Modal>
        </section>
    );
}
