import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  QuestionCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Checkbox } from 'antd';

import {
  Input,
  Button,
  InputNumber,
  Modal,
  Tabs,
  Select,
  TreeSelect,
  notification,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import { displayDecimal } from '../../../public-component/decimail';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, { useState, useEffect } from 'react';
import { CreateUploader } from '../../../public-component/ImageCreater/CreateUploader';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
 
}

const CreateForm = ({
  clearMyBlob,
  categoriesTreeData,
  modalVisible,
  imagePathFromLibrary,
  setImagePathFromLibrary,
  form,
  handleAdd,
  handleModalVisible,
  itemList,
  fileList,
  setFileList,
  onOpenImagePoolClick,
  setIsSendToLibrary=()=>{},
  setMyBlob=()=>{},
}) => {
  
  const imagePath = null;
  // clearMyBlob
  const [previewVisible, setPreviewVisible] = useState(false);
  const [createVis, setCreateVis] = useState(false);
  const [warningSet, setWarningSet] = useState({});
  const [tabActiveKey, setTabActiveKey] = useState('1');
  const [imgeSource, setImageUploaderSrc] = useState('');

  const [gstValue, setGstValue] = useState('0.15');
  const [previewImageSrc, setPreviewImageSrc] = useState(gstValue ? `${imagePath}${gstValue}` : null);
  const [visiable, setVisiable] = useState(false);
  const [allItemNames, setAllItemName] = useState([]);
  const [allItemCodees, setAllItemCode] = useState([]);


  useEffect(() => {
    console.log('modalVisible', modalVisible);
    modalVisible && setFileList([]);
    modalVisible && setMyBlob(undefined);
    setWarningSet({})
    setTabActiveKey('1')
    setImageUploaderSrc('')
    modalVisible && setImagePathFromLibrary('')
    modalVisible && setIsSendToLibrary(false)
  }, [modalVisible]);

  useEffect(() => {
    if (!itemList.data) {
      const temp = itemList.map(each => each.name)
      const temp1 = itemList.map(each => each.code)
      setAllItemName(temp)
      setAllItemCode(temp1)
    }
  }, [itemList]);

  useEffect(() => {
    console.log('imagePathFromPool481', imagePathFromLibrary);
    
    if (imagePathFromLibrary != '') {
      setImageUploaderSrc(`${imagePathFromLibrary}`)
    }
  }, [imagePathFromLibrary]);

  console.log('CreateForm,allItemNames', allItemNames);


  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        for (let key in err) {
          notification['error']({ message: err[key]['errors'][0]['message'] });
        }
        return;
      }

      form.resetFields();
      console.log('fieldsValue=', fieldsValue);
      handleAdd(
        {
          ...fieldsValue,
          isService: true
        });
    });
  };

  const callback = (key: String) => {
    console.log(key);
    setTabActiveKey(key)
  };

  let currentValue = '';

  const onChange = (value) => {
    console.log(value);
    currentValue = value;
  };


  const handleCancel = () => setPreviewVisible(false);

  const checkItemName = (value) => {
    if (allItemNames.includes(value)) {
      var payload = {
        ...warningSet,
        itemName: 'error'
      }
      setWarningSet(payload)
    } else {
      var payload = {
        ...warningSet,
        itemName: 'success'
      }
      setWarningSet(payload)
    }
  }

  const checkBarCode = (value) => {
    console.log('checkBarCode,allItemCodees', allItemCodees);
    console.log('checkBarCode,value', value);

    if (allItemCodees.includes(value)) {
      var payload = {
        ...warningSet,
        code: 'error'
      }
      setWarningSet(payload)
    } else {
      var payload = {
        ...warningSet,
        code: 'success'
      }
      setWarningSet(payload)
    }
  }

  console.log('create,categoriesTreeData', categoriesTreeData);

  const style = { width: 20, opacity: 0, cursor: 'pointer' }
  const style1 = { width: 20, opacity: 1, cursor: 'pointer', color: '#1890FF' }

  return (
    <Modal
      destroyOnClose={true}
      afterClose={() => form.resetFields()}
      width={580}
      style={{zIndex: 20}}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={tabActiveKey == '1' ? [
        <Button key="forward" type="primary" onClick={() => setTabActiveKey('2')}>
          Next
        </Button>
      ] :
        [
          <Button key="forward" onClick={() => setTabActiveKey('1')}>
            Back
        </Button>,

          <Button key="forward" type="primary" onClick={() => okHandle()}>
            Create
        </Button>,
        ]}
    >
      <Tabs defaultActiveKey="1" activeKey={tabActiveKey} onChange={callback} type="card">
        <TabPane tab="Basic Information" key="1">
          <FormItem
            label="Button Name"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 13 }}
            validateStatus={warningSet['itemName']}
            help={warningSet['itemName'] === 'error' && 'This name has already exist.'}
          >
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: 'Name field is required.', min: 1 }],
            })(<Input
              onChange={(event) => checkItemName(event.target.value)}
            />)}
          </FormItem>

          <FormItem label="Description" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('description', {
              rules: [{ required: true, message: 'Description field is required.', min: 1 }],
            })(<Input />)}
          </FormItem>

          <FormItem label="Category" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('categoryId', {
              rules: [{ required: true, message: 'Category field is required.' }],
            })(
              <TreeSelect
                style={{ width: '100%' }}
                value={currentValue}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={categoriesTreeData && categoriesTreeData.filter(each => each.isInactive == false)}
                placeholder="Select a category..."
                treeDefaultExpandAll
                onChange={onChange}
              />,
            )}
          </FormItem>

          <FormItem
            label="Barcode"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 13 }}
            validateStatus={warningSet['code']}
            help={warningSet['code'] === 'error' && 'This code has already exist.'}
          >
            {form.getFieldDecorator('code', {})
              (<Input
                onChange={(event) => checkBarCode(event.target.value)}
              />)}
          </FormItem>

          <FormItem label="Moniker" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('moniker', {})(<Input />)}
          </FormItem>

          {/* -------------------------- Uploader -------------------------- */}
          <Modal
            width='500px'
            bodyStyle={{ width: 'auto', padding: '40px' }}
            visible={createVis}
            footer={null}
            onCancel={() => setCreateVis(false)}
          >
            <Row>
              <Col span={9}>
                <CreateUploader
                  createVis={createVis}
                  clearMyBlob={clearMyBlob}
                  fileList={fileList}
                  setFileList={(n) => setFileList(n)}
                  closeModel={() => setCreateVis(false)}
                  setImageUploaderSrc={(n) => setImageUploaderSrc(n)}
                />
              </Col>

              <Col span={14} offset={1}>
                <label>Do you want to upload this image to library as well?</label>
                <Checkbox 
                  onChange={(e)=>{
                    console.log(e.target.checked);
                    setIsSendToLibrary(e.target.checked)
                  }}
                  style={{marginLeft: 10}}
                ></Checkbox>
              </Col>
            </Row>


          </Modal>

          {/* -------------------------- Preview -------------------------- */}
          <Modal
            width='300px'
            visible={previewVisible}
            footer={null}
            onCancel={handleCancel}>
            <img
              style={{ width: '100%' }}
              src={previewImageSrc}
            />
          </Modal>

          <FormItem label="Picture" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} >
            {form.getFieldDecorator('picturePath', {
              initialValue: '',
              valuePropName: 'files',
            })(
              <Row gutter={[30, 16]} style={{ marginTop: '10px', marginBottom: '40px' }}>
                <Col span={12}>
                  
                  {/* 无图的情况，垫底 */}
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      border: `${imgeSource == '' ? '1px dashed gray' : ''}`,
                      position: 'absolute',
                      top: 0
                    }}
                  >
                    {imgeSource !== '' && <img src={imgeSource} alt='img' style={visiable ? { width: '100%', opacity: 0.3 } : { width: '100%' }} />}
                  </div>

                  {/* 有图的情况 */}
                  <div
                    onMouseOver={() => setVisiable(true)}
                    onMouseOut={() => setVisiable(false)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      width: 120,
                      height: 120,
                      padding: '40px 40px',
                      // border: '1px dashed gray',
                    }}
                  >
                    {imgeSource !== '' && <section>
                      <VisibilityIcon
                        style={visiable ? style1 : style}
                        onClick={() => {
                          if (imgeSource !== '') {
                            setPreviewVisible(true)
                            setPreviewImageSrc(imgeSource)
                          }
                        }}
                      />

                      <Popconfirm
                        title="Are you sure？"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => {
                          setFileList([])
                          setImagePathFromLibrary('')
                          setImageUploaderSrc('')
                          setMyBlob(undefined)
                        }}
                      >
                        <DeleteOutlineIcon
                          style={visiable ? { ...style1, ...{ color: 'red' } } : style}
                        />
                      </Popconfirm>
                    </section>}
                  </div>
                </Col>

                <Col span={11}>
                  <Button
                    style={{ width: 130 }}
                    onClick={() => { setCreateVis(true) }}
                  >
                    Image Uploader
                  </Button>

                  <Button
                    type='primary'
                    style={{ width: 130 }}
                    onClick={() => onOpenImagePoolClick()}
                  >
                    Image Library
                  </Button>

                </Col>
              </Row>
            )}
          </FormItem>

          <FormItem label="Note" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('note', {})(<TextArea />)}
          </FormItem>
        </TabPane>

        <TabPane tab="Settings" key="2">
          <FormItem label="Cost (Excl. GST)" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('costExclGst', {
              rules: [{ required: true, message: 'This field is required.' }],
            })(
              <InputNumber
                style={{ width: 215 }}
                onChange={(valueL) => {
                  form.setFieldsValue({ costExclGst: valueL })
                  form.setFieldsValue({ costInclGst: (valueL) * (1 + parseFloat(gstValue)) })
                }}
                formatter={(value) => displayDecimal(value)}
                min={0}
                precision={2}
              />,
            )}
          </FormItem>

          <FormItem label="Cost (Incl. GST)" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('costInclGst', {
              rules: [{ required: true, message: 'This field is required.' }],
              valuePropName: 'value'
            })(
              <InputNumber
                style={{ width: 215 }}
                min={0}
                precision={2}
                formatter={(value) => displayDecimal(value)}
                onChange={(valueL) => {
                  form.setFieldsValue({ priceInclGst: valueL })
                  form.setFieldsValue({ costExclGst: valueL / (1 + parseFloat(gstValue)) })
                }}
              />,
            )}
          </FormItem>

          <FormItem label="Price" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('priceInclGst', {
              rules: [{ required: true, message: 'Price field is required.' }],
              valuePropName: 'value'
            })(
              <InputNumber
                style={{ width: 215 }}
                min={0}
                precision={2}
                formatter={(value) => displayDecimal(value)}
              />,
            )}
          </FormItem>

          <FormItem label="GST Rate" labelCol={{ span: 7 }} wrapperCol={{ span: 13 }}>
            {form.getFieldDecorator('gstRate', {
              initialValue: gstValue,
            })(
              <Select
                defaultValue="0.15"
                value={gstValue}
                onChange={(value) => {
                  setGstValue(value)
                  const costExclGst = form.getFieldValue('costExclGst')
                  form.setFieldsValue({ costInclGst: costExclGst * (1 + parseFloat(value)) })
                }}
                style={{ width: '100%', maxWidth: 100 }}
              >
                <Option value="0.15">15%</Option>
                <Option value="0.12">12%</Option>
                <Option value="0.10">10%</Option>
                <Option value="0.08">8%</Option>
                <Option value="0.05">5%</Option>
              </Select>,
            )}
          </FormItem>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
