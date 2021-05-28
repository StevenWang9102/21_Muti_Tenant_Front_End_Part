import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, message, Button, Popconfirm } from 'antd';
import styles from './style.less';
import SearchTree, { TreeNodeType } from './components/TreeSearch';
import CategoryEditor, { FormValueType } from './components/CategoryEditor';
import CreateForm from './components/CreateForm';
import MoveForm from './components/MoveForm';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Dispatch, Action } from 'redux';
import { connect } from 'dva';
import { StateType } from './model';
import jsonpatch from 'fast-json-patch';
import { CategoriesTreeItem } from './data.d';
import { SketchPicker } from 'react-color'
import { getToken } from '@/utils/authority';

interface CategoriesTreeProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'CategoriesTreeData/fetch'
      | 'CategoriesTreeData/fetchOne'
      | 'CategoriesTreeData/add'
      | 'CategoriesTreeData/delete'
      | 'CategoriesTreeData/update'
      | 'CategoriesTreeData/uploadImage'
    >
  >;
  loading: boolean;
  CategoriesTreeData: StateType;
}

interface CategoriesTreeState {
  createTreeHead: boolean;
  modalVisible: boolean;
  moveModalVisible: boolean;
  newButtonDisabled: boolean;
  deleteButtonDisabled: boolean;
  moveButtonDisabled: boolean;
  selectedTreeNode: Partial<CategoriesTreeItem>;
  imagePath: string;
  currentCatoryId: string;
  fileList: Array<any>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    CategoriesTreeData,
    loading,
  }: {
    CategoriesTreeData: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    CategoriesTreeData,
    loading: loading.models.CategoriesTreeData,
  }),
)

class CategoriesTree extends Component<CategoriesTreeProps, CategoriesTreeState> {
  state: CategoriesTreeState = {
    createTreeHead: true,
    modalVisible: false,
    moveModalVisible: false,
    newButtonDisabled: true,
    deleteButtonDisabled: true,
    moveButtonDisabled: true,
    selectedTreeNode: {},
    imagePath: '',
    currentCatoryId: '',
    fileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    console.log('categories page first fetch');
    dispatch({
      type: 'CategoriesTreeData/fetch',
    });
  }

  handleSelectedTreeNode = (nodeKey: number, selected: boolean) => {
    // const hide = message.loading('Loading...')
    const { dispatch } = this.props;
    dispatch({
      type: 'CategoriesTreeData/fetchOne',
      payload: {
        id: nodeKey,
      },
      callback: () => {
        // hide()
        this.refreshButtonStatus(selected);
      },
    });
  };

  refreshButtonStatus = (selected: boolean) => {
    // 刷新页面按钮状态
    const {
      CategoriesTreeData: { data, OneCategory },
    } = this.props;
    const children = this.getTreeAllChildren(data.list, OneCategory);

    if (selected) {
      if (OneCategory.parentCategoryId == null && children.length > 0) {
        this.handleButtonStatus(false, true, true);
      } else if (OneCategory.parentCategoryId == null && children.length == 0) {
        this.handleButtonStatus(false, false, true);
      } else if (OneCategory.parentCategoryId != null && children.length > 0) {
        this.handleButtonStatus(false, true, false);
      } else if (OneCategory.parentCategoryId != null && children.length == 0) {
        this.handleButtonStatus(false, false, false);
      }
    } else {
      this.handleButtonStatus(true, true, true);
    }

    this.setState({
      selectedTreeNode: OneCategory || {},
    });
  };

  getTreeAllChildren = (data: CategoriesTreeItem[], node: Partial<CategoriesTreeItem>) => {
    const children = [];
    for (const v of data) {
      if (v.parentCategoryId === node.id) {
        children.push(v);
        const subs = this.getTreeAllChildren(data, v.parentCategoryId);
        if (subs) {
          children.push(...subs);
        }
      }
    }
    return children;
  };

  handleRemove = (record: FormValueType) => {    
    const { dispatch } = this.props;
    dispatch({
      type: 'CategoriesTreeData/delete',
      payload: {
        id: record.id,
      },

      callback: (success) => {        
        message.success('Delete successfully.')
        this.refreshButtonStatus(false); // 刷新页面按钮的状态
      },
    });
  };

  handleButtonStatus = (newFlag?: boolean, deleteFlag?: boolean, moveFlag?) => {
    this.setState({
      newButtonDisabled: !!newFlag,
      deleteButtonDisabled: !!deleteFlag,
      moveButtonDisabled: !!moveFlag,
    });
  };

  handleUpdateModal = (flag?: boolean, record?: FormValueType) => {
    if (!flag) {
      this.setState({
        selectedTreeNode: {},
      });
      return;
    }

    const { dispatch } = this.props;
    let CategoryId;
    if (record != undefined) CategoryId = record.id;
    console.log('handleUpdateModal flag=', flag);
    console.log('handleUpdateModal record=', record);
    dispatch({
      type: 'CategoriesTreeData/fetchOne',
      payload: {
        id: CategoryId,
      },
      callback: () => {
        const {
          CategoriesTreeData: { OneCategory },
        } = this.props;
        this.setState({
          //updateModalVisible: !!flag,
          selectedTreeNode: OneCategory || {},
        });
      },
    });
  };

  handleModalVisible = (visibleFlag?: boolean, createTreeHeadFlag?: boolean) => {
    this.setState({
      modalVisible: !!visibleFlag,
      createTreeHead: !!createTreeHeadFlag,
    });
  };

  handleMoveModalVisible = (visibleFlag?: boolean) => {
    this.setState({
      moveModalVisible: !!visibleFlag,
    });
  };

