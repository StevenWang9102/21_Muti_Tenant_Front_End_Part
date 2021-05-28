import { basicBlue } from '../../../../public-component/color'
import React, { useState } from 'react';
import { Form } from '@ant-design/compatible';
import { Select, Col, Input } from 'antd';

const { Option } = Select;


export const MemberSelector = ({
  isInvoiceExist,
  selectedCustomerId,
  currentOrder,
  updateOrderMember,
  memeberList,
  setSelectedCustomerId,
}) => {

  console.log('MemberSelector,memeberList', memeberList);

  const onSelectChange = (value )=>{
    setSelectedCustomerId(value.toString())

    // 更新动作
    if (currentOrder && currentOrder.id) {
      updateOrderMember(value.toString())
    }
  }

  const memeberListLocal = memeberList.filter(each=> each.firstName !=='Absence' && each.lastName !=='Absence')

  return (
    <section>
      <label style={{ fontWeight: 600 }}>Member: </label>

      <Select
        showSearch
        disabled={isInvoiceExist}
        style={{ width: 250, marginTop: 20, marginLeft: 10 }}
        placeholder="Select a member"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        value={selectedCustomerId == '' ? 'Select a name' : selectedCustomerId}
        onChange={(value, options) => onSelectChange(value, options)}

        onKeyDown={(event) => {
          if (event.keyCode == 13) {
            const inputValue = event.target.value
            const resultMember = memeberList && memeberList.filter(each => each.barcode == inputValue)[0]
            console.log('onKeyDown498, memeberList', memeberList);
            console.log('onKeyDown498, resultMember', resultMember);
            if(resultMember && resultMember.id){
              onSelectChange(resultMember.id)
            }
          }
        }}
      >
        {Array.isArray(memeberListLocal) && memeberListLocal.map(each => {
          const nameArr = [`${each.firstName}`, `${each.middleName || ''}`, `${each.lastName}`]
          const code = each.barcode

          if (code) {
            return <Option value={each.id} code={code}>{`${nameArr.join(' ')} (${code})`}</Option>
          } else {
            return <Option value={each.id} code={code}>{`${nameArr.join(' ')}`}</Option>
          }

        })}
      </Select>
    </section>
  )
}