import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Modal, message, Tabs } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { TableListItem } from '../data.d';
import { FileUpLoader } from '../../../public-component/UpdateUploader';
import { getToken } from '@/utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
  picturePath? : string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueType) => void;
  handleUpdate: (values: FormValueType) => void;
  setCurrentImagePath: (values: string) => void;
  imagePath: string;
  updateImagePath: (values: string) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}

export interface UpdateFormState {
  formVals: FormValueType;
  fileList: any;
  warningSet: any;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      fileList: [],
      warningSet: {},
    };
  }

  handleUpdate = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };

      console.log('formVals154',formVals);

      console.log('handleUpdate184,this.state.fileList',this.state.fileList);
      console.log('handleUpdate184,this.props.imagePath',this.props.imagePath);
      
      // 打印出来进行判断（双重判断）
      const itemId = formVals.id
      if (this.state.fileList.length !== 0) {
        this.props.imagePath == '' && this.requestImageUrl(itemId)
      } else {
        this.props.updateImagePath(itemId, '')
      }
      
      this.setState(
        { formVals, },
        () => {
          if (formVals.name.toLowerCase() === 'cash') {
            message.error('Cash is default mode. You can not use this word.')
          } else {
            handleUpdate(formVals);
          }
        },
      );
    });
  };

  requestImageUrl = async (itemId) => {
    const { fileList } = this.state
    if (fileList.length > 0) {
      const formData = new FormData();
      var blob = new Blob([fileList[0].originFileObj], { type: fileList[0].type })

      formData.append('file', blob, fileList[0].name);
      const actions = `/server/api/settings/PaymentModes/${itemId}/images`

      fetch(actions, {
        method: 'POST',
        headers: { authorization: `Bearer ${getToken()}` },
        body: formData,
      })
        .then((response) => response.text())
        .then((response) => {
          this.props.updateImagePath(itemId, response)
        })
        .catch();
    }
  };

  renderContent = (formVals: FormValueType) => {
    const { form } = this.props;

    console.log('renderContent=',this.props);
    console.log('renderContent,formVals=',formVals);

    const imagePath =
    formVals.picturePath &&
    formVals.picturePath !== '' &&
    !formVals.picturePath.includes('The picture is not selected.') &&
    `http://beautiesapi.gcloud.co.nz/${formVals.picturePath}`;

    return [
      <TabPane tab='Edit Payment Mode' key="1">
        <FormItem 
          label="Name"
          labelCol={{ span: 7 }} 
          wrapperCol={{ span: 14 }}
          validateStatus={this.state.warningSet['name']}
          help={this.state.warningSet['name'] ==='error' && 'This name has already exist.'}
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please enter a name of at least one characters!', min: 1 }],
            initialValue: formVals.name,
          })(<Input  onChange={(event)=> this.checkItemName(event.target.value)} />)}
        </FormItem>

        <FormItem 
          label="Moniker"
          labelCol={{ span: 7 }} 
          wrapperCol={{ span: 14 }} 
        >
          {form.getFieldDecorator('moniker', {
            initialValue: formVals.moniker,
          })(<Input />)}
        </FormItem>

        <FormItem
          label="Picture"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
        >
          {form.getFieldDecorator('picturePath', { 
            initialValue: imagePath, // 注意此处可能是null
          })(
            <FileUpLoader
              fileList={this.state.fileList}
              setFileList={(m) => this.setState({ fileList: m})}
              currentCatoryId='currentCatoryId'
              fromPage='PaymentMode'
              paymentModeId={formVals.id}
              picturePathOfForm={formVals.picturePath}
              setCurrentImagePath={this.props.setCurrentImagePath}
            />,
          )}
        </FormItem>

        <FormItem
          label="Note"
          labelCol={{ span: 7 }} 
          wrapperCol={{ span: 14 }} 
        >
          {form.getFieldDecorator('note', {
            initialValue: formVals.note,
          })(<TextArea/>)}
        </FormItem>
      </TabPane>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        Cancel
      </Button>,
      <Button key="forward" type="primary" onClick={() => {
        console.log('handleUpdate, this.state.warningSet',this.state.warningSet);
        if(this.state.warningSet && this.state.warningSet.name == 'success') this.handleUpdate()
      }}>
        Update
      </Button>,
    ];
  };

  checkItemName = (value)=>{
    const { paymentNames }=this.props
    const { formVals } = this.state;

    console.log('checkItemName,paymentNames', paymentNames);
    
    const paymentNamesPool = paymentNames && paymentNames.map(each=>each.name)

    if(paymentNamesPool.includes(value) && value!== formVals.name){
      var payload = {
        ...this.state.warningSet,
        name: 'error'
      }
      this.setState({warningSet: payload })
    } else { 
      var payload = {
        ...this.state.warningSet,
        name: 'success'
      }
      this.setState({warningSet: payload })
    }
  }

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values  } = this.props;
    const { formVals } = this.state;

    console.log('PaymenMode,formVals',formVals);
    
    const callback = (key: String) => {
      console.log(key);
    }
    
    return (
      <Modal
        width={600}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={callback}>
          {this.renderContent(formVals)}
        </Tabs>
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
