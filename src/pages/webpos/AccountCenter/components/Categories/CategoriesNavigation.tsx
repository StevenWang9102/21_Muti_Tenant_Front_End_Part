import {
  Card,
  Button,
} from 'antd';
import React, { CSSProperties } from 'react';
import Projects from '../ItemsCards';


export const CategoriesNavigation = (props) => {
  const { currentPOSData: { data }, styles, showAllCategories, tabKey, onTabChange, onItemImageClicked } = props;

  const categoriesTabList = () => {
    const categoriesList = data?.categoriesList;
    const tabList = [];

    for (const i in categoriesList) {
      const node = categoriesList[i];
      if (node.parentCategoryId === null) {
        tabList.push({
          key: node.id,
          tab: node.name,
        });
      }
    }
    return tabList.length ? tabList : undefined;
  };

  return (
    <Card
      className={styles.tabsCard}
      bordered={false}
      tabList={categoriesTabList()}
      tabBarExtraContent={
        <Button
          onClick={(e) => {
            e.preventDefault();
            showAllCategories();
          }}
        >
          More Categories
      </Button>
      }
      activeTabKey={tabKey}
      onTabChange={onTabChange} // 控制下面切换的页面
    >
      <Projects categoryId={tabKey} onItemImageClicked={onItemImageClicked} />
    </Card>


  );
};