import {
  DownOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
import sort from 'fast-sort';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Button, Card, Col, Divider,
  Dropdown, Input, Menu,
  Row, Select, message,
  Popconfirm, Modal,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import cash from './img/cash.png'
import pos from './img/pos.png'
import {
  TableListItem,
  TableListPagination,
  TableListParams,
  SearchTableListParams,
} from './data.d';
import jsonpatch from 'fast-json-patch';
import { getToken } from '@/utils/authority';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'paymentModesData/add'
      | 'paymentModesData/fetch'
      | 'paymentModesData/fetchOne'
      | 'paymentModesData/search'
      | 'paymentModesData/delete'
      | 'paymentModesData/update'
    >
  >;
  loading: boolean;
  paymentModesData: StateType;
}

interface TableListState {
  modalVisible: boolean;
  imagePath: string;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  previewImageSrc: string,
  previewVisible: boolean,
  fileList: Array<any>,
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    paymentModesData,
    loading,
  }: {
    paymentModesData: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    paymentModesData,
    loading: loading.models.paymentModesData,
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    imagePath: '',
    previewImageSrc: '',
    previewVisible: false,
    fileList: [],
  };

  columns: StandardTableColumnProps[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '16%',
    },


    {
      title: 'Picture',
      dataIndex: 'picturePath',
      width: '13%',
      render: (path, record) => {
        console.log('imageP885ath', `http://beautiesapi.gcloud.co.nz/${path}`);
        console.log('imageP885ath,record', record);
        let imageSrc; 
        if(record.name == 'Cash') imageSrc = cash
        else if(record.name == 'EftPos') imageSrc = pos
        else imageSrc = `http://beautiesapi.gcloud.co.nz/${path}`

        const isImageOnServer = ((path == null || path == '') && record.name !== 'Cash'  && record.name !== 'EftPos')
        return (
          <div>
            { isImageOnServer?
              null :
              <img
                src={imageSrc}
                style={{ width: '50px', height: '50px', 'objectFit': 'cover' }}
                onClick={() => 
                  this.handlePreview(imageSrc)}
              />
            }
          </div>
        )
      }
    },

    {
      title: 'Moniker',
      dataIndex: 'moniker',
      width: '14%',
    },

    {
      title: 'Note',
      dataIndex: 'note',
      width: '14%',
    },

    {
      title: 'Action',
      width: '25%',
      render: (text, record) => (
        <Fragment>
          { record.name !== "Cash" && record.name !== "EftPos" &&
            <div>
              <Button
                type="primary"
                size="small"
                title="Edit"
                style={{ width: 60 }}
                onClick={() => this.handleUpdateModalVisible(true, record)}
              >Edit</Button>

              <Divider type="vertical" />

              <Popconfirm
                title="Are you sure to delete？"
                style={{ width: 60 }}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => this.handleRemoveItem(record)}
                okText="yes"
                cancelText="cancel"
              >
                <Button
                  type="primary" danger
                  className="button-color-dust"
                  size="small"
                  title="Delete"
                >Delete</Button>
              </Popconfirm>
            </div>
          }
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentModesData/fetch',
      callback: (res)=>{
        console.log('paymentModesData/fetch,res', res);
        
      const found = res.find(element => element.name && element.name.includes('EftPos'));
      console.log('paymentModes,found', found);
      
      if(found && found.id){

      } else {
        const payload = {
          name: "EftPos",
          picturePath: ""
        }
        this.handleAdd(payload)
      }
    
      }
    });

  }

  handleInactiveButtonStyle = (styleType: string, record?: FormValueType) => {
    if (styleType == 'icon') {
      let icon = '';
      if (record != null) {
        if (record.isInactive) icon = 'eye';
        else icon = 'eye-invisible';
      }
      return icon;
    } else if (styleType == 'title') {
      let title = '';
      if (record != null) {
        if (record.isInactive) title = 'Are you sure to active?';
        else title = 'Are you sure to inactive';
      }
      return title;
    } else {
      let btnColor = '';
      if (record != null) {
        if (record.isInactive) btnColor = 'button-color-green';
        else btnColor = 'button-color-sunset';
      }
      return btnColor;
    }
  };

  handlePreview = (imgSrc: string) => {
    this.setState({
      previewImageSrc: imgSrc,
      previewVisible: true,
    });
  };

  handleInactiveItem = (record: FormValueType) => {
    const { dispatch } = this.props;
    let document = record;
    let observer = jsonpatch.observe<Object>(document);
    if (document.isInactive) document.isInactive = false;
    else document.isInactive = true;
    const updateEnum = jsonpatch.generate(observer);
    dispatch({
      type: 'paymentModesData/update',
      payload: {
        id: document.id,
        jsonpatchOperation: updateEnum,
      },
    });
    message.success('Update Successfully');
  };

  handleRemoveItem = (record: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentModesData/delete',
      payload: {
        id: record.id,
      },
    });
  };

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: any,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'paymentModesData/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'paymentModesData/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'paymentModesData/delete',
          payload: {
            id: selectedRows.map(row => row.id),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      const filterValue: SearchTableListParams = {
        keyword: fieldsValue.keyword,
        isInactive: fieldsValue.isInactive,
      };

      dispatch({
        type: 'paymentModesData/search',
        payload: filterValue,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValueType) => {
    if (!flag) {
      this.setState({
        updateModalVisible: !!flag,
        stepFormValues: {},
      });
      return;
    }

    const { dispatch } = this.props;
    let itemId;
    if (record != undefined) itemId = record.id;
    dispatch({
      type: 'paymentModesData/fetchOne',
      payload: {
        id: itemId,
      },
      callback: () => {
        const {
          paymentModesData: { data },
        } = this.props;
        this.setState({
          updateModalVisible: !!flag,
          stepFormValues: data.oneItem || {},
        });
      },
    });
  };

  updateImage2 = (id, path)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentModesData/uploadImage',
      payload: {
        modeId: id,
        body: [
          {
            "path": "/picturePath",
            "op": "replace",
            "value": path,
          }
        ]
      },
      callback: () => {
        this.setState({
          fileList: [], // 清空
        })
      },
    });
  }

  handleImageUpload = async (payload) => {
    const {fileList} = this.state

    if (fileList.length > 0) {
      const itemId = payload.itemId;
      const formData = new FormData();
      const name = fileList[0].name;
      const myFile = new File(fileList, name, {
        type: fileList[0].type,
      });

      console.log('handleImageUpload,myFile=', myFile);

      formData.append('file', myFile);

      fetch(`/server/api/settings/PaymentModes/${itemId}/images`, {
        method: 'POST',
        headers: { authorization: `Bearer ${getToken()}` },
        body: formData,
      })
        .then((response) => response.text())
        .then((response) => {
          console.log('handleImageUpload,response', response);
          const imagePath = `${response}`;
          this.updateImage2(itemId, imagePath)
        })
        .catch();
    }
  };

  // ------------------------ Add ----------------------
  handleAdd = (fields: TableListItem) => {
    const { dispatch } = this.props;
    const newItem: TableListItem = fields;
    console.log('handleAdd=', newItem);

    dispatch({
      type: 'paymentModesData/add',
      payload: {
        ...newItem,
      },
      callback: (res)=>{
        this.handleImageUpload({itemId: res.id})
        this.handleModalVisible();
      }
    });
  };

  // ------------------------ Update ----------------------
  handleUpdate = (fields: FormValueType) => {
    const { imagePath } = this.state;
    const { stepFormValues } = this.state;

    console.log('handleUpdate,stepFormValues=', stepFormValues);
    console.log('handleUpdate,fields=', fields);

    this.updatePaymentMode(stepFormValues, fields)
    this.handleUpdateModalVisible();
  };

  updateImagePath = (modeId, path) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'paymentModesData/uploadImage',
      payload: {
        modeId: modeId,
        body: [
          {
            "path": "/picturePath",
            "op": "replace",
            "value": path,
          }
        ]
      },
    });
  }

  updatePaymentMode = (stepFormValues, fields) => {
    const { dispatch } = this.props;
    let document = stepFormValues;
    let observer = jsonpatch.observe<Object>(document);

    document.name = fields.name;
    document.moniker = fields.moniker;
    document.index = fields.index;
    document.note = fields.note;
    document.isInactive = fields.isInactive;

    const updateEnum = jsonpatch.generate(observer);
    console.log('handleUpdate=', updateEnum);

    dispatch({
      type: 'paymentModesData/update',
      payload: {
        id: stepFormValues.id,
        jsonpatchOperation: updateEnum,
      },
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keyword">
              {getFieldDecorator('keyword')(<Input placeholder="Name, Moniker, Note" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Inactive">
              {getFieldDecorator('isInactive')(
                <Select placeholder="Please select..." style={{ width: '100%' }}>
                  <Option value="">All</Option>
                  <Option value="true">True</Option>
                  <Option value="false">False</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>

            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={8} sm={24}>
            <FormItem label="Keyword">
              {getFieldDecorator('keyword')(<Input placeholder="Name, Moniker, Note" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="Inactive">
              {getFieldDecorator('isInactive')(
                <Select placeholder="Please select..." style={{ width: '100%' }}>
                  <Option value="">All</Option>
                  <Option value="true">True</Option>
                  <Option value="false">False</Option>
                </Select>,
              )}
            </FormItem>
          </Col>

        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Collapse <UpOutlined />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, previewVisible, previewImageSrc } = this.state;
    const { paymentModesData: { data }, loading } = this.props;

    console.log('paymentModes,props', this.props);
    console.log('paymentModes,data', data);

    sort(data.list).asc(each => each.name.toLowerCase())

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Delete</Menu.Item>
        <Menu.Item key="approval">approval</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>

              <Button icon={<PlusOutlined />} type="primary" onClick={() => this.handleModalVisible(true)}>
                Add Payment Mode
              </Button>

              {/* ------------------------- 批量操作 ------------------------- */}
              {selectedRows.length > 0 && (
                <span>
                  <Button>Batch operation</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      More operation <DownOutlined />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>

            {/* ------------------------- 常规表格 ------------------------- */}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />

          </div>
        </Card>

        <CreateForm 
          {...parentMethods} 
          paymentNames={data.list}
          modalVisible={modalVisible} 
          fileList={this.state.fileList}
          setFileList={(n)=>this.setState({fileList: n})}
        />

        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            paymentNames={data.list}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            imagePath={this.state.imagePath}
            updateImagePath={this.updateImagePath}
            setCurrentImagePath={(path) => this.setState({ imagePath: path })}
          />
        ) : null}

        <Modal 
          width='300px'
          bodyStyle={{padding: 35}}
          visible={previewVisible} 
          footer={null} 
          onCancel={this.handleCancel}>
            <img 
              style={{height: '100%', width: '100%'}}
              src={previewImageSrc} 
            />
        </Modal>

      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
