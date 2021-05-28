import React, { Component } from 'react';
import styles from './index.less';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { FileUpLoader } from '../../../../public-component/UpdateUploader';
import { Input, Select, Typography, Button, Switch, message } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { CategoriesTreeItem } from '../../data';
import { GithubPicker } from 'react-color';
import * as service from '../../../categories/service';
import { getToken } from '@/utils/authority';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export interface FormValueType extends Partial<CategoriesTreeItem> {
  oldParentCategoryId?: number;
  queueNumber?: number;
}

export interface TreeDataEditState {
  formVals: FormValueType;
  fileList: any;
  displayColorPicker: boolean;
}

interface TreeDataEditProps extends FormComponentProps {
  loading: boolean;
  color: any;
  selectedTreeNode: Partial<CategoriesTreeItem>;
  newButtonDisabled: boolean;
  deleteButtonDisabled: boolean;
  moveButtonDisabled: boolean;
  currentCatoryId: string;
  validateCategoryName: (string, any) => void;
  setCurrentImagePath: (any) => void;
  updateImage: (value1: string, value2: string) => void;
  handleRemove: (values: FormValueType) => void;
  handleUpdate: (values: FormValueType) => void;
  handleModalVisible: (visibleFlag?: boolean, createTreeHeadFlag?: boolean) => void;
  handleMoveModalVisible: (visibleFlag?: boolean) => void;
}

class CategoryEditor extends Component<TreeDataEditProps, TreeDataEditState> {

  constructor(props: TreeDataEditProps) {
    super(props);

    this.state = {
      formVals: {
        name: props.selectedTreeNode.name,
        description: props.selectedTreeNode.description,
        moniker: props.selectedTreeNode.moniker,
        note: props.selectedTreeNode.note,
        color: props.selectedTreeNode.color,
        isInactive: props.selectedTreeNode.isInactive,
        parentCategoryId: props.selectedTreeNode.parentCategoryId,
        parentCategory: props.selectedTreeNode.parentCategory,
        queueNumber: 0,
      },
      displayColorPicker: false,
      fileList: []
    };
  }

  componentWillReceiveProps() {
    const { selectedTreeNode } = this.props;
    this.setState({
      formVals: selectedTreeNode,
    });
  }

  handleUpdate = async e => {
    e.preventDefault();
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;

    form.validateFieldsAndScroll(async (err, values) => {
      let temp = { ...oldValue, ...values }

      if (err) {
        return
      } else {
        try {
          await this.checkCategoryName(temp)

          const itemId = temp.id

          // 打印出来进行判断（双重判断）
          if (this.state.fileList.length !== 0) {
            this.props.currentImagePath == '' && this.requestImageUrl(itemId)
          } else {
            this.props.updateImage(itemId, '')
          }

          handleUpdate(temp)
          this.setState(temp)
          form.resetFields()
        } catch {
          message.error('This name has already exist.')
        }
      }
    });
  };

  requestImageUrl = async (id) => {
    const { fileList } = this.state
    if (fileList.length > 0) {
      const formData = new FormData();
      var blob = new Blob([fileList[0].originFileObj], { type: fileList[0].type })

      formData.append('file', blob, fileList[0].name);
      const actions = `/server/api/items/categories/${id}/images`

      fetch(actions, {
        method: 'POST',
        headers: { authorization: `Bearer ${getToken()}` },
        body: formData,
      })
        .then((response) => response.text())
        .then((response) => {
          this.props.updateImage(id, response)
        })
        .catch();
    }
  };

  checkCategoryName = async (value) => {
    const payload = {
      itemId: value.id,
      body: {
        Name: value.name
      }
    }
    const responese = await service.validateCategoryNameWithId(payload);
    console.log(responese);
  }


  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.setState({
      formVals: {
        ...this.state.formVals,
        color: color.hex,
      },
    });
  };

  handleIsActive = (e) => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const formVals = { ...oldValue, ...values };
      this.setState(
        { formVals },
        () => {
          handleUpdate(formVals);
          form.resetFields();
        },
      );
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      deleteButtonDisabled,
    } = this.props;
    const { formVals, displayColorPicker } = this.state;

    console.log('formVals15', formVals);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 7,
        },
      },
    };

    const imagePath = (formVals.picturePath
      && formVals.picturePath !== '')
      && `http://beautiesapi.gcloud.co.nz/${formVals.picturePath}`


    return (
      <div className={styles.container}>
        <div className={styles.categoriesEditForm}>
          <Form {...formItemLayout}>

            <Form.Item {...tailFormItemLayout}>
              <div className={styles.container}>
                <div>
                  <Title level={4}>Category Detail</Title>
                </div>
              </div>
            </Form.Item>

            {this.props.currentCatoryId &&
              <section style={{height: 800}}>
                <Form.Item label="Name">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input category name!',
                      },
                    ],
                    initialValue: formVals.name,
                  })(<Input />)}
                </Form.Item>

                <Form.Item label="Description">
                  {getFieldDecorator('description', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input description!',
                      },
                    ],
                    initialValue: formVals.description,
                  })(<Input  />)}
                </Form.Item>
                <Form.Item label="Moniker">
                  {getFieldDecorator('moniker', {
                    initialValue: formVals.moniker,
                  })(<Input  />)}
                </Form.Item>

                {/* ------------------- 颜色选择器 -------------------*/}
                <Form.Item label="Display Color">
                  {getFieldDecorator('color', {
                    initialValue: formVals.color,
                  })(
                    <>
                      <Input
                        style={{ color: 'transparent', backgroundColor: `${formVals.color}`, width: 35, height: 35 }}
                        onClick={(e) => {
                          this.setState({
                            displayColorPicker: !displayColorPicker,
                          });
                        }}
                      />
                      {displayColorPicker &&
                        <GithubPicker
                          onChange={() => {
                            this.setState({
                              displayColorPicker: !displayColorPicker,
                            });
                          }}
                          onChangeComplete={(e) => {
                            this.handleChange(e)
                          }}
                        />}
                    </>,
                  )}
                </Form.Item>

                <Form.Item label="Picture" >
                  {getFieldDecorator('picturePath', {
                    initialValue: imagePath,
                  })(
                    <FileUpLoader
                      fileList={this.state.fileList}
                      setFileList={(n) => this.setState({ fileList: n })}
                      fromPage='Category'
                      currentImagePath={this.props.currentImagePath}
                      picturePathOfForm={formVals.picturePath}
                      setCurrentImagePath={this.props.setCurrentImagePath}
                      currentCatoryId={this.props.currentCatoryId}
                    />
                  )}
                </Form.Item>

                <Form.Item label="Is Active">
                  {getFieldDecorator('isInactive', {
                    valuePropName: 'checked',
                    initialValue: !formVals.isInactive,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Switch
                    size="small"
                    onClick={(e) => this.handleIsActive(e)}
                     />)}
                </Form.Item>

                <Form.Item label="Note">
                  {getFieldDecorator('note', {
                    rules: [{ message: 'This field is required', min: 1 }],
                    initialValue: formVals.note,
                  })(
                    <TextArea  />,
                  )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button
                    type="primary"
                    onClick={this.handleUpdate}
                    
                  >
                    Update
              </Button>
                </Form.Item>
              </section>
            }

          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create<TreeDataEditProps>()(CategoryEditor);
