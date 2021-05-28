import { SketchPicker } from 'react-color'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, Select, message } from 'antd';
import { CategoriesTreeItem } from '../data.d';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, { useState } from 'react';
import { GithubPicker } from 'react-color';
import * as service from '../../categories/service';
import { CreateUploader } from '../../../public-component/CreateUploader/CreateUploader';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  createTreeHead: boolean;
  modalVisible: boolean;
  selectedTreeNode: Partial<CategoriesTreeItem>;
  handleAdd: (fieldsValue: CategoriesTreeItem) => void;
  handleModalVisible: () => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const {
    fileList,
    setFileList,
    createTreeHead,
    modalVisible,
    selectedTreeNode,
    form,
    handleAdd,
    handleModalVisible,
  } = props;
  const [color, setColor] = useState('#01579B');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  
  const okHandle = async () => {
    form.validateFields( async (err, fieldsValue) => {
      if (err) {
        return
      } else {
        try{
          await checkCategoryName(fieldsValue.name)
          form.resetFields();
          handleAdd(fieldsValue);
        } catch{
          message.error('This name has already exist.')
        }
      }
    });
  };

  const checkCategoryName = async(value)=>{
    const responese = await service.validateCategoryName({Name: value});
    console.log(responese);
  }

  const createTreeHeadForm = () => {
    return null;
  };

  const createTreeNodeForm = () => {
    return (
      <FormItem label="Category Parent">
        {form.getFieldDecorator('parentCategoryId', {
          rules: [
            {
              required: true,
              message: 'Please select category parent!',
            },
          ],
          initialValue: selectedTreeNode.id,
        })(
          <Select disabled={true}>
            <Option value={selectedTreeNode.id}>{selectedTreeNode.name}</Option>
          </Select>,
        )}
      </FormItem>
    );
  };

  const renderForm = () => {
    return createTreeHead ? createTreeHeadForm() : createTreeNodeForm();
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleChange = color => {
    console.log(color);
    setColor(color.hex);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };


  const styles = ({
    default: {
      colorPickerContainer: {
        display: 'flex',
      },
      input: {
        width: '50%',
      },
      color: {
        width: '100%',
        height: '22px',
        borderRadius: '2px',
        background: color,
      },
      swatch: {
        width: '50%',
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        marginRight: '5px',
      },
      popover: {
        position: 'absolute',
        top: '35px',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  const formTitle = createTreeHead ? 'Create New Category' : 'New Sub Category';
  const formItemLayout = {
    labelCol: {
      sm: { span: 8 },
      xs: { span: 24 },
    },
    wrapperCol: {
      sm: { span: 14 },
      xs: { span: 24 },
      md: { span: 10 },
    },
  };

  return (
    <Modal
      destroyOnClose
      title={formTitle}
      visible={modalVisible}
      width={600}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        {renderForm()}
        <FormItem label="Name">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'This field is required!',
                min: 1,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="Description">
          {form.getFieldDecorator('description', {
            rules: [
              {
                required: false,
                message: 'This field is required!',
                min: 1,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="Moniker">
          {form.getFieldDecorator('moniker', {
            rules: [
              {
                required: false,
                message: 'This field is required!',
                min: 1,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="Category Display Color">
          {form.getFieldDecorator('color', {
            initialValue: color,
            rules: [{ required: true, message: 'Please select a category display color.' }],
          })(
            <>
              <Input
                style={{ color: 'transparent', backgroundColor: `${color}`, width: 35, height: 35 }}
                onClick={() => handleClick()}
              />
              {displayColorPicker &&
                <GithubPicker
                  onChangeComplete={(e) => handleChange(e)}
                  onChange={() => setDisplayColorPicker(!displayColorPicker)}
                />}
            </>,
          )}
        </FormItem>

        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="Picture">
            {form.getFieldDecorator('picturePath', {
              initialValue: '',
              valuePropName: 'files',
            })(
              <CreateUploader
                fileList={fileList}
                setFileList={(n) => setFileList(n)}
              />,
            )}
          </FormItem>

        <FormItem label="Note">
          {form.getFieldDecorator('note', {
            rules: [{ message: 'This field is required!', min: 1 }],
          })(<TextArea />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
