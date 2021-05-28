import React, { useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'umi';
import { Tabs, Row, Col, Image, Select, Pagination, Button } from 'antd';
import sort from 'fast-sort';

const { TabPane } = Tabs;
const { Option } = Select;

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


export const ItemImageLibrary = ({
  dispatch,
  selectedImageIndex,
  setSelectedImageIndex,
  ItemPageLibrary,
  setCurrentImagePath,
  setImagePathFromLibrary,
  imageUploaderVis,
  onCancel,
  onComfirm
}) => {

  const WATING_DATA = 'Waiting data...'
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTabKey, setActiveTabKey] = useState("1")
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(WATING_DATA)
  const [filtedCategoryId, setFilteredCategoriesId] = useState(WATING_DATA)
  const [inputImageName, setInputImageName] = useState('')
  const [localImagePath, setLocalImagePath] = useState('')

  console.log('imageUploaderVis481', imageUploaderVis);


  useEffect(() => {

    dispatch({
      type: 'ItemPageLibrary/fetch',
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
        setCategories(res)
        setFilteredCategoriesId(res[0].id)
        setSelectedCategoryId(res[0].id)
      }
    });
  }, [])



  // 获取全部图库并排序
  const ItemLibraryLocal = ItemPageLibrary.allImages.item3 || []
  sort(ItemLibraryLocal).desc(each => new Date(each.uploadTime).getTime())
  console.log('ItemImageLibrary4861,ItemLibraryLocal', ItemLibraryLocal);

  let imagePaths = []
  const totalPageNumber = imagePaths.length
  console.log('totalPageNumber896', totalPageNumber);

  if (filtedCategoryId == WATING_DATA) {

  } else {

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

      if (currentCategoryId == filtedCategoryId) {
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

  const operations = (<div>
    {selectedImageIndex == -1 ? <>

      <Button style={{ marginRight: 15 }} key="back" onClick={() => onCancel()}>
        Cancel </Button>
    </> :
      <>
        <Button style={{ marginRight: 15 }} key="submit" type="primary" onClick={() => {
          onComfirm(localImagePath)
          setCurrentImagePath(localImagePath)
          setImagePathFromLibrary(localImagePath)
        }}> Comfirm </Button>

        <Button style={{ marginRight: 15 }} key="back" onClick={() => onCancel()}>
          Cancel </Button></>}

  </div>)

  return (
    <Tabs
      tabBarExtraContent={operations}
      style={{ backgroundColor: 'white', padding: '5px 40px 140px 40px' }}
      activeKey={activeTabKey}
      onClick={(event) => { event.stopPropagation() }}
      onTabClick={(key) => {
        if (key === '1') {
          dispatch({
            type: 'ItemLibrary/fetch',
          });
        } else {
          setInputImageName('')
        }
        setActiveTabKey(key)
        setCurrentPage(1)
      }}
    >

      {/* --------------------------- Tab 1 --------------------------- */}
      <TabPane tab="Image Library" key="1">
        <Row>
          <Col span={12} >
            <Select
              showSearch
              style={{ width: 200, marginBottom: 20 }}
              value={filtedCategoryId}
              placeholder="Select a category"
              optionFilterProp="children"
              onChange={(id) => {
                setFilteredCategoriesId(id)
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {categories.map(each => {
                return <Option value={each.id}>{each.name}</Option>
              })}
            </Select>
          </Col>
        </Row>

        {/* ------------------------------- 图片集 ---------------------------- */}
        <Row style={{ minHeight: 500 }}>
          {imagePaths.map((each, index) => {
            const myStyle = selectedImageIndex == index ? styleWithBorder : styleWithoutBorder

            return <Col span={4} style={{ zIndex: 2 }}>
              <div>
                <Image
                  preview={false}
                  width={130}
                  height={130}
                  style={{ ...myStyle, ...{ objectFit: 'cover' } }}
                  onClick={() => {
                    console.log('onImageSelcet,each', each.link);
                    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    // setCurrentImagePath(each.link)
                    // setImagePathFromLibrary(each.link)
                    setLocalImagePath(each.link)
                    setSelectedImageIndex(index)
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
            current={currentPage}
            onChange={(page) => { setCurrentPage(page) }}
            defaultCurrent={1}
            defaultPageSize={24}
            total={totalPageNumber}
            showSizeChanger={false}
          />}
        </Row>

      </TabPane>
    </Tabs>
  );
}

export default
  connect(({
    ItemPageLibrary,
  }) => ({
    ItemPageLibrary: ItemPageLibrary,
  }))
    (ItemImageLibrary);