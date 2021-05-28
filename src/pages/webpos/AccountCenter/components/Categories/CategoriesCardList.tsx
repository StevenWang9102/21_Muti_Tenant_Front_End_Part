import {
  Card,
  Drawer,
} from 'antd';
import React, { CSSProperties } from 'react';
const { Meta } = Card;


export const CategoriesCardList = (props) => {
  const { currentPOSData: { data }, tabKey, onTabChange, visiableCategoryCard, closeAllCategoriesModal } = props;

  console.log('currentPOSData=', data);
  console.log('this.props=', props); // categoriesList

  const categoriesList =
    typeof data?.categoriesList === 'undefined'
      ? data?.categoriesList
      : data.categoriesList.filter((item) => item.parentCategoryId === null);

  const gridStyle: CSSProperties = {
    display: 'inline-block',
    width: '33%',
    padding: '2px',
    textAlign: 'center',
    // height: '160px',
  };

  return (
    <Drawer
      title="All Categories"
      placement={'right'}
      closable={false}
      width={530}
      height={400}
      onClose={closeAllCategoriesModal}
      visible={visiableCategoryCard}
    >
      <Card
        bordered={true}
        activeTabKey={tabKey}
        onTabChange={(key) => {
          onTabChange(key)
        }}
      >
        {/* ---------------------------- 子卡片集合 ---------------------------- */}
        {categoriesList?.map((each) => {
          const cover = each.picturePath ? 
          <img
            style={{ padding: '5px 5px 0 5px', height: 100 }}
            alt= {`${each.name}`}
            src={`http://beautiesapi.gcloud.co.nz/${each.picturePath}`}
          /> :
            <div
              style={{ padding: '5px 5px 0 5px', height: 100 }}
            > 
            </div>
          return (
            <Card
              hoverable
              style={gridStyle}
              onClick={() => {
                onTabChange(each.id.toString())
                closeAllCategoriesModal()
              }}
              cover={cover}
            >
              <Meta
                title={`${each.name}`}
              />
            </Card>
          )
        })}
      </Card>
    </Drawer>
  );
};