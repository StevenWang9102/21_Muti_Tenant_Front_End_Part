import React, { useEffect, useState, FC } from 'react'
import { Modal, Form, Button, Input, Row, Col, Tabs, Radio } from 'antd';
import { DatePicker, message, TreeSelect } from 'antd';
import { Select } from 'antd';
import moment from 'moment';
import sort from 'fast-sort';
import jsonpatch from 'fast-json-patch';



const { Option } = Select;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}


function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(0, 7),
    // disabledMinutes: () => range(30, 60),
    // disabledSeconds: () => [55, 56],
  };
}

export const Absence = ({
  form,
  validationOfBeautician,
  setWarningSet,
  validationOfLocation,

  staffName,
  warningSet,
  isDefaultStaffSelected,
  currentBeauticianInfo,
  ALL_STAFF,
  formValues,
  setFormValues,
  myTreeDataLocal,
  filteredRoleUserPairs
}) => {

  console.log('Absence1848,myTreeDataLocal', myTreeDataLocal);
  console.log('Absence1848,filteredRoleUserPairs', filteredRoleUserPairs);

  const NOT_MEMTIONED = 'Not memtioned'
  const myTreeData = myTreeDataLocal.filter(each=>each.title !== NOT_MEMTIONED)

  return (
    <>
      <Form.Item
        label={`${staffName.replace(/^\S/, s => s.toUpperCase())}`}
        name='staff1'
        rules={[{ required: true }]}
        validateStatus={warningSet['Beautician']}
        help={warningSet['Beautician'] === 'error' && 'This beautician is occupied during this time period.'}
      >
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder='Select a beautician'
          value={currentBeauticianInfo.id || ALL_STAFF}
          optionFilterProp="children"
          onChange={(value, option) => {
            // console.log('Select.onChange,value', value);
            // console.log('Select.onChange,option', option);
            // console.log('Select.onChange,option.children', option.children);

            // 设置数据
            setFormValues({
              ...formValues,
              beauticianId1: value,
              beauticianName1: option.children,
            })

            // 验证
            const s1 = form.getFieldValue('startDateTime1')
            const s2 = form.getFieldValue('endDateTime1')
            const beauticianId = value

            console.log('Select18484,s1', s1);
            console.log('Select18484,s2', s2);
            console.log('Select18484,beauticianId', beauticianId);


            if (s2 && s1) {
              var isPassed = validationOfBeautician(s1, s2, beauticianId)
              console.log('Select18484,isPassed', isPassed);

              setWarningSet({
                ...warningSet,
                'Beautician': isPassed ? 'Pass' : 'error'
              })
            }
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >

          {isDefaultStaffSelected && <> {myTreeData.map(each => {
            return <Option value={each.value}>{each.title}</Option>
          })}</>}

          {!isDefaultStaffSelected && <> {filteredRoleUserPairs.map(each => {
            return <Option value={each.userId}>{each.userName}</Option>
          })}</>}

        </Select>
      </Form.Item>

      {/* <Form.Item
        label='Repeat'
        name='repeat'
        rules={[{ required: true }]}
      // validateStatus={warningSet['Beautician']}
      // help={warningSet['Beautician'] === 'error' && 'This beautician is occupied during this time period.'}
      >
        <Select
          showSearch
          style={{ width: "100%" }}
          defaultValue='No_Repeat'
          // placeholder='Select a beautician'
          // value={currentBeauticianInfo.id || ALL_STAFF}
          optionFilterProp="children"
          onChange={(value, option) => {
            console.log('SelectOnChange1841,value', value);
            console.log('SelectOnChange1841,option', option);

            // // 设置数据
            // setFormValues({
            //   ...formValues,
            //   beauticianId1: value,
            //   beauticianName1: option.children,
            // })

          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >

          <Option value='No_Repeat'>No Repeat</Option>
          <Option value='Day'>Daily</Option>
          <Option value='Week'>Weekly</Option>

        </Select>
      </Form.Item> */}

      <Form.Item
        label='Start Date'
        name='startDateTime1'
        rules={[{ required: true }]}
        validateStatus={warningSet['StartAbsence']}
        help={warningSet['StartAbsence'] === 'error' && 'Start Time should be earlier than end time.'}
      >
        <DatePicker
          showTime={{ format: 'HH:mm', minuteStep: 15, use12Hours: true }}
          format="DD/MMM/YYYY HH:mm A"
          style={{ width: '60%' }}
          disabledTime={() => disabledDateTime()}
          onChange={(value) => {
            const beauticianId = form.getFieldValue('staff1')
            const endDateTime = form.getFieldValue('endDateTime1')

            console.log('DatePicker18,value', value);
            console.log('DatePicker18,beauticianId', beauticianId);

            const formatedStart = value.format("x") 
            const formatedEnd = endDateTime.format("x") 

            if(formatedStart > formatedEnd) {
              setWarningSet({
                StartAbsence: 'error',
              })
            } else {
            
              const isPassed = validationOfBeautician(value, endDateTime, beauticianId)

              setWarningSet({
                Beautician: isPassed ? 'Pass' : 'error',
              })
            }


          }}
        />
      </Form.Item>

      <Form.Item
        label='End Date'
        name='endDateTime1'
        rules={[{ required: true }]}
        validateStatus={warningSet['EndAbsence']}
        help={warningSet['EndAbsence'] === 'error' && 'End Time should be later than start time.'}
      >
        <DatePicker
          showTime={{ format: 'HH:mm', minuteStep: 15, use12Hours: true }}
          format="DD/MMM/YYYY HH:mm A"
          style={{ width: '60%' }}
          disabledTime={() => disabledDateTime()}
          onChange={(value) => {
            const beauticianId = form.getFieldValue('staff1')
            const startDateTime = form.getFieldValue('startDateTime1')

            console.log('DatePicker18,value', value);
            console.log('DatePicker18,beauticianId', beauticianId);

            const formatedStart = startDateTime.format("x") 
            const formatedEnd = value.format("x") 

            if(formatedStart > formatedEnd) {
              setWarningSet({
                EndAbsence: 'error',
              })
            } else {
              const isPassed = validationOfBeautician(startDateTime, value, beauticianId)
              setWarningSet({
                Beautician: isPassed ? 'Pass' : 'error',
              })
            }

          }}
        />
      </Form.Item>
    </>
  )
}

