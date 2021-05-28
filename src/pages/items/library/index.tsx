import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Dispatch, Action } from 'redux';
import { connect } from 'dva';
import { StateType } from './model';
import { Tabs, Row, Col } from 'antd';
import { Image, Button } from 'antd';
import { Select } from 'antd';
import { Input, message, Pagination } from 'antd';
import { ImageDragger } from './components/imageDraggerMulti'
import { ImageDragger1 } from './components/imageDragger1'
// ImageDragger
import sort from 'fast-sort';
import { NumberValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';

const { TabPane } = Tabs;
const { Option } = Select;


interface CategoriesTreeProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'ItemLibrary/fetch'
      | 'ItemLibrary/deleteImage'
    >
  >;
  loading: boolean;
  CategoriesTreeData: StateType;
}

interface CategoriesTreeState {
  selectedImageIndex: Array<any>;
  activeTabKey: string;
  inputImageName: string;
  currentPage: number;
  categories: Array<any>;
  selectedCategoryId: number;
  filtedCategoryId: number | string;
}

const styleWithBorder = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  padding: 5,
  border: '4px solid #E3E2E0',
  borderRadius: 3
}

const styleWithoutBorder = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  padding: 5,
  borderRadius: 3
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    ItemLibrary,
    itemsData,
  }: {
    ItemLibrary: StateType;
    itemsData: any;
  }) => ({
    ItemLibrary,
    itemsData
  }),
)

class ItemImageLibrary extends Component<CategoriesTreeProps, CategoriesTreeState> {
  state: CategoriesTreeState = {
    currentPage: 1,
    selectedImageIndex: [],
    activeTabKey: "1",
    categories: [],
    selectedCategoryId: 0,
    filtedCategoryId: 'waiting...',
    inputImageName: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch({
      type: 'ItemLibrary/fetch',
    });

    dispatch({
      type: 'itemsData/fetch',
      payload: {
        current: 2
      }
    });

    dispatch({
      type: 'CategoriesTreeData/fetch',
      callback: (res) => {
        console.log('res981', res);
        this.setState({
          categories: res,
          filtedCategoryId: res[0].id,
          selectedCategoryId: res[0].id
        })
      }
    });
  }

  onUploadFinished = () => {
    const { dispatch } = this.props
    this.setState({
      activeTabKey: '1',
      filtedCategoryId: this.state.categories[0].id,
      selectedCategoryId: this.state.categories[0].id,
    })

    dispatch({
      type: 'ItemLibrary/fetch',
    });
  }

  getImageName = (name) => {
    const splitedName = name.split('\\')
    const length = splitedName.length
    const res = `${splitedName[length - 1]}`
    return res
  }

  getImagePath = (name) => {
    const splitedName = name.split('\\')
    console.log('getFilteredImagePath,splitedName', splitedName);
    const length = splitedName.length

    var regexp = /\((.+?)\)/g
    const categoryStr = splitedName[length - 1].match(regexp)[0]
    const currentCategoryId = categoryStr.slice(1, -1)
    console.log('getFilteredImagePath,categoryStr', categoryStr);
    console.log('getFilteredImagePath,currentCategoryId', currentCategoryId);
    console.log('getFilteredImagePath,categories', this.state.categories);

    const res = `\\${splitedName[length - 3]}\\${splitedName[length - 2]}\\${splitedName[length - 1]}`

    if (currentCategoryId == this.state.filtedCategoryId) {
      return res
    } else {
      return res
    }
  }

  getFilteredImagePath = (name) => {
    const splitedName = name.split('\\')
    console.log('getFilteredImagePath,splitedName', splitedName);
    const length = splitedName.length
    const res = `\\${splitedName[length - 3]}\\${splitedName[length - 2]}\\${splitedName[length - 1]}`
    return res
  }

  onDeleteImageClick = () => {
    const hide = message.loading('Loading...')
    try {
      const { dispatch, ItemLibrary } = this.props
      const { selectedImageIndex } = this.state

      var ItemLibraryLocal = ItemLibrary.allImages.item3 || []
      ItemLibraryLocal = ItemLibraryLocal.map(each => each.path)

      console.log('onDeleteImageClick, ItemLibraryLocal', ItemLibraryLocal);
      console.log('onDeleteImageClick, selectedImageIndex', selectedImageIndex);

      selectedImageIndex.map(each => {
        const imgName = ItemLibraryLocal[each]
        const res = this.getImageName(imgName)
        console.log('onDeleteImageClick,imgName', imgName);

        dispatch({
          type: 'ItemLibrary/deleteImage',
          payload: res,
          callback: (res) => {

            dispatch({
              type: 'ItemLibrary/fetch',
            });

            this.setState({
              selectedImageIndex: []
            })
          }
        });
      })
      hide()
    } catch {
      message.error('Delete Error.')
    }

  }

  onImageSelected = (index) => {
    const temp = [...this.state.selectedImageIndex, index]
    this.setState({
      selectedImageIndex: temp
    })
  }

