import {
  PlusOutlined,
  QuestionCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { clearSpaces } from '../../public-component/clearSpaces'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { CreateMulitItems } from './components/CreateMulitItems';
import EditIcon from '@material-ui/icons/Edit';
import placeholder from '../../public-component/Images/imagePlaceHolder5.jpg'
import sort from 'fast-sort';
import ImageLibrary from './components/ImageLibrary/index'
import { ResultPage } from './components/ResultPage'
import {
  Button,
  Card,
  Switch,
  Divider,
  Input,
  TreeSelect,
  Col,
  Row,
  Select,
  message,
  Popconfirm,
  Tabs,
  Tag,
  Modal,
} from 'antd';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as service from './service';
import { getToken } from '@/utils/authority';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import UnitDollar from '@/utils/UnitDollar';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import { StandardTable } from './components/StandardTable/index';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { CreateByExcel } from './components/CreateByExcel'
import {
  TableListItem,
  SearchTableListParams,
} from './data.d';
import jsonpatch from 'fast-json-patch';
import styles from './style.less';
import XLSX from 'xlsx';
import { thisTues } from '@/pages/report/public-tools/functions/dates';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;


interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'itemsData/add'
      | 'ItemLibrary/fetch'
      | 'itemsData/switchItemStatus'
      | 'itemsData/fetch'
      | 'itemsData/search'
      | 'itemsData/delete'
      | 'CategoriesTreeData/delete'
    >
  >;
  loading: boolean;
  itemsData: StateType;
  branchItemData: any;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  previewImageSrc: string;
  previewVisible: boolean;
  fileList: Array<any>;
  imagePath: string;
  uploading: boolean;
  imagePoolVisible: boolean;
  imageUploaderVis: boolean;
  largeUpload: boolean;
  currentItemId: number | undefined;
  currentBranchId: number | undefined;
  imagePathFromLibrary: string;
  visiable: boolean;
  imageSelectedIndex: null | number;
  hoverItemId: null | number;
  imageErrorList: Object;
  isSendToLibrary: boolean;
  currentPage: number;
  pagination: Object;
  filtedCategoryId: number;
  gstRate: number;
  categories: Array<any>;
  largeAddResults: Array<any>;
  isOpenResult: boolean;
  filesData: Array<any>;
  currentImagePath: string;
  myBlob: any;
  selectedImageIndex: number;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    itemsData,
    ItemLibrary,
    loading,
  }: {
    itemsData: StateType;
    ItemLibrary: any;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    itemsData,
    ItemLibrary,
    loading: loading.models.itemsData,
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
    previewImageSrc: '',
    previewVisible: false,
    imagePoolVisible: false,
    imageUploaderVis: false,
    largeUpload: false,
    fileList: [],
    uploading: false,
    currentItemId: undefined,
    currentBranchId: undefined,
    imagePath: '',
    imagePathFromLibrary: '',
    visiable: false,
    imageSelectedIndex: null,
    hoverItemId: null,
    imageErrorList: {},
    isSendToLibrary: false,
    currentPage: 1,
    filtedCategoryId: null,
    gstRate: 0.15,
    categories: [],
    pagination: { pagenumber: 1, pagesize: 20 },
    largeAddResults: [],
    isOpenResult: false,
    filesData: [],
    currentImagePath: undefined,
    myBlob: undefined,
    selectedImageIndex: -1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchInitialData()
  }

  fetchInitialData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'itemsData/fetch',
      payload: {
        pagenumber: 1,
      }
    });

    dispatch({
      type: 'itemsData/fetchCategories',
      callback: (res) => {
        console.log('res981', res);
        this.setState({
          categories: res,
          filtedCategoryId: res[0].id,
        })
      }
    });
  }

  requestItemsWithQueries = (pagination) => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      console.log('requestItemsWithPagination13,fieldsValue', fieldsValue);
      console.log('requestItemsWithPagination13,pagination', pagination);


      this.setState({
        formValues: fieldsValue,
        currentPage: pagination.pagenumber
      });

      const filterValue = {
        keyword: clearSpaces(fieldsValue.keyword),
        categoryId: fieldsValue.categoryId,
        ...pagination
      };

      console.log('filterValue135', filterValue);

      dispatch({
        type: 'itemsData/fetch',
        payload: filterValue
      });
    });
  }

  style = { width: 22, opacity: 0 }
  style1 = { width: 22, opacity: 1 }

  imagearea = {
    position: 'absolute',
    top: 20,
    width: 90,
    height: 90,
    padding: '25px 12px',
    // border: '2px solid red'
  }

  imageStyle = { width: '90px', height: '90px', objectFit: 'cover', opacity: 0.3 }
  imageStyle1 = { width: '90px', height: '90px', objectFit: 'cover' }

  onMouseOver = (record) => {
    this.setState({ hoverItemId: record.id })
    this.setState({ visiable: true })
  }

  columns = [
    {
      title: 'Button Name',
      dataIndex: 'name',
      width: '15%',
      sorter: (a, b) => a.name.toLowerCase().charCodeAt(0) - b.name.toLowerCase().charCodeAt(0),
    },

    {
      title: 'Picture',
      dataIndex: 'picturePath',
      width: '18%',
      render: (path, record) => {
        const { visiable, hoverItemId, imageErrorList } = this.state
        const isImageExist = path && path !== `{"":["The picture is not selected."]}` && path !== `{"":["Wrong file format. Only JPEG, GIF, PNG, JPG, TIF, and PSD are supported."]}`

        return (
          <section
            onMouseOver={() => this.onMouseOver(record)}
            onMouseOut={() => this.setState({ visiable: false })}
            style={{ height: 85 }}
          >
            {/* ------------------- 图片区域 -------------------  */}
            {(isImageExist && (imageErrorList[record.id] !== 'error')) ? <img
              src={`http://beautiesapi.gcloud.co.nz/${path}`}
              style={(visiable && hoverItemId === record.id) ? this.imageStyle : this.imageStyle1}
              onError={() => {
                var temp = { ...this.state.imageErrorList }
                temp[record.id] = 'error'
                this.setState({ imageErrorList: temp })
              }}
            /> :
              <img
                src={placeholder}
                style={{ ...this.imageStyle, ...{ opacity: 1 } }}
              />
            }

            {hoverItemId === record.id && <div>
              <div
                style={this.imagearea}
                onMouseOver={() => this.setState({ visiable: true })}
                onMouseOut={() => this.setState({ visiable: false })}
              >
                <VisibilityIcon
                  onClick={() => {
                    const source = isImageExist ? `http://beautiesapi.gcloud.co.nz/${path}` : null
                    isImageExist && this.handlePreview(source)
                  }}
                  style={visiable ? { ...this.style1, ...{ color: '#1890FF' } } : this.style}
                />

                <EditIcon
                  onClick={() => this.setState({
                    imageUploaderVis: true,
                    isSendToLibrary: false,
                    currentItemId: record.id
                  })}
                  style={visiable ? { ...this.style1, ...{ color: '#1890FF' } } : this.style}
                />

                <Popconfirm
                  title="Are you sure？"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => {
                    isImageExist && this.replaceItemImagePath(record.id, '')
                  }}
                >
                  <DeleteOutlineIcon
                    style={this.state.visiable ? { ...this.style1, ...{ color: 'red' } } : this.style}
                  />
                </Popconfirm>

              </div>
            </div>}
          </section>
        )
      }
    },

    {
      title: 'Description',
      dataIndex: 'description',
      width: '13%',
      sorter: (a, b) =>
        a.moniker &&
        b.moniker &&
        a.moniker.toLowerCase().charCodeAt(0) - b.moniker.toLowerCase().charCodeAt(0),
    },

    {
      title: 'Category',
      dataIndex: 'categoryName',
      width: '10%',
      sorter: (a, b) =>
        a.categoryName.toLowerCase().charCodeAt(0) - b.categoryName.toLowerCase().charCodeAt(0),
      render: (value) => {
        return (
          <Tag color='green'>
            {value}
          </Tag>
        )
      },
    },

    {
      title: 'Price',
      dataIndex: 'priceInclGst',
      width: '7%',
      sorter: (a, b) => a.priceInclGst - b.priceInclGst,
      render: (value) => (
        <Tag color="blue">
          <UnitDollar decimalPoint=".00">{value}</UnitDollar>
        </Tag>
      ),
    },

    {
      title: 'Active',
      dataIndex: 'isService',
      width: '10%',
      filterMultiple: false,
      filters: [
        {
          text: 'Active',
          value: true,
        },
        {
          text: 'Inactive',
          value: false,
        },
      ],
      onFilter: (value, record) => record.isService == value,
      render: (val, record) => {
        const checkedStatus = val ? true : false;
        return (
          <Switch
            size="small"
            checked={checkedStatus}
            onClick={(checked) => this.handleInactiveItem(checked, record)}
          />
        );
      },
    },

    {
      title: 'Action',
      width: '17%',
      render: (text, record) => (
        <Fragment>
          <Button
            size="small"
            title="Edit"
            style={{ border: '1px solid #1890FF', color: '#1890FF', fontSize: 12, width: 50 }}
            onClick={() => {
              this.setState({ currentItemId: record.id });
              this.handleUpdateModalVisible(true, record);
              this.requestBranchItemInfo(record);
            }}
          >
            Edit
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure to delete？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => this.handleRemoveItem(record)}
            okText="yes"
            cancelText="cancel"
          >
            <Button
              type="primary"
              danger
              style={{ fontSize: 12, width: 50 }}
              className="button-color-dust"
              size="small"
              title="Delete"
            >
              Delete
            </Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  handlePreview = (imgSrc: string) => {
    this.setState({
      previewImageSrc: imgSrc,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleInactiveItem = (checked: boolean, record: FormValueType) => {
    this.swithItemMainActive(checked, record)
    this.switchAllBranchInactiveItem(checked, record)
  };

  swithItemMainActive = (checked: boolean, record: FormValueType) => {
    const { dispatch, form } = this.props;
    const payload = [
      {
        op: 'replace',
        path: '/isService',
        value: checked,
      },
    ];

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('requestItemsWithPagination13,fieldsValue', fieldsValue);
      this.setState({
        formValues: fieldsValue,
        currentPage: 1
      });

      dispatch({
        type: 'itemsData/update',
        payload: {
          id: record.id || this.state.currentItemId, // Branch active 点击用的
          jsonpatchOperation: payload,
        },
        callback: () => {
          this.requestItemsWithQueries(this.state.pagination)
        }
      });
    });
  }

  switchAllBranchInactiveItem = async (checked: boolean, record: FormValueType) => {
    const allBranches = await this.fetchAllBranch()
    const branchesIds = allBranches.map(each => each.id)
    const { dispatch } = this.props;
    const payload = [
      {
        op: 'replace',
        path: '/isInactive',
        value: !checked,
      },
    ];

    // 循环处理每一个Branch的
    branchesIds.forEach(branchId => {
      dispatch({
        type: 'itemsData/switchItemStatus',
        payload: {
          branchId: branchId,
          itemId: record.id,
          jsonpatchOperation: payload,
          isNoRefresh: true,
        },
      });
    })
  };

  fetchAllBranch = async () => {
    const responese = await service.fetchAllBranch();
    console.log(responese);
    return responese
  }

  handleRemoveItem = (record: FormValueType) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'itemsData/delete',
      payload: {
        id: record.id,
      },
      callback: () => {
        this.requestItemsWithQueries(this.state.pagination)
      }
    });
  };

  requestBranchItemInfo = (record: FormValueType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'itemsData/fetchBranchItem',
      payload: {
        itemId: record.id,
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    dispatch({
      type: 'itemsData/fetch',
      payload: {
        pagenumber: 1,
        pagesize: 20,
      },
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
          type: 'itemsData/delete',
          payload: {
            id: selectedRows.map((row) => row.id),
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
        currentPage: 1
      });

      const filterValue = {
        keyword: clearSpaces(fieldsValue.keyword),
        isService: fieldsValue.isService,
        isInactive: fieldsValue.isInactive,
        categoryId: fieldsValue.categoryId,
        pagenumber: 1,
      };

      dispatch({
        type: 'itemsData/search',
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
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  setFileList = (fileList) => {
    this.setState({
      fileList: fileList,
    });
  };

  // fileList
  handleAdd = (fields: TableListItem) => {
    const { dispatch } = this.props;
    const newItem: TableListItem = fields;
    console.log('handleAdd=', newItem);
    newItem.picturePath = null

    dispatch({
      type: 'itemsData/add',
      payload: {
        ...newItem,
      },
      callback: (res) => {
        console.log('handleAdd,res=', res);
        const itemId = res.id;
        this.handleImageUpload({ itemId: itemId })
      },
    });

    this.handleModalVisible();
  };

  // 批量上传的
  handleAddLarge = (fields: TableListItem) => {
    const { dispatch } = this.props;
    const newItem: TableListItem = fields;
    console.log('handleAddLarge=', newItem);
    newItem.picturePath = null

    dispatch({
      type: 'itemsData/addLarge',
      payload: {
        ...newItem,
      },
      callback: (res) => {
        console.log('handleAddLarge,res=', res);
        const temp = [...this.state.largeAddResults]
        temp.push(res)
        console.log('handleAddLarge,temp=', temp);
        this.setState({
          largeAddResults: temp,
        })
      },
    });

  };

  handleImageUpload = async (payload) => {
    const { fileList, myBlob } = this.state
    console.log('handleImageUpload,myBlob', myBlob);
    console.log('handleImageUpload,fileList', fileList);

    if (myBlob) {
      const itemId = payload.itemId;

      const formData = new FormData();
      const name = myBlob.name;
      const type = myBlob.res.type
      const myFile = new File([myBlob.res], name, {
        type: type,
      });

      console.log('handleImageUpload,myFile=', myFile);

      formData.append('file', myFile);

      // Item传image
      fetch(`/server/api/items/items/${itemId}/images`, {
        method: 'POST',
        headers: { authorization: `Bearer ${getToken()}` },
        body: formData,
      }).then((response) => response.text())
        .then((response) => {
          console.log('handleImageUpload,response', response);
          const imagePath = `${response}`;
          this.replaceItemImagePath(itemId, imagePath);
        }).catch();

    } else {
      // 通过Image Uploader的形式
      if (fileList.length > 0) {
        const itemId = payload.itemId;
        const formData = new FormData();
        const name = fileList[0].name;
        const myFile = new File(fileList, name, {
          type: fileList[0].type,
        });

        console.log('handleImageUpload,myFile=', myFile);

        formData.append('file', myFile);

        // Item传image
        fetch(`/server/api/items/items/${itemId}/images`, {
          method: 'POST',
          headers: { authorization: `Bearer ${getToken()}` },
          body: formData,
        }).then((response) => response.text())
          .then((response) => {
            console.log('handleImageUpload,response', response);
            const imagePath = `${response}`;
            this.replaceItemImagePath(itemId, imagePath);
          }).catch();

        // 向Item库传图片
        if (this.state.isSendToLibrary) {
          fetch(`/server/api/items/uploadToGallery`, {
            method: 'POST',
            headers: { authorization: `Bearer ${getToken()}` },
            body: formData,
          }).then((response) => response.text())
            .catch();
        }
      }
    }
  };

  uploadImageToLibrary = (fileList) => {
    try {
      if (fileList.length > 0) {

        const formData = new FormData();
        const name = fileList[0].name;
        const myFile = new File(fileList, name, {
          type: fileList[0].type,
        });

        console.log('handleImageUpload,fileList=', fileList);
        console.log('handleImageUpload,name=', name);
        console.log('handleImageUpload,myFile=', myFile);

        formData.append('file', myFile);

        if (this.state.isSendToLibrary) {
          fetch(`/server/api/items/uploadToGallery`, {
            method: 'POST',
            headers: { authorization: `Bearer ${getToken()}` },
            body: formData,
          }).then((response) => response.text()).catch();
        }
      }
    } catch {
      message.error('Upload to library Error.')
    }
  }


  replaceItemImagePath = (itemId, path) => {
    const { dispatch } = this.props;
    // const pagination = this.state.pagination
    dispatch({
      type: 'itemsData/uploadImage',
      payload: {
        itemId: itemId,
        body: [
          {
            "path": "/picturePath",
            "op": "replace",
            "value": path,
          }
        ]
      },
      callback: () => {
        dispatch({
          type: 'itemsData/fetchItems',
          payload: {
            // ...pagination,
          }
        });
      }
    });
  }


  onComfirmFromImageLibrary = (path, itemId) => {

    console.log('onComfirmFromImageLibrary,path', path);
    const splitArr = path.split('/')
    const name = splitArr[3].slice(1)
    console.log('onComfirmFromImageLibrary,splitArr', splitArr);
    console.log('onComfirmFromImageLibrary,name', name);

    // 从网站URL直接拿到图片，以Blob形式储存
    fetch(`/server/img/${name}`, {
      method: 'GET',
    }).then((res) => {
      return res.blob()
    }).then(res => {
      if (this.state.currentItemId) {

        // 更新图片
        this.uploadImageWithNewBlob(name, res, this.state.currentItemId)
      } else {
        // 新建图片, 只是储存Blob
        this.setState({
          myBlob: {
            name: name,
            res: res
          }
        })
      }
    }).catch(
      // message.error('Get image Error.')
    )
  }

  clearMyBlob = () => {
    this.setState({
      myBlob: undefined
    })
  }


  uploadImageWithNewBlob = (name, myBlob, itemId) => {
    console.log('uploadImage16,myBlob=', myBlob);
    console.log('uploadImage16,name=', name);
    const formData = new FormData();
    const splitName = name.split('\\')[2]
    const myFile = new File([myBlob], splitName, {
      type: myBlob.type,
    });

    console.log('uploadImage16,myFile=', myFile);

    formData.append('file', myFile);
    // 重新请求Image的新地址, 并且更新picturePath
    fetch(`/server/api/items/items/${itemId}/images`, {
      method: 'POST',
      headers: { authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then((response) => response.text())
      .then((response) => {
        const imagePath = `${response}`;
        this.replaceItemImagePath(itemId, imagePath);
      }).catch();
  }

  updateImage = (path) => {
    const { dispatch } = this.props;
    const { stepFormValues } = this.state;

    dispatch({
      type: 'itemsData/uploadImage',
      payload: {
        itemId: stepFormValues.id,
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

  updateBranchItemPrice = (stepFormValues, updateEnum) => {
    const paths = updateEnum.map(each => each.path)
    if (paths.includes('/priceInclGst')) {
      const value = updateEnum.filter(each => each.path == '/priceInclGst')[0].value
      this.changeAllBranchPriceCost(stepFormValues.id, value, '/priceInclGst')
    }

    if (paths.includes('/costExclGst')) {
      const value = updateEnum.filter(each => each.path == '/costExclGst')[0].value
      this.changeAllBranchPriceCost(stepFormValues.id, value, '/costExclGst')
    }
  }

  updateItemInfo = (stepFormValues, updateEnum) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'itemsData/update',
      payload: {
        id: stepFormValues.id,
        jsonpatchOperation: updateEnum,
      },
      callback: () => {
        this.requestItemsWithQueries(this.state.pagination)
      }
    });
  }


  handleUpdate = (formVals: FormValueType, curentFormValues) => {
    const { stepFormValues } = this.state;
    const { form } = this.props;

    console.log('handleUpdate738,旧数据1=', formVals);
    console.log('handleUpdate738,当前数据1=', curentFormValues);

    let document = formVals;
    let observer = jsonpatch.observe<Object>(document);

    document.name = curentFormValues.name;
    document.description = curentFormValues.description;
    document.code = curentFormValues.code;
    document.moniker = curentFormValues.moniker;
    document.categoryId = curentFormValues.categoryId;
    document.note = curentFormValues.note;
    document.priceInclGst = curentFormValues.priceInclGst;
    document.costExclGst = curentFormValues.costExclGst;
    document.gstRate = curentFormValues.gstRate;

    const updateEnum = jsonpatch.generate(observer);
    console.log('handleUpdate,updateEnum=', updateEnum);


    this.updateItemInfo(stepFormValues, updateEnum)
    this.updateBranchItemPrice(stepFormValues, updateEnum)
    this.handleUpdateModalVisible();
  };


  changeAllBranchPriceCost = async (itemId, value, path) => {
    const allBranches = await this.fetchAllBranch()
    const branchesIds = allBranches.map(each => each.id)
    const { dispatch } = this.props;

    const payload = [
      {
        op: 'replace',
        path: path,
        value: value,
      },
    ];

    // 循环处理每一个Branch的
    branchesIds.forEach(branchId => {
      dispatch({
        type: 'itemsData/updateBranchPrice',
        payload: {
          branchId: branchId,
          itemId: itemId,
          jsonpatchOperation: payload,
        },
      });
    })
  };

  // --------------------------------- 普通表格 ---------------------------------
  renderSimpleForm() {
    const {
      itemsData: { data },
      form: { getFieldDecorator },
    } = this.props;
    console.log('renderSimpleForm，data', data.categoriesList);

    const categoriesTreeData = this.getTree(this.state.categories || []);
    let currentValue = '';

    const onChange = (value) => {
      console.log(value);
      currentValue = value;
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="Keyword">
              {getFieldDecorator('keyword')(
                <Input style={{ width: 180 }} placeholder="Search item..." />,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="Category">
              {getFieldDecorator('categoryId')(
                <TreeSelect
                  style={{ width: '100%', minWidth: 180 }}
                  value={currentValue}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={categoriesTreeData}
                  placeholder="Please select"
                  treeDefaultExpandAll
                  onChange={onChange}
                />,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
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

  // --------------------------------- 高级表格 ---------------------------------
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keyword">
              {getFieldDecorator('keyword')(
                <Input
                  placeholder="Name, Description, Moniker, Note"
                  style={{ width: '100%', minWidth: 200 }}
                />,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="Category">
              {getFieldDecorator('categoryId')(
                <Select placeholder="Please select..." style={{ width: '100%', minWidth: 200 }}>
                  <Option value="">All Category</Option>
                  <Option value="9">Category9</Option>
                  <Option value="10">Category10</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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

  toolForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  getTree = (data = [], sid, pid = null) => {
    const children = [];
    for (const i in data) {
      const node = data[i];

      if (((!pid && !node.parentCategoryId) || node.parentCategoryId === pid) && node.id !== sid) {
        // key, value, label 是为antd添加的属性。若有需求，可任意添加
        children.push({
          key: node.id,
          value: node.id,
          title: node.name,
          children: this.getTree(data, sid, node.id),
          ...node,
        });
      }
    }
    return children.length ? children : undefined;
  };

  sourceDataMaker = (itemsList, categoriesList = []) => {

    console.log('sourceDataMaker888,itemsList', itemsList);
    console.log('sourceDataMaker888,categoriesList', categoriesList);

    let newArray: TableListItem[] = [];

    if (itemsList && itemsList.data === undefined) {
      itemsList.map((value) => {
        let categoryId = value.categoryId;
        let newList =
          categoriesList.data !== '' && categoriesList.filter((item) => item.id == categoryId);
        let categoryName = '';
        newList.map((value) => {
          categoryName = value.name;
        });
        newArray.push({
          ...value,
          categoryName: categoryName,
        });
      });
    }
    return newArray;
  };

  onSubmitComfirm = (fileList) => {
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 
    try {
      console.log('onSubmitComfirm,fileList', fileList);

      if (fileList.length == 0) {
        message.error('Please upload an excel file.')
      } else { 
        const formData = new FormData();
        const name = fileList[0].name;
        const config = { type: fileList[0].type }
        const myFileList = [fileList[0].originFileObj]
        const blob = new Blob(myFileList, config);
  
        console.log('onSubmitComfirm,blob=', blob);
  
        formData.append('file', blob, name);

        fetch(`/server/api/items/batchUpload`, {
          method: 'POST',
          headers: { authorization: `Bearer ${getToken()}` },
          body: formData,
        })
          .then((response) => response.json())
          .then((response) => {
            console.log('onSubmitComfirm,response', response);
            this.setState({ 
              isOpenResult: true,
              largeAddResults: response,
            })

            this.fetchInitialData()
          })
      }
    } catch {
    }
  }

  cancelLargeAdd = () => {
    this.setState({
      largeUpload: false,
      isOpenResult: false,
      largeAddResults: [],
      filtedCategoryId: this.state.categories[0] && this.state.categories[0].id,
      gstRate: 0.15,
    })
    this.postData = []
  }

  postData = []

  // ----------------------------------------- Render ------------------------------------
  render() {
    const {
      itemsData: { data },
      loading,
      ItemLibrary: { allImages }
    } = this.props;

    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      previewVisible,
      largeAddResults,
      previewImageSrc,
    } = this.state;

    console.log('itemsPage,props', this.props);
    console.log('itemsPage,largeAddResults', this.state.largeAddResults);

    const sourceData = {
      list: this.sourceDataMaker(data.list, this.state.categories),
      pagination: data.pagination,
    };



    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    // 排序
    var allImagesFromLibrary = allImages.item3
    sort(allImagesFromLibrary).desc(each => new Date(each.uploadTime).getTime())

 

    console.log('items, this.props,allImagesFromLibrary=', allImagesFromLibrary);

    return (
      <PageHeaderWrapper content="This page shows all itemes of one company.">

        {/* ----------------------- 批量上传Item ----------------------- */}
        <Modal
          width='700px'
          bodyStyle={{ width: 700, padding: '50px 50px 50px 50px', zIndex: 50 }}
          visible={this.state.largeUpload}
          footer={
            
            // !this.state.isOpenResult ? 
            
            [
            <Button onClick={() => {
              this.cancelLargeAdd()
            }}>Cancel</Button>,
      
            <Button
              type='primary'
              onClick={() => {
                this.onSubmitComfirm(this.state.filesData)
              }
              }>Comfirm</Button>
          ] 
          
          // : [<Button
          //   type='primary'
          //   onClick={() => {
          //     this.cancelLargeAdd()
          //   }}>Finish</Button>,
          // ]
        
        }
          onCancel={() => { this.cancelLargeAdd() }}
        >
          {largeAddResults.processedItemList && this.state.isOpenResult ?
            <ResultPage
              largeAddResults={largeAddResults}
            /> :
            <CreateByExcel
            postData={this.postData}
            filesData={this.state.filesData}
            setFileData={(n) => this.setState({ filesData: n })}
          />
          }
        </Modal>

        {/* ----------------------- Image Library ----------------------- */}
        <Modal
          width='930px'
          bodyStyle={{
            width: '930px',
            padding: '30px 0px 20px 40px'
          }}
          zIndex={1001}
          visible={this.state.imageUploaderVis}
          footer={null}
          onCancel={() => this.setState({ imageUploaderVis: false })}
        >
          <ImageLibrary
            onCancel={() => { this.setState({ imageUploaderVis: false }) }}
            onComfirm={(path) => {
              console.log('onComfirm15', path);
              const itemId = this.state.currentItemId
              this.onComfirmFromImageLibrary(path, itemId)
              this.setState({ imageUploaderVis: false })
              this.setState({ selectedImageIndex: -1 })
            }}
            imageUploaderVis={this.state.imageUploaderVis}
            selectedImageIndex={this.state.selectedImageIndex}
            setSelectedImageIndex={(index) => this.setState({ selectedImageIndex: index })}
            setImagePathFromLibrary={(n) => this.setState({ imagePathFromLibrary: n })}
            setCurrentImagePath={(n) => this.setState({ currentImagePath: n })}
            categories={this.state.categories}
          />
        </Modal>

        {/* ------------------------ Create Form --------------------- */}
        <CreateForm
          {...parentMethods}
          clearMyBlob={this.clearMyBlob}
          onComfirm={(n) => this.setState({ isSendToLibrary: n })}
          imagePathFromLibrary={this.state.imagePathFromLibrary}
          setImagePathFromLibrary={(n) => this.setState({ imagePathFromLibrary: n })}
          onOpenImagePoolClick={() => {
            this.setState({ imageUploaderVis: true })
            this.setState({ selectedImageIndex: -1 })
          }}
          itemList={this.props.itemsData.data.list || []}
          currentItemId={this.props.itemsData.currentItemId}
          requestImagePath={this.requestImagePath}
          fileList={this.state.fileList}
          setFileList={this.setFileList}
          modalVisible={modalVisible}
          branchItemData={this.props.itemsData.branchItemData}
          currentImagePath={this.state.currentImagePath}
          categoriesTreeData={this.getTree(this.state.categories || [])}
          setMyBlob={(n) => this.setState({ myBlob: n })}
        />

        {/* ------------------------ Update ------------------------ */}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            allProps={this.props}
            currentItemId={this.state.currentItemId}
            stepFormValues={this.state.stepFormValues}
            imagePathFromLibrary={this.state.imagePathFromLibrary}
            setImagePathFromLibrary={(n) => this.setState({ imagePathFromLibrary: n })}
            onOpenImagePoolClick={() => this.setState({ imagePoolVisible: true })}
            {...updateMethods}
            allItemNames={this.props.itemsData.data.allItemNames || []}
            imagePath={this.state.imagePath || ''}
            setCurrentImagePath={(path) => this.setState({ imagePath: path })}
            updateImage={(n) => this.updateImage(n)}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            swithItemMainActive={this.swithItemMainActive}
            currentBranchId={this.state.currentBranchId}
            setSelectedBranchId={(n) => { this.setState({ currentBranchId: n }) }}
            branchItemData={this.props.itemsData.branchItemData}
            handleBranchItemUpdate={(n, m) => this.handleBranchItemUpdate(n, m)}
            handleUpdate={(n, m) => this.handleUpdate(n, m)}
            updateImagePath={this.replaceItemImagePath}
            categoriesTreeData={this.getTree(this.state.categories || [])}
          />
        ) : null}


        {/* ------------------------- Standerd Form ---------------------- */}
        <Card bordered={false}>
          <div className={styles.tableList}>

            <div className={styles.tableListForm}>{this.toolForm()}</div>
            <div style={{ float: 'right', margin: '20px 0', zIndex: 10 }}>


              <Button
                style={{ marginRight: 10 }}
                icon={<PlusOutlined />}
                // type="primary"
                onClick={() => this.setState({ 
                  largeUpload: true,
                  filesData: [],
                })}
              >
                Batch Upload
              </Button>

              <Button
                style={{ marginRight: 10 }}
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                Create New Item
              </Button>




            </div>

            <StandardTable
              totalItemCount={data.totalItemCount}
              selectedRows={selectedRows}
              currentPage={this.state.currentPage}
              pagination={this.state.pagination}
              setPagination={(n) => this.setState({ pagination: n })}
              setCurrentPage={(n) => this.setState({ currentPage: n })}
              requestItemsWithQueries={(n) => this.requestItemsWithQueries(n)}
              loading={loading}
              data={sourceData}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>

        {/* ------------------------ Preview ------------------- */}
        <Modal
          width='300px'
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}>
          <img style={{ width: '100%' }} src={previewImageSrc} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
