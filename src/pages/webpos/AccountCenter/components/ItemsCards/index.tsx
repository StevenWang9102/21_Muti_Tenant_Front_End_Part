import { Card, List, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { TableListItem as ItemParams } from '../../../../items/items/data';
import { StateType } from '../../model';
import { basicGray } from '../../../../public-component/color'
import { Row, Col, message } from 'antd';
import styles from './styles.less';
import moment from 'moment';
import placeHolder from '../../../../public-component/Images/imagePlaceHolder1.png'
import * as service from '../../service';


const imagePath = 'http://beautiesapi.gcloud.co.nz/'
const formate = 'YYYY-MM-DD'


interface ItemListType extends Partial<StateType> {
  loading: boolean;
  itemList: ItemParams[];
  selectedCategoryId: number;
  currentBranchId: number;
  onItemImageClicked: (itemId: number, quantity: number, commitPriceInclGst: number) => void;
}


// ========================================== Barcode Filter ==========================================
const itemBarcoderFilter = (itemList, currentBranchId) => {
  console.log('itemBarcoderFilter,itemList', itemList);
  console.log('itemBarcoderFilter,currentBranchId', currentBranchId);

  let newItemList = []
  // 过滤掉不存在code的
  const currentItemsList = itemList?.filter(item => item.code !== null) || [];
  console.log('itemBarcoderFilter,currentItemsList', currentItemsList);

  // 过滤掉不活跃的Branch
  currentItemsList.forEach(each => {
    const branchItems = each.branchItems.filter((every) => every.branchId === currentBranchId)
    const isInactiveBranch = branchItems[0] && branchItems[0].isInactive // 如果Item分支关闭

    if (!isInactiveBranch) {
      const branchItemInfo = each.branchItems.filter(each => each.branchId == currentBranchId)[0] || {}
      const newItem = {
        ...each,
        priceInclGst: branchItemInfo.priceInclGst || each.priceInclGst
      }
      newItemList.push(newItem)
    }
  })
  console.log('itemBarcoderFilter,newItemList', newItemList);
  return newItemList
}


const bundleBarcoderFilter = (bundleList, currentBranchId) => {
  const tempBundleList = []
  const currentDate = moment(new Date()).format(formate)
  console.log('categoryBundlesList,bundleList', bundleList);

  // 过滤掉没有Code
  var currentBundleList = currentBundleList?.filter(bundle => bundle.code !== null) || [];
  console.log('categoryBundlesList,currentBundleList', currentBundleList);

  // 过滤时间
  currentBundleList = currentBundleList?.filter(bundle => moment(bundle.startDateTime).format(formate) <= currentDate
    && moment(bundle.endDateTime).format(formate) >= currentDate) || [];

  // 过滤掉不活跃的Branch
  currentBundleList.forEach(each => {
    const branchBundleInfo = each.branchItems.filter((every) => every.branchId === currentBranchId)
    const bundleItems = each.bundleItemsPerBundle.map((every) => `${every.itemName}×${every.quantity}`)

    const isInactiveBranch = branchBundleInfo[0] && branchBundleInfo[0].isInactive
    const priceInclGst = branchBundleInfo[0] && branchBundleInfo[0].priceInclGst
    const payload = {
      id: each.id, // ok
      name: each.name, // ok
      bundleItems: bundleItems,
      isInactiveBranch: isInactiveBranch, // ok
      picturePath: each.picturePath, // ok
      priceInclGst: priceInclGst,
      isBundle: true,
    }
    if (!isInactiveBranch) tempBundleList.push(payload)
  })

  console.log('categoryBundlesList，tempBundleList', tempBundleList);
  return tempBundleList
}


// ----------------------------------------- 组件 -----------------------------------------
const ItemsCards: React.FC<Partial<ItemListType>> = (
{ 
  data, 
  dispatch, 
  selectedCategoryId, 
  updateItemQuantity, 
  onItemImageClicked, 
  currentBranchId,
  isResumeOrder,
}) => {

  const [renderList, setRenderList] = useState([])
  const [itemList, setItemList] = useState([]);
  const [bundleList, setBundleList] = useState([]);
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(1)
  const [imageErrorId, setImageErrorId] = useState({})

  console.log('fetchInitialData14894,data', data);


  useEffect(() => {
    console.log('currentBranchId49', currentBranchId);
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    const itemList = await service.fetchItems();
    const bundleList = await service.fetchBundles();

    console.log('fetchInitialData14894,itemList', itemList);
    console.log('fetchInitialData14894,bundleList', bundleList);

    setItemList(itemList)
    setBundleList(bundleList)
    setLoading(false)
  };

  console.log('categoryBundlesList,renderList', renderList);
  console.log('categoryBundlesList,selectedCategoryId', selectedCategoryId);

  useEffect(() => {
    // 获取Branch Item（携带CategoryID）
    console.log('useEffect1681,selectedCategoryId', selectedCategoryId);
    console.log('useEffect1681,currentBranchId', currentBranchId);

    if (selectedCategoryId && currentBranchId) {
      // alert('我刚刚拿到Branch信息')
      sourceDataMaker(currentBranchId)
    }

  }, [selectedCategoryId, currentBranchId, currentPage])

  const resumeOrder = data.currentOrder
  useEffect(() => {
    // 根据Order中的Branch，获取Branch Item
    const resumeBranchId = resumeOrder && resumeOrder.branchId

    if(isResumeOrder) {
      console.log('useEffect481681,selectedCategoryId', selectedCategoryId);
      console.log('useEffect481681,resumeBranchId', resumeBranchId);
  
      if (selectedCategoryId && resumeBranchId) {
        sourceDataMaker(resumeBranchId)
      }
    }
  }, [selectedCategoryId, resumeOrder, currentPage])

 

  
  const sourceDataMaker = (branchId)=>{
    dispatch({
      type: 'currentPOSData/requestBranchItem',
      payload: {
        categoryId: selectedCategoryId,
        branchId: branchId,
        pagenumber: currentPage || 1
      },
      callback: (res) => {
      
        const pagination = res.response.headers.get('x-pagination')
        const totalCount = JSON.parse(pagination).TotalCount

        var counter = 0
        console.log('res545,1', res);

        const temp = []

        res.data.forEach(each => {
          console.log('res545,each', each);

          if (!each.isInactive) {
            temp.push({
              id: each.id,
              isInactiveBranch: each.isInactive,
              isBundle: each.isBundle,
              name: each.name,
              priceInclGst: each.branchPriceInclGst,
              bundleItems: each.bundleItems,
              picturePath: each.picturePath,
            })
          } else {
            // 计算被过滤掉多少
            counter++;
          }
        })

        console.log('temp215', temp);
        console.log('res545,counter', counter);
        console.log('res545,totalCount', totalCount);

        setRenderList(temp)
        setTotalCount(totalCount - counter)
      }
    });
  }

  
  useEffect(() => {
    // 设置Bar Code
    const temp1 = itemBarcoderFilter(itemList, currentBranchId)
    const temp2 = bundleBarcoderFilter(bundleList, currentBranchId)
    const items = [...temp1, ...temp2]
    console.log('categoryBundlesList,items', items);

    dispatch({
      type: 'currentPOSData/allItemWithCode',
      payload: {
        items: items
      }
    });

  }, [itemList, bundleList, currentBranchId])

  useEffect(() => {
    // 页码归位为1
    setCurrentPage(1)
  }, [selectedCategoryId])

  // 如果当前订单，已经支付过，则不能修改
  let canNotAdd = false;
  if (data.currentInvoice) {
    const currentInvoice = data.currentInvoice[0] || {};
    if (currentInvoice.balanceInclGst < currentInvoice.totalInclGst)
      canNotAdd = true
    else canNotAdd = false
  } else canNotAdd = false

  const gridSetting = {
    gutter: [12, 15],
    xxl: 4, // ≥1600px
    xl: 3, // ≥1200px
    lg: 3, // ≥992px
    md: 4, // ≥768px
    sm: 3, // ≥576px
    xs: 1  // <576px
  }

  const bundleItems = (item) => {
      console.log('item.bundleItems', item.bundleItems);
      if(item.isBundle){
        if (item.bundleItems.length === 0) {
          return '(No items)'
        } else {
          const temp = item.bundleItems.map(each=> `${each.itemName} x ${each.quantity} `)
          return`(${temp.join(', ')})`
        }
      } else {
        return ''
      }
  }


  const getImageCover = (item) => {
    if (item.picturePath === '' || item.picturePath === null || imageErrorId[item.id] == 'error') {
      return <img style={{ height: 100, objectFit: 'cover', opacity: 0.4 }} src={placeHolder} alt='' />
    } else {
      return <img
        alt={item.name}
        style={{ height: 100, width: "100%", objectFit: 'cover' }}
        src={`${imagePath}${item.picturePath}`}
        onError={() => {
          console.log('getImageCover,item', item);
          const temp = { ...imageErrorId, ...{ [item.id]: 'error' } }
          setImageErrorId(temp)
        }}
      />
    }
  }
  const onCardClicked = (item) => {
    if (canNotAdd) {
      message.warning('This invoice has been created, you can not add item.')
    } else {
      const itemId = item.id

      if (recordedItemId.includes(itemId)) {
        // 如果点击的是同一个，那我我们并不执行添加OrderItem的动作,
        // 而是执行在原有OrderItem上，修改Quantity的动作
        const orderId = currentOrder.id
        const targetOrderItem = currentOrder.orderItems.filter(each => each.itemId == itemId)[0]
        const orderItemId = targetOrderItem && targetOrderItem.id
        const expectedQuantity = targetOrderItem.quantity + 1

        const payload = {
          orderId: orderId,
          orderItemId: orderItemId,
          body: [{ op: "replace", path: "/quantity", value: expectedQuantity }],
        }

        updateItemQuantity(payload)
        dispatch({
          type: 'currentPOSData/highLightItem',
          payload: {
            type: 'update',
            orderItemId: orderItemId,
          }
        });
      } else {
        onItemImageClicked(item.id, 1, item.priceInclGst)
        dispatch({
          type: 'currentPOSData/highLightItem',
          payload: {
            type: 'create',
            itemId: item.id,
          }
        });
      }
    }
  }
  const currentOrder = data.currentOrder || {};
  const orderItems = currentOrder.orderItems || [];
  const recordedItemId = orderItems.map(each => each.itemId);


  return (
    <>
      <List<ItemParams>
        className={styles.main}
        rowKey="id"
        grid={gridSetting} // 后面的数字是Column
        loading={loading}
        dataSource={renderList}
        renderItem={(item: any, index) => {
          // console.log('renderItem,item3', item.isBundle);

          // -------------------------------- 子集 --------------------------------
          if (item.isInactiveBranch) return null
          else {
            return <List.Item style={{
              padding: 0, marginBottom: 10, height: 200, width: 200 
            }}>
              <Card
                hoverable
                loading={loading}
                style={{ padding: 0, maxWidth: 150, minWidth: 130, height: 220 }}
                cover={getImageCover(item)}
                onClick={() => { 
                  onCardClicked(item)
                  console.log('onCardClicked165', item);
                  
                 }}
              >
                <Card.Meta
                  title={<div
                  style={{color: '#1890FF', width: '100%', whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: "break-word"}}
                  >{item.isBundle ? `*${item.name}` : `${item.name}`}</div>}
                />
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'black', marginTop: '10px', wordWrap: 'break-word' }}>
                  {bundleItems(item)}
                </p>

                <p style={{ fontSize: '14px', color: 'black', overflow: 'visible', wordWrap: 'break-word' }}>
                  {`$ ${item.priceInclGst && item.priceInclGst.toFixed(2)}`}
                </p>

              </Card>
            </List.Item>
          }
        }}
      />

      <Pagination
        style={{ marginTop: 30 }}
        defaultCurrent={1}
        pageSize={20}
        pageSizeOptions={[]}
        current={currentPage}
        total={totalCount}
        hideOnSinglePage={true}
        onChange={(page, pageSize) => {
          setCurrentPage(page)
        }}
      />
    </>
  )
};

export default connect(
  ({
    loading,
    currentPOSData
  }: {
    loading: { effects: { [key: string]: boolean } },
    currentPOSData: StateType
  }) => ({
    itemList: currentPOSData.data.itemList,
    loading: loading.effects['currentPOSData/fetchBasicInfo'],
  }))(ItemsCards);