  render() {
    const { ItemLibrary } = this.props
    const { currentPage } = this.state
    const { selectedImageIndex, activeTabKey } = this.state
    const operations = selectedImageIndex.length > 0 ?
      <Button
        type="primary"
        danger
        onClick={() => {
          this.onDeleteImageClick()
        }}
      >Delete Image</Button> : null


    // 获取全部图库并排序
    const ItemLibraryLocal = ItemLibrary.allImages.item3 || []
    sort(ItemLibraryLocal).desc(each => new Date(each.uploadTime).getTime())
    console.log('ItemImageLibrary4861,ItemLibraryLocal', ItemLibraryLocal);

    let imagePaths = []
    const totalPageNumber = imagePaths.length
    console.log('totalPageNumber896', totalPageNumber);

    if(this.state.filtedCategoryId !== 'waiting...') {
      // 整理数据并筛选对应的Category
      ItemLibraryLocal.forEach(each => {
        const path = each.path
        const splitedName = path.split('\\')
        const length = splitedName.length

        const regexp = /\((.+?)\)/g
        const categoryStr = splitedName[length - 1].match(regexp)[0]
        const inputName = splitedName[length - 1].match(regexp)[1] || '()'


        console.log('ItemImageLibrary4861,match(regexp)', splitedName[length - 1].match(regexp));

        const currentCategoryId = categoryStr.slice(1, -1)
        const imageName = inputName.slice(1, -1)
        const newPath = `\\${splitedName[length - 3]}\\${splitedName[length - 2]}\\${splitedName[length - 1]}`

        if (currentCategoryId == this.state.filtedCategoryId) {
          imagePaths.push({
            name: imageName,
            link: `http://beautiesapi.gcloud.co.nz/${newPath}`,
          })
        }
      });

       // 获取页码对应的图片
        let range1 = 24 * (currentPage - 1) + 0
        let range2 = 24 * (currentPage - 1) + 24
        imagePaths = imagePaths.slice(range1, range2)
    }
    
   

    return (
      <PageHeaderWrapper
        content="You can manage your image pool on this page."
        style={{ backgroundColor: 'white' }}
      >
        <Tabs
          centered
          style={{ backgroundColor: 'white', padding: '5px 40px 140px 40px' }}
          tabBarExtraContent={operations}
          activeKey={activeTabKey}
          onClick={(event) => { event.stopPropagation() }}
          onTabClick={(key) => {
            if (key === '1') {
              const { dispatch } = this.props;
              dispatch({
                type: 'ItemLibrary/fetch',
              });
            } else {
              this.setState({ inputImageName: '' })
            }
            this.setState({ activeTabKey: key })
            this.setState({ currentPage: 1 })
          }}
        >

          {/* --------------------------- Tab 1 --------------------------- */}
          <TabPane tab="Image Library" key="1">
            <Row>
              <Col span={12} >
                <Select
                  showSearch
                  style={{ width: 200, marginBottom: 20 }}
                  value={this.state.filtedCategoryId}
                  placeholder="Select a category"
                  optionFilterProp="children"
                  onChange={(id) => {
                    this.setState({
                      filtedCategoryId: id
                    })
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.categories.map(each => {
                    return <Option value={each.id}>{each.name}</Option>
                  })}
                </Select>
              </Col>
            </Row>

            {/* ------------------------------- 图片集 ------------------------------- */}
            <Row style={{ minHeight: 500 }}>
              {imagePaths.map((each, index) => {
                const { selectedImageIndex } = this.state
                const myStyle = selectedImageIndex.includes(index) ? styleWithBorder : styleWithoutBorder

                return <Col span={4} style={{ zIndex: 2 }}>
                  <div>
                    <Image
                      preview={false}
                      width={150}
                      height={150}
                      style={{ ...myStyle, ...{ objectFit: 'cover' } }}
                      onClick={() => {
                        if (selectedImageIndex.includes(index)) {
                          const temp = selectedImageIndex.filter(each => each !== index)

                          this.setState({
                            selectedImageIndex: temp
                          })
                        } else {
                          const temp = [...selectedImageIndex, index]
                          this.setState({
                            selectedImageIndex: temp
                          })
                        }
                      }}
                      src={each.link}
                    />
                  </div>
                  <label style={{ fontWeight: 600, marginLeft: 5 }}>{each.name}</label>

                </Col>
              })}
            </Row>

            <Row style={{ marginTop: 30 }}>
              {totalPageNumber > 24 && <Pagination
                style={{ position: 'absolute', right: 40 }}
                current={this.state.currentPage}
                onChange={(page) => { this.setState({ currentPage: page }) }}
                defaultCurrent={1}
                defaultPageSize={24}
                total={totalPageNumber}
                showSizeChanger={false}
              />}
            </Row>

          </TabPane>

          {/* --------------------------- Tab 2 --------------------------- */}
          <TabPane tab="Image Uploader" key="2">
            <Row gutter={20}>
              <Col span={6} offset={6} >
              </Col>

              <Col span={12}  >
                <Select
                  showSearch
                  style={{ width: 200 }}
                  value={this.state.selectedCategoryId}
                  placeholder="Select a category"
                  optionFilterProp="children"
                  onChange={(id) => {
                    this.setState({
                      selectedCategoryId: id
                    })
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.categories.map(each => {
                    return <Option value={each.id}>{each.name}</Option>
                  })}
                </Select>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
              <Col span={12} offset={6} >
                <ImageDragger1
                  inputImageName={this.state.inputImageName}
                  setInputName={(m) => this.setState({inputImageName: m})}
                  selectedCategoryId={this.state.selectedCategoryId}
                  onUploadFinished={() => this.onUploadFinished()}
                />
              </Col>
            </Row>
          </TabPane>

          {/* --------------------------- Tab 3 --------------------------- */}
          {/* <TabPane tab="多图不能剪辑" key="3">
            <Row style={{ marginTop: 20 }}>
              <Col span={12} offset={6} >
                <ImageDragger
                  id={imagePaths.length + 1}
                  onUploadFinished={() => this.onUploadFinished()}
                />
              </Col>
            </Row>
          </TabPane> */}


        </Tabs>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create<CategoriesTreeProps>()(ItemImageLibrary);
