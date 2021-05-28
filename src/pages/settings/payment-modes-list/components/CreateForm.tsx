import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, InputNumber, Tabs, message } from 'antd';
import { TableListItem } from '../data';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React, {useState, useEffect } from 'react';
import { CreateUploader } from '../../../public-component/CreateUploader/CreateUploader';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: TableListItem) => void;
  handleModalVisible: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ 
  modalVisible, 
  form,
  paymentNames,
  handleAdd, 
  handleModalVisible, 
  fileList, 
  setFileList 
}) => {

  useEffect(()=>{
    setWarningSet({})
  },[modalVisible])

  const [warningSet, setWarningSet] = useState({});

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      if (fieldsValue.name.toLowerCase() === 'cash') {
        message.error('Cash is default mode. You can not use this word.')
      } else {
        form.resetFields();
        handleAdd(fieldsValue);
      }
    });
  };

  const checkItemName = (value)=>{
    const paymentNamesPool = paymentNames && paymentNames.map(each=>each.name.toLowerCase())
    console.log('CreatForm,paymentNamesPool', paymentNamesPool);

    if(paymentNamesPool.includes(value.toLowerCase())){
      var payload = {
        ...warningSet,
        name: 'error'
      }
      setWarningSet(payload)
    } else { 
      var payload = {
        ...warningSet,
        name: 'success'
      }
      setWarningSet(payload) 
    }
  }

  return (
    <Modal
      destroyOnClose
      title="New Payment Mode"
      width={600}
      visible={modalVisible}
      onOk={()=>{ if(warningSet && warningSet.name == 'success') okHandle()}
    }
      style={{ padding: 60 }}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        label="Name"
        labelCol={{ span: 7 }} 
        wrapperCol={{ span: 14 }} 
        validateStatus={warningSet['name']}
        help={warningSet['name'] ==='error' && 'This name has already exist.'}
        >
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please enter a name.', min: 1 }],
        })(<Input onChange={(event)=> checkItemName(event.target.value)}
        />)}
      </FormItem>

      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} label="Moniker">
        {form.getFieldDecorator('moniker', {
          rules: [{ required: false, message: 'Please enter a moniker of at least one characters!', min: 1 }],
        })(<Input />)}
      </FormItem>

      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} label="Picture">
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

      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 14 }} label="Note">
        {form.getFieldDecorator('note', {})(<TextArea />)}
      </FormItem>

    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
