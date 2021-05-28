import React, { useEffect, useState, FC } from 'react'
import { Modal, Form, Button, Input, Row, Col, Space } from 'antd';
import { HashRouter as Router } from "react-router-dom";
import { unique} from '../functions/unique'
import { DatePicker, message, TreeSelect  } from 'antd';
import { Select } from 'antd';
import moment from 'moment';
import sort from 'fast-sort';
import jsonpatch from 'fast-json-patch';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const { Option } = Select;
const NOT_MEMTIONED = 'Not memtioned'
const WAITING_DATA = 'Waiting data...'

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

interface DateTime {
  startDate: any;
  startTime: any;
  endDate: any;
  endTime: any;
}

export const CreateModal = ({
  currentBranchInfo,
  branchList = [],
  dispatch,
  visible,
  locationList,
  onCancelButtonClick,
  setVisible,
  fetAllReservation,
  selectedTime,
  reservationList,
  myTreeData,
  ALL_BEAUTICIAN,
}) => {

  const [form] = Form.useForm()
  const [membersList, setMembersList] = useState<any>([])
  const [loading, setLoading] = useState<any>(false)
  // const [roleList, setRoleList] = useState<any>({})
  const [formValues, setFormValues] = useState<any>({})
  const [warningSet, setWarningSet] = useState({});
  const [minuteStep, setMinuteStep] = useState(15);
  const [myTreeDataLocal, setMyTreeDateLocal] = useState([]);
  
  // console.log('roleUsePairs41981', roleUserPairs);
  console.log('roleUsePairs41981,myTreeData', myTreeData);

useEffect(() => {
  // 设置新的Beautician
  const temp1 = [{
    selectable: true,
    title: NOT_MEMTIONED,
    value: NOT_MEMTIONED,
    children: [],
  }]

  const temp2 = myTreeData && myTreeData.filter(each=>each.title != ALL_BEAUTICIAN)
  setMyTreeDateLocal([...temp1, ...temp2])
}, [myTreeData]);


  useEffect(() => {
    if (visible) {
      dispatch({
        type: `menberManagement/fetchMembers`,
        callback: (res) => {
          console.log('fetchMembers,res', res.data);
          const temp = res.data
          sort(temp).asc(each => each.firstName)
          setMembersList(temp)
        }
      });

      setWarningSet({})
    } else {
      form.resetFields()
    }
  }, [visible]);


  useEffect(() => {
    // 设置初始时间
    console.log('selectedTime18',selectedTime);
    
    if(selectedTime && selectedTime.start){
      form.setFieldsValue({
        startDateTime: moment(selectedTime.start),
        endDateTime:  moment(selectedTime.end),
      })
    }    
  }, [selectedTime]);

  // ------------------------------ 验证理发师时间 ------------------------------
  const validationOfBeautician = (startDateTime, endDateTime)=>{
    // alert('验证美容师')
    const beauticianId = form.getFieldValue('staff')

    if(beauticianId && beauticianId !== NOT_MEMTIONED){
      const slicedBeauticianId = form.getFieldValue('staff').slice(0, 36) 
      const relevantBeauticianBookings = reservationList.filter(each=> each.extendedProps.beauticianId == slicedBeauticianId )
      const targetStartDateTime = startDateTime && startDateTime.format("x") // Unix timestamp
      const targetEndDateTime = endDateTime && endDateTime.format("x")
  
      console.log('validationOfBeautician,startDateTime',startDateTime);
      console.log('validationOfBeautician,endDateTime',endDateTime);
      console.log('validationOfBeautician,slicedBeauticianId',slicedBeauticianId);
  
      let flag = []
  
      relevantBeauticianBookings.forEach(each => {
        const startDateTime = moment(each.start).format("x") // Unix timestamp
        const endDateTime = moment(each.end).format("x") // Unix timestamp
        const situation1 = (targetStartDateTime <= startDateTime) && (targetEndDateTime <= startDateTime)
        const situation2 = (targetStartDateTime >= endDateTime) && (targetEndDateTime >= endDateTime)
        
        console.log('validationOfBeautician,relevantBeauticianBookings', relevantBeauticianBookings);
  
        // 任意的选中时间，都必须在区间外面，
        if(situation1 || situation2){
          flag.push(true)
        } else {
          flag.push(false)
        }
      });
    
      if(flag.includes(false)){
        return false
      } else return true
    } else {
      return true
    }
    
  }


  // ---------------------------------- 验证地址的占有情况 ----------------------------------
  const validationOfLocation = (startDateTime, endDateTime, locationId)=>{
    // alert('验证地址')

    if(locationId && locationId !== NOT_MEMTIONED){
      const relevantLocationBookings = reservationList.filter(each=> each.extendedProps.locationId == locationId)
      const targetStartDateTime = startDateTime && startDateTime.format("x") // Unix timestamp
      const targetEndDateTime = endDateTime && endDateTime.format("x")
  
      console.log('validationOfLocation,startDateTime',startDateTime);
      console.log('validationOfLocation,endDateTime',endDateTime);
      console.log('validationOfLocation,locationId',locationId);
      console.log('validationOfLocation,relevantLocationBookings',relevantLocationBookings);
      let flag = []
  
      relevantLocationBookings.forEach(each => {
        const startDateTime = moment(each.start).format("x") // Unix timestamp
        const endDateTime = moment(each.end).format("x") // Unix timestamp
  
        const situation1 = (targetStartDateTime <= startDateTime) && (targetEndDateTime <= startDateTime)
        const situation2 = (targetStartDateTime >= endDateTime) && (targetEndDateTime >= endDateTime)
        
        // 任意的选中时间，都必须在区间外面，
        if(situation1 || situation2) flag.push(true)  
        else flag.push(false)
      });
      return !flag.includes(false)
    } else {
      return true
    }
    
  }


  const onCreateClick = () => {
    const values = form.getFieldsValue()
    console.log('onCreateClick,values', values); 
    console.log('onCreateClick,formValues', formValues); 

    if (values.startDateTime && values.endDateTime && values.name) {
      
      const startDate = moment(values.startDateTime).format()
      const endDate = moment(values.endDateTime).format()

      console.log('onCreateClick,formate,startDate', startDate);
      console.log('onCreateClick,formate,endDate', endDate);

      const isStaffApplied = values.staff && values.staff !== NOT_MEMTIONED
      const isLocationApplied = values.locationId && values.locationId !== NOT_MEMTIONED

      const body = {
        "branchId": currentBranchInfo.branchId,
        "start": startDate,
        "end": endDate,
        "customerId": values.name.slice(0, 36),
        "customerName": values.name.slice(36, values.name.length),
        'locationId': isLocationApplied ? values.locationId : '',

        "isBeauticianApplied": isStaffApplied ? true : false,
        "beauticianId": isStaffApplied ? formValues.beauticianId : null,
        "beauticianName": isStaffApplied ? formValues.beauticianName : null,
      }

      console.log('createReservation,body',body);
      setLoading(true)
      dispatch({
        type: 'reservation/createReservation',
        payload: {
          body: body
        },
        callback: (res) => {
          console.log('create976,res',res.data);
          // onUpdateClick(res.data)
          // fetAllReservation()
          // setVisible(false)
          fetAllReservation()
          setVisible(false)
          setLoading(false)
        }
      })

    } else {
      message.error('Please check your customer name and date.')
    }
  }

  

  return (
    <Router>
      <Modal
        maskClosable={true}
        visible={visible}
        destroyOnClose={true}
        onCancel={() => { onCancelButtonClick() }}
        width='650px'
        bodyStyle={{ padding: '40px 60px' }}
        footer={[
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => onCreateClick()}
            loading={loading}
          >
            Create
        </Button>,
        
          <Button
            onClick={() => { onCancelButtonClick() }}
          >
            Cancel
      </Button>]}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
        >
          <>
            <h3 style={{ margin: '20px 0 15px 20px' }}>Basic Information</h3>
            <Form.Item
              label='Customer Name'
              name='name'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
              >
                {membersList.length == 0 ? <Option value={WAITING_DATA}>{WAITING_DATA}</Option> : <>{membersList.map(each => {
                  const value = each.id;
                  const name = []
                  if (each.firstName) name.push(each.firstName)
                  if (each.middleName) name.push(each.middleName)
                  if (each.lastName) name.push(each.lastName)

                  return <Option value={`${value}${name.join(' ')}`}>{name.join(' ')}</Option>
                })}</>}

              </Select>
            </Form.Item>

            <Form.Item
              label='Start Date'
              name='startDateTime'
              rules={[{ required: true }]}
            >
                <DatePicker 
                  showTime={{ format: 'HH:mm', minuteStep: minuteStep, use12Hours: true }}
                  format="DD/MMM/YYYY HH:mm"
                  style={{width: '60%'}}
                  onChange={(value)=>{
                    console.log('DatePicker18,value', value);
                    const beauticianId = form.getFieldValue('staff')
                    const locationId = form.getFieldValue('locationId')
                    const endDateTime = form.getFieldValue('endDateTime')

                    console.log('DatePicker18,beauticianId', beauticianId);
                    console.log('DatePicker18,locationId', locationId);

                    const isPassed = validationOfBeautician(value, endDateTime )
                    const isPassed1 = validationOfLocation(value, endDateTime, locationId)
                  
                    setWarningSet({
                      Beautician: isPassed? 'Pass': 'error',
                      Location: isPassed1? 'Pass': 'error',
                    })
                                
                  }}
                />
            </Form.Item>

            <Form.Item
              label='End Date'
              name='endDateTime'
              rules={[{ required: true }]}
            >
                <DatePicker 
                  showTime={{ format: 'HH:mm', minuteStep: 15, use12Hours: true }}
                  format="DD/MMM/YYYY HH:mm"
                  style={{width: '60%'}}
                />
            </Form.Item>

            <h3 style={{ margin: '50px 0 15px 20px' }}>Service Information</h3>



            <Form.Item
              label='Beautician'
              name='staff'
              validateStatus={warningSet['Beautician']}
              help={warningSet['Beautician'] === 'error' && 'This beautician is occupied during this time period.'}
            >

              <TreeSelect
                style={{ width: '100%' }}
                showArrow={false}
                showSearch={true}
                defaultValue={NOT_MEMTIONED}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={myTreeDataLocal}
                listHeight={400}
                placeholder="Please select"
                onChange={(value, option)=> {
                  // 设置新的Beautication 

                  console.log('TreeSelect.onChange,value', value);
                  console.log('TreeSelect.onChange,option', option[0]);

                  // 设置数据
                  setFormValues({
                    ...formValues,
                    beauticianId: value,
                    beauticianName: option[0],
                  })

                  // 验证
                  const s1 = form.getFieldValue('startDateTime')
                  const s2 = form.getFieldValue('endDateTime')
                  
                  if(s2 && s1) {
                   var isPassed = validationOfBeautician(s1, s2)
                   setWarningSet({
                    ...warningSet,
                    'Beautician': isPassed? 'Pass': 'error'
                  })
                  } 

                }}
              />
            </Form.Item>


            <Form.Item
              label='Location'
              name='locationId'
              validateStatus={warningSet['Location']}
              help={warningSet['Location'] === 'error' && 'This location is occupied during this time period.'}
            >
              <Select 
                style={{ width: "100%" }} 
                defaultValue={NOT_MEMTIONED}
                onChange={(value)=>{
                  const s1 = form.getFieldValue('startDateTime')
                  const s2 = form.getFieldValue('endDateTime')
                  
                  if(s2 && s1){
                   var isPassed = validationOfLocation(s1, s2, value)
                   setWarningSet({
                    ...warningSet,
                    'Location': isPassed? 'Pass': 'error'
                  })
                  } 
                }}
              >
                <Option value={NOT_MEMTIONED}>Not memtioned</Option>

                {Array.isArray(locationList) && locationList.map(each => {
                  if (each.isInactive) {
                    return null
                  } else {
                    return <Option value={each.id}>{each.name}</Option>
                  }
                })}

              </Select>
            </Form.Item>

          </>
        </Form>
      </Modal>
    </Router>
  )
}

