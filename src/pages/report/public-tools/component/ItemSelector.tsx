import React, { useEffect, useState} from 'react';
import { Select } from 'antd';
import { searchItemNameWithIds } from '../../category-report/functions/getBranchNameWithIds';
import sort from 'fast-sort';


const { Option } = Select;

interface ItemSelector {
  fromPage: string,
  allItemNames: any,
  currentItemName?: string,
  setCurrentItemName: (string)=>void
  setSelectedItem: (number)=>void
  setBreadSliceName: (string)=>void
}

export const ItemSelector = (props: ItemSelector) => {
  const { fromPage, allItemNames, setSelectedItem, setCurrentItemName, setBreadSliceName=()=>{} } = props;
  const [currentSelectValue, setCurrentSelectedValue] = useState('Loading Items...')
  sort(allItemNames).asc(item => item.name)
  useEffect(() => {
    allItemNames && allItemNames[0] && setSelectedItem(allItemNames[0].id);
  }, []);

  useEffect(() => {
    if(allItemNames.length !==0){
      setCurrentSelectedValue(allItemNames[0] && allItemNames[0].name)
      setCurrentItemName(allItemNames[0] && allItemNames[0].name)
    }
  }, [allItemNames]);


  const myStyle = {
    margin: '0 40px 0 10px',
    marginLeft: '-75px',
    width: 120,
  };

  return (
    <section style={{ marginLeft: 'auto', marginRight: 'auto' }}>

      <label style={myStyle}>
        <b>Item Name or Code</b>
      </label>

      <Select
        showSearch
        style={{ width: 400 }}
        value={currentSelectValue}
        optionFilterProp="children"
        onChange={function handleChange(value) {
          setCurrentSelectedValue(value)
          setCurrentItemName(value)
          setBreadSliceName('')
          
          if (fromPage === 'Payment') {
          } 
          
          else if (fromPage === 'ItemDailyReport') {
            const itemIndex = searchItemNameWithIds(allItemNames);
            const itemId = itemIndex[value];
            setSelectedItem(itemId);
          } 
          
          else if (fromPage === 'Item') {
            const itemIndex = searchItemNameWithIds(allItemNames);
            const itemId = itemIndex[value];
            setSelectedItem(itemId);
          } 

          else if (fromPage === 'ItemBranchReport') {
            const itemIndex = searchItemNameWithIds(allItemNames);
            const itemId = itemIndex[value];
            setSelectedItem(itemId);
          } 
          
          else {
          }
        }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {allItemNames.length === 0? <Option value={0}> Loading items...</Option>
        : allItemNames.map((each, index) => {
          console.log('each888', each);
          const itemName = each.description? `${each.name}(${each.description})` :`${each.name}`
          return <Option value={each.name}>{itemName}</Option>;
        })}
      </Select>
    </section>
  );
};
