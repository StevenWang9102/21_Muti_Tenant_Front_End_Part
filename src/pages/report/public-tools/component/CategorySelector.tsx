import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { Dispatch } from 'umi';

const { Option } = Select;

interface BranchSelectorInterface {
  fromPage: string,
  branchNameIds?: object,
  allCategoryNames: any,
  currentCategoryName: string,
  dispatch: Dispatch;
  setCurrentBranchId: (string) => void,
  setCurrentBranchName: (string) => void,
  setBreadSliceName: (string) => void,
  allBranchReport?: object | undefined,
  setSearchType?: (string) => void,
  setCurrentCategoryId?: (string) => void,
  setIsCategorySelected?: (boolean) => void,
}

export const CategorySelector = (props: BranchSelectorInterface) => {
  const { setCurrentCategoryId, allCategoryNames, setBreadSliceName, setIsCategorySelected } = props;
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    const temp = allCategoryNames && allCategoryNames[0] && allCategoryNames[0].name
    setCategoryName(temp)
    setIsCategorySelected(true)
  }, [allCategoryNames])

  const onSelectChange = (value) => {

    const temp = allCategoryNames.filter(each => each.id == value)[0]
    console.log('onChange41891,allCategoryNames', allCategoryNames);
    console.log('onChange41891,value', value);
    console.log('onChange41891,temp', temp);
    setCategoryName(`${temp.name}`)
    setIsCategorySelected(true)
    setBreadSliceName(''); // 清空Bread Slice的选中状态
    setCurrentCategoryId(value)
  }

  return (
    <section style={{ marginLeft: 'auto', marginRight: 'auto' }}>

      <label style={{ margin: '0 22px 0 10px', width: 120 }}>
        <b>Category</b>
      </label>

      <Select
        showSearch
        style={{ width: 400 }}
        placeholder="Please select a category..."
        value={categoryName}
        optionFilterProp="children"
        onChange={function handleChange(value) {

          onSelectChange(value)


        }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {allCategoryNames &&
          allCategoryNames.map((each, index) => {
            return <Option value={each.id}>{each.name}</Option>;
          })}
      </Select>
    </section>
  );
};
