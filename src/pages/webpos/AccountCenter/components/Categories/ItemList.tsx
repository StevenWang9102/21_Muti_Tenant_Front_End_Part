import {
  Card,
  Button,
} from 'antd';
import React, { useState } from 'react';
import ItemsCards from '../ItemsCards';

export const ItemList = (props) => {

  const {
    data,
    currentBranchId,
    updateItemQuantity,
    showAllCategories,
    tabKey,
    onTabChange,
    bundlesList,
    isResumeOrder,
    onItemImageClicked,
  } = props

  
  const categoriesTabList = () => {
    const categoriesList = data?.categoriesList;
    const tabList = [];

    console.log('categoriesList46',categoriesList); // currentBranchId
    console.log('categoriesList46,currentBranchId',currentBranchId); // currentBranchId
    
    for (const i in categoriesList) {
      const node = categoriesList[i];
      if (node.parentCategoryId === null) {
        tabList.push({
          key: node.id,
          tab: node.name,
        });
      }
    }

    console.log('tabList468',tabList);

    var minTabKey = 1;

    if(tabList[0]){
      minTabKey = tabList[0].key
      console.log('tabList468,key',minTabKey);
    }
    
    return {
      categoriesList: tabList.length ? tabList : undefined,
      min: minTabKey.toString(),
    };
  };

  return (
      <Card
        style={{fontWeight: 600}}
        activeTabKey={tabKey || categoriesTabList().min} // 取最小值作为默认
        tabList={categoriesTabList().categoriesList}
        onTabChange={(key) => { onTabChange(key) }}
        bordered={false}
        tabBarExtraContent={
          <Button
            style={{ fontWeight: 500, marginLeft: -20 }}
            onClick={(e) => {
              e.preventDefault();
              showAllCategories();
            }}
          >
            <span>{`>> More`}</span>
          </Button>
        }
      >
        {/* ---------------------- 每一个Card ---------------------- */}
        <ItemsCards
          data={data}
          isResumeOrder={isResumeOrder}
          updateItemQuantity={updateItemQuantity}
          bundlesList={bundlesList || []}
          currentBranchId={currentBranchId}
          selectedCategoryId={tabKey || categoriesTabList().min}
          onItemImageClicked={onItemImageClicked}
        />
      </Card>
  )
}