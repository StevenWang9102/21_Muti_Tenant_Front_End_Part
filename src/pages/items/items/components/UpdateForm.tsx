import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message, Input, Modal, Select, TreeSelect, Tabs, InputNumber, Switch, notification } from 'antd';
import React, { Component, useState, useEffect } from 'react';
import { FileUpLoader } from '../../../public-component/UpdateUploader';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { TableListItem } from '../data.d';
import { TreeNodeType } from '../../categories/components/TreeSearch';
import { BranchItemTabPane } from './BranchItemTabPane';
import { displayDecimal } from '../../../public-component/decimail';
import { getToken } from '@/utils/authority';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const leftColumn = 8;
const rightColumn = 11;

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueType) => void;
  handleUpdate: (values1: FormValueType, values2: FormValueType) => void;
  handleBranchItemUpdate: (values: FormValueType, values1: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  categoriesTreeData: TreeNodeType[];
  currentItemId: number;
}

export interface UpdateFormState {
  formVals: FormValueType;
  value: any;
  isInput: boolean;
  currentBranchName: string;
  currentBranchId: number;
  allBranchInformation: any;
  fileList: any;
  warningSet: object;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => { },
    handleBranchItemUpdate: () => { },
    handleUpdateModalVisible: () => { },
    values: {},
  };

  constructor(props: UpdateFormProps) {
    super(props);
    console.log('UpdateForm=', props);

    this.state = {
      formVals: {
        name: props.values.name,
        description: props.values.description,
        moniker: props.values.moniker,
        priceInclGst: props.values.priceInclGst,
        costExclGst: props.values.costExclGst,
        picturePath: props.values.picturePath,
        isService: props.values.isService,
        note: props.values.note,
        isInactive: props.values.isInactive,
        code: props.values.code,
        gstRate:
          props.values.gstRate.toString() == '0.1' ? '0.10' : props.values.gstRate.toString(),
        categoryId: props.values.categoryName,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      value: null,
      isInput: false,
      currentBranchName: '',
      currentBranchId: this.props.currentBranchId,
      allBranchInformation: [],
      fileList: [],
      warningSet: {},
    };
  }

  onUpdateClicked = () => {
    const { form } = this.props;
    const { formVals } = this.state;
    const curentFormValues = form.getFieldsValue();

    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error('Update failed, please check your input.');
        return;
      }
      this.props.handleUpdate(formVals, curentFormValues);
      this.props.handleBranchItemUpdate(formVals, curentFormValues);
    });
  };

  requestImageUrl = async (itemId) => {
    const { fileList } = this.state
    console.log('requestImageUrl,fileList', fileList);

    if (fileList.length > 0) {
      const formData = new FormData();
      var blob = new Blob([fileList[0].originFileObj], { type: fileList[0].type })

      formData.append('file', blob, fileList[0].name);
      const actions = `/server/api/items/items/${itemId}/images`

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

  switchKeytoTitle = (categoriesTreeData) => {
    const temp = {};
    categoriesTreeData.forEach((each) => (temp[each.key] = each.title));
    return temp;
  };

  openNotification = (name) => {
    const args = {
      message: 'Notification',
      description:
        `If you reset this ${name}. Every branches\' price will be changed.`,
      duration: 3,
    };
    notification.open(args);
  };

  onCategorySelectorChange = (key) => {
    const { categoriesTreeData } = this.props;
    this.switchKeytoTitle(categoriesTreeData);
  };

  checkItemName = (value) => {
    const { warningSet, formVals } = this.state
    const { allItemNames } = this.props

    const currentName = formVals && formVals.name
    const index = allItemNames.indexOf(currentName)

    if (index > -1) allItemNames.splice(index, 1)

    console.log('checkItemName,currentName', currentName);
    console.log('checkItemName,allItemName', allItemNames);

    if (allItemNames.includes(value)) {
      var payload = {
        ...warningSet,
        itemName: 'error'
      }
      this.setState({ warningSet: payload })
    } else {
      var payload = {
        ...warningSet,
        itemName: 'success'
      }
      this.setState({ warningSet: payload })
    }
  }

  checkBarCode = (value) => {
    const { warningSet, formVals } = this.state
    const { allProps } = this.props
    const itemData = allProps.itemsData.data.list || []
    console.log('checkBarCode, allProps', allProps);
    console.log('checkBarCode, itemData', itemData);
    const allCodes = itemData.map(each => {
      if (each.code) return each.code
      else return 'NULL'
    })
    console.log('checkBarCode, allCodes', allCodes);
    console.log('checkBarCode, formVals', formVals);

    const currentBarcode = formVals && formVals.code
    console.log('checkBarCode, currentBarcode', currentBarcode);

    const index = allCodes.indexOf(currentBarcode)
    console.log('checkBarCode, index', index);

    if (index > -1) allCodes.splice(index, 1)

    if (allCodes.includes(value)) {
      var payload = {
        ...warningSet,
        barcode: 'error'
      }
      this.setState({ warningSet: payload })
    } else {
      var payload = {
        ...warningSet,
        barcode: 'success'
      }
      this.setState({ warningSet: payload })
    }
  }

  // ------------------------ 主体内容 ------------------------
  renderContent = (formVals1: FormValueType) => {
    const { form, categoriesTreeData, setCurrentImagePath } = this.props;
    const { warningSet } = this.state;
    const formVals = this.state.formVals;
    console.log('this.props=', this.props);
    console.log('this.state=', this.state);
    console.log('this.state,formVals=', this.state.formVals);

    const imagePath =
      formVals.picturePath &&
      formVals.picturePath !== '' &&
      !formVals.picturePath.includes('The picture is not selected.') &&
      `http://beautiesapi.gcloud.co.nz/${formVals.picturePath}`;

    console.log('imagePath887', typeof imagePath);
    console.log('categoriesTreeData',categoriesTreeData);
    

    return [
      <TabPane tab="Basic Information" key="1">
        <FormItem
          label="Button Name"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn }}
          validateStatus={warningSet['itemName']}
          help={warningSet['itemName'] === 'error' && 'This name has already exist.'}
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: 'This field is required.', min: 1 }],
            initialValue: formVals && formVals.name,
          })(<Input
            onChange={(event) => this.checkItemName(event.target.value)}
          />)}
        </FormItem>

        <FormItem
          label="Description"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn }}
        >
          {form.getFieldDecorator('description', {
            rules: [{ required: true, message: 'This field is required.', min: 1 }],
            initialValue: formVals && formVals.description,
          })(<Input />)}
        </FormItem>

        <FormItem
          label="Category"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn }}
        >
          {form.getFieldDecorator('categoryId', {
            initialValue: formVals && formVals.categoryId,
            rules: [{ required: true, message: 'This field is required.' }],
          })(
            <TreeSelect
              style={{ width: '100%' }}
              value={formVals && formVals.categoryId} // To set the current selected treeNode(s)
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={categoriesTreeData}
              placeholder="Select a category..."
              treeDefaultExpandAll
              onChange={(key) => {
                this.onCategorySelectorChange(key);
              }}
            />,
          )}
        </FormItem>

        <FormItem
          label="Barcode"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn }}
          validateStatus={warningSet['barcode']}
          help={warningSet['barcode'] === 'error' && 'This barcode has already exist.'}
        >
          {form.getFieldDecorator('code', {
            initialValue: formVals && formVals.code,
          })(
            <Input
              onChange={(event) => this.checkBarCode(event.target.value)}
            />)}
        </FormItem>

        <FormItem
          label="Moniker"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn }}
        >
          {form.getFieldDecorator('moniker', {
            initialValue: formVals && formVals.moniker,
          })(<Input />)}
        </FormItem>

        <FormItem label="Note" labelCol={{ span: leftColumn }} wrapperCol={{ span: rightColumn }}>
          {form.getFieldDecorator('note', {
            initialValue: formVals && formVals.note,
          })(<TextArea />)}
        </FormItem>

        {/* <FormItem
          label="Picture"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn }}
        >
          {form.getFieldDecorator('picturePath', {
            initialValue: imagePath,
          })(
            <FileUpLoader
              fromPage='Item'
              currentCatoryId='currentCatoryId'
              fileList={this.state.fileList}
              setFileList={(n) => this.setState({ fileList: n })}
              currentItemId={this.props.currentItemId}
              picturePathOfForm={formVals.picturePath}
              setCurrentImagePath={setCurrentImagePath}
            />,
          )}
        </FormItem> */}
      </TabPane>,

      <TabPane tab="Item Settings" key="2">
        <FormItem
          label="Cost (Excl. GST)"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn - 1 }}
          validateStatus={warningSet['costExclGst']}
          help={warningSet['costExclGst'] === 'error' && `If you reset this cost, Every branch's cost will be changed.`}
        >
          {form.getFieldDecorator('costExclGst', {
            rules: [{ required: true, message: 'Please enter a cost!' }],
            initialValue: formVals && formVals.costExclGst,
          })(
            <InputNumber
              onChange={(value) => {
                form.setFieldsValue({ costInclGst: value * (1 + parseFloat(form.getFieldValue('gstRate'))) })
              }}
              onFocus={() => {
                var payload = { ...warningSet, costExclGst: 'error' }
                this.setState({ warningSet: payload })
              }}
              onBlur={() => {
                var payload = { ...warningSet, costExclGst: 'success' }
                this.setState({ warningSet: payload })
              }}
              style={{ width: 215 }}
              formatter={(value) => displayDecimal(value)}
              min={0}
              precision={2}
            />,
          )}
        </FormItem>

        <FormItem
          label="Cost (Incl. GST)"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn - 1 }}
          validateStatus={warningSet['costInclGst']}
          help={warningSet['costInclGst'] === 'error' && `If you reset this cost, Every branch's cost will be changed.`}
        >
          {form.getFieldDecorator('costInclGst', {
            rules: [{ required: true, message: 'Please enter a cost!' }],
            initialValue: formVals && formVals.costExclGst * (1 + parseFloat(form.getFieldValue('gstRate'))),
          })(
            <InputNumber
              onChange={(value) => {
                form.setFieldsValue({ costExclGst: value / (1 + parseFloat(form.getFieldValue('gstRate'))) })
              }}
              onFocus={() => {
                var payload = { ...warningSet, costInclGst: 'error' }
                this.setState({ warningSet: payload })
              }}
              onBlur={() => {
                var payload = { ...warningSet, costInclGst: 'success' }
                this.setState({ warningSet: payload })
              }}
              style={{ width: 215 }}
              formatter={(value) => displayDecimal(value)}
              min={0}
              precision={2}
            />,
          )}
        </FormItem>

        <FormItem
          label="Price (Incl. GST)"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn - 1 }}
          validateStatus={warningSet['price']}
          help={warningSet['price'] === 'error' && `If you reset this price, Every branch's price will be changed.`}
        >
          {form.getFieldDecorator('priceInclGst', {
            rules: [{ required: true, message: 'Please enter a price!' }],
            initialValue: formVals && formVals.priceInclGst,
          })(
            <InputNumber
              onFocus={() => {
                var payload = { ...warningSet, price: 'error' }
                this.setState({ warningSet: payload })
              }}
              onBlur={() => {
                var payload = { ...warningSet, price: 'success' }
                this.setState({ warningSet: payload })
              }}
              style={{ width: 215 }}
              formatter={(value) => displayDecimal(value)}
              min={0}
              precision={2}
            />,
          )}
        </FormItem>

        <FormItem
          label="Gst Rate"
          labelCol={{ span: leftColumn }}
          wrapperCol={{ span: rightColumn }}
        >
          {form.getFieldDecorator('gstRate', {
            initialValue: `${formVals && formVals.gstRate}`,
          })(
            <Select style={{ width: '100px' }} defaultValue={`${formVals && formVals.gstRate}`}>
              <Option value="0.15">15%</Option>
              <Option value="0.12">12%</Option>
              <Option value="0.10">10%</Option>
              <Option value="0.08">8%</Option>
              <Option value="0.05">5%</Option>
            </Select>,
          )}
        </FormItem>
      </TabPane>,

      // ---------------------------------- Tab 3 ---------------------------------- */}
      <TabPane tab="Branch Price" key="3">
        <BranchItemTabPane
          swithItemMainActive={this.props.swithItemMainActive}
          allProps={this.props.allProps}
          branchItemData={this.props.branchItemData}
        />
      </TabPane>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

    console.log('this.props1818', this.props);


    const callback = (key: String) => {
      console.log(key);
    };
    return (
      <Modal
        width={700}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        visible={updateModalVisible}
        footer={[
          <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
            Cancel
          </Button>,

          <Button key="forward" type="primary" onClick={() => this.onUpdateClicked()}>
            Update
          </Button>,
        ]}
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