  updateImage2 = (id, path)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'CategoriesTreeData/uploadImage',
      payload: {
        itemId: id,
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

      fetch(`/server/api/items/categories/${itemId}/images`, {
        method: 'POST',
        headers: { authorization: `Bearer ${getToken()}` },
        body: formData,
      })
        .then((response) => response.text())
        .then((response) => {
          console.log('handleImageUpload,response', response);
          const imagePath = `${response}`;
          this.updateImage2(itemId, imagePath)
        }).catch();
    }
  };

  handleAdd = (fields: CategoriesTreeItem) => {
    try{
      const { dispatch } = this.props;
      const newItem: CategoriesTreeItem = fields;
  
      dispatch({
        type: 'CategoriesTreeData/add',
        payload: {
          ...newItem,
        },
        callback: (res) => {
          message.success('Success !')
          this.handleImageUpload({itemId: res.id})
          this.refreshButtonStatus(false);
        },
      });
  
      this.handleModalVisible();
    } catch {
      message.error('Add Categroy Failed !')
    }
  };

  handleUpdate = (fields: FormValueType) => {
    const { dispatch } = this.props;
    const { selectedTreeNode } = this.state;

    console.log('handleUpdate,selectedCurrentCategory=', selectedTreeNode);
    console.log('handleUpdate,fields=', fields);

    let document = selectedTreeNode;
    let observer = jsonpatch.observe<Object>(document);
    if (fields.name != undefined) document.name = fields.name;
    if (fields.description != undefined) document.description = fields.description;
    if (fields.moniker != undefined) document.moniker = fields.moniker;
    if (fields.note != undefined) document.note = fields.note;
    if (fields.color != undefined) document.color = fields.color;
    if (fields.isInactive != undefined) document.isInactive = !fields.isInactive;
    if (fields.parentCategoryId != undefined) document.parentCategoryId = fields.parentCategoryId;
    const updateCategory = jsonpatch.generate(observer);
    console.log('handleUpdate=', updateCategory);

    updateCategory.length!==0 && dispatch({
      type: 'CategoriesTreeData/update',
      payload: {
        id: selectedTreeNode.id,
        jsonpatchOperation: updateCategory,
      },
    });
    this.handleUpdateModal(true, selectedTreeNode);
    this.handleMoveModalVisible();
  };

  updateImage = (id, path)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'CategoriesTreeData/uploadImage',
      payload: {
        itemId: this.state.currentCatoryId,
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

  validateCategoryName = (value, formValues)=>{
    console.log('validateCategoryName,formValues',formValues);
    console.log('validateCategoryName,value',value);
    
      const { dispatch } = this.props;
      dispatch({
        type: 'CategoriesTreeData/validateCategoryName',
        payload: {
          itemId: formValues.id, 
          body : { Name: value }
        },
      });
    } 

  setCurrentImagePath=(path)=>{
    this.setState({imagePath: path})
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

  render() {
    const {
      CategoriesTreeData: { data },
      loading,
    } = this.props;

    const {
      newButtonDisabled,
      deleteButtonDisabled,
      moveButtonDisabled,
      selectedTreeNode,
      modalVisible,
      moveModalVisible,
      createTreeHead,
    } = this.state;

    const createFormMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const moveFormMethods = {
      handleUpdate: this.handleUpdate,
      handleMoveModalVisible: this.handleMoveModalVisible,
    };

    const formMethods = {
      handleRemove: this.handleRemove,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      handleMoveModalVisible: this.handleMoveModalVisible,
    };

    return (
      <PageHeaderWrapper content="You can manage categories on this page.">
        <CreateForm
          {...createFormMethods}
          fileList={this.state.fileList}
          setFileList={(n)=>this.setState({fileList: n})}
          modalVisible={modalVisible}
          createTreeHead={createTreeHead}
          selectedTreeNode={selectedTreeNode}
        />

        <MoveForm
          {...moveFormMethods}
          moveModalVisible={moveModalVisible}
          gData={this.getTree(data.list)}
          selectedTreeNode={selectedTreeNode}
        />
        
        <div className={styles.container}>
          <Card bordered={false}>
            <Row gutter={24}>
              <Col md={7} sm={24}>
                <Button
                  style={{ marginBottom: 18, marginRight: 8 }}
                  ghost
                  disabled={false}
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => this.handleModalVisible(true, true)}
                >
                  New Category
                </Button>

                <Popconfirm
                  title="Are you sure to delete?"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => this.handleRemove(selectedTreeNode)}
                  okText="yes"
                  cancelText="cancel"
                >
                  <Button
                    style={{ float: 'right' }}
                    icon={<DeleteOutlined />}
                    type="danger"
                    ghost
                    disabled={deleteButtonDisabled}
                  >
                    Delete
                  </Button>
                </Popconfirm>

              {/* -------------------- 左侧导航栏 -------------------- */}
                {data.list && Object.keys(data.list).length ? (
                  <SearchTree
                    loading={loading}
                    gData={this.getTree(data.list)}
                    setCurrentCategoryId={(id)=>{
                      this.setState({
                        currentCatoryId: id
                      })
                    }}
                    handleSelectedTreeNode={this.handleSelectedTreeNode}
                  />
                ) : null}

              </Col>

              {/* -------------------- 右侧显示栏 -------------------- */}
              <Col md={16} sm={24}>
                <div>
                  <CategoryEditor
                    validateCategoryName={this.validateCategoryName}
                    currentImagePath={this.state.imagePath}
                    setCurrentImagePath={(path)=>this.setState({imagePath: path})}
                    updateImage = {this.updateImage}
                    currentCatoryId={this.state.currentCatoryId}
                    loading={loading}
                    selectedTreeNode={selectedTreeNode}
                    newButtonDisabled={newButtonDisabled}
                    deleteButtonDisabled={deleteButtonDisabled}
                    moveButtonDisabled={moveButtonDisabled}
                    {...formMethods}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<CategoriesTreeProps>()(CategoriesTree);
