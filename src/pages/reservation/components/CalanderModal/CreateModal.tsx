import React, { useEffect, useState, FC } from 'react'
import { Modal, Form, Button, Input, Row, Col, Tabs, Radio } from 'antd';
import { HashRouter as Router } from "react-router-dom";
import { DatePicker, message } from 'antd';
import { Select } from 'antd';
import moment from 'moment';
import sort from 'fast-sort';
import { Absence } from './Absence'
import jsonpatch from 'fast-json-patch';

const { TabPane } = Tabs;

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
  roleUserPairs,
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
  currentBeauticianInfo,
  currentLocationId,
  ALL_STAFF,
}) => {

  const [form] = Form.useForm()
  const [membersList, setMembersList] = useState<any>([])
  const [loading, setLoading] = useState<any>(false)
  const [formValues, setFormValues] = useState<any>({})
  const [warningSet, setWarningSet] = useState({});
  const [minuteStep, setMinuteStep] = useState(15);
  const [myTreeDataLocal, setMyTreeDateLocal] = useState([]);
  const [activeKey, setActiveKey] = useState('1')

  console.log('roleUsePairs41981,myTreeData', myTreeData);
  console.log('roleUsePairs41981,myTreeDataLocal', myTreeDataLocal);

  const BRANCH_ROLE_PAIRS = 'BRANCH_ROLE_PAIRS'
  const branchRolePairs = JSON.parse(localStorage.getItem(BRANCH_ROLE_PAIRS)) || {}
  const currentBranchRole = branchRolePairs[currentBranchInfo.branchId] || {}
  const isDefaultStaffSelected = currentBranchRole.roleId && currentBranchRole.roleId != 'All Staff'

  console.log('roleUsePairs41981,currentBranchRole', currentBranchRole);
  console.log('roleUsePairs41981,currentBranchRole', currentBranchRole);
  console.log('roleUsePairs41981,isDefaultStaffSelected', isDefaultStaffSelected);
  console.log('roleUsePairs41981,roleUserPairs', roleUserPairs);

  // 计算未选默认状态
  const filteredRoleUserPairs = []
  Array.isArray(roleUserPairs) && roleUserPairs.forEach(each => {
    const currentUserIds = filteredRoleUserPairs.map(each => each.userId)
    if (!currentUserIds.includes(each.userId)) filteredRoleUserPairs.push(each)
  })

  useEffect(() => {
    // 设置初始时间
    console.log('selectedTime18', selectedTime);

    if (selectedTime && selectedTime.start) {
      form.setFieldsValue({
        startDateTime: moment(selectedTime.start),
        startDateTime1: moment(selectedTime.start),
        endDateTime: moment(selectedTime.end),
        endDateTime1: moment(selectedTime.end),
      })
    }
  }, [selectedTime]);

  useEffect(() => {
   
  }, [visible]);

  console.log('useEffect181, warningSet', warningSet);


  useEffect(() => {
    if (myTreeData.length != 0) {
      // 计算有选默认的
      const temp1 = [{
        selectable: true,
        title: NOT_MEMTIONED,
        value: NOT_MEMTIONED,
        children: [],
      }]

      const targetRoleId = currentBranchRole.roleId
      const filteredStaff = myTreeData && myTreeData.filter(each => each.title != ALL_STAFF && each.value === targetRoleId)
      const temp3 = (filteredStaff[0] && filteredStaff[0].children) || []

      console.log('useEffect5678,myTreeData', myTreeData);
      console.log('useEffect5678,filteredStaff', filteredStaff);
      console.log('useEffect5678,temp3', temp3);

      setMyTreeDateLocal([...temp1, ...temp3])
    }
  }, [myTreeData]);


  const ABSENCE = 'Absence'

  useEffect(() => {
    if (visible) {
      fetchMembers()

      // 设置当前的数据
      form.setFieldsValue({
        ...form.getFieldsValue(),
        staff: currentBeauticianInfo.id == ALL_STAFF ? NOT_MEMTIONED : currentBeauticianInfo.id,
        staff1: currentBeauticianInfo.id == ALL_STAFF ? null : currentBeauticianInfo.id,
      })

      setFormValues({
        ...formValues,
        locationId: currentLocationId == '' ? null : currentLocationId,
        beauticianId: currentBeauticianInfo.id == ALL_STAFF ? NOT_MEMTIONED : currentBeauticianInfo.id,
        beauticianName: currentBeauticianInfo.id == ALL_STAFF ? null : currentBeauticianInfo.name
      })

      setWarningSet({})
      setActiveKey('1')
    } else {
      form.resetFields()
    }

    // 进来先验证  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    if (visible && currentBeauticianInfo.id !== ALL_STAFF) {
      initialValidation()
    }
  }, [visible]);

  const initialValidation = () =>{
    // alert('初始验证')
    const s1 = form.getFieldValue('startDateTime')
    const s2 = form.getFieldValue('endDateTime')
    const beauticianId = currentBeauticianInfo.id

    console.log('useEffect181, s1', s1);
    console.log('useEffect181, s2', s2);
    console.log('useEffect181, beautician', beauticianId);

    if (s2 && s1) {
      var isPassed = validationOfBeautician(s1, s2, beauticianId)
      const tempWarning = {
        ...warningSet,
        'Beautician': isPassed ? 'Pass' : 'error'
      }
      console.log('useEffect181, isPassed', isPassed);
      console.log('useEffect181, tempWarning', tempWarning);

      setWarningSet(tempWarning)
    }
  }

  console.log('当前formValues', formValues);

  const onCreateMemberClick = () => {
    const values = form.getFieldsValue()
    console.log('onCreateMemberClick,values', values);

    let document: any = {};

    document.firstName = ABSENCE;
    document.lastName = ABSENCE;
    document.middleName = '';
    document.gender = 0;
    document.moniker = '';

    document.barcode = '';
    document.dateOfBirth = new Date();
    document.note = '';
    document.phone = undefined;
    document.email = 'XXXXX@gmail.com';


    console.log("onCreateMemberClick=", document);

    dispatch({
      type: 'menberManagement/createMember',
      payload: {
        body: document,
      },
      callback: (res) => {
        console.log('callback,res198', res);
        fetchMembers()
      }
    });
  };

  const fetchMembers = () => {
    dispatch({
      type: 'menberManagement/fetchMembers',
      payload: {
        body: document,
      },
      callback: (res) => {
        console.log('fetchMembers,res', res.data);
        const response = res.data

        // 如果没有"缺席"，则新建，作为标识
        const absence = response.filter(each => each.firstName == ABSENCE)
        if (absence.length === 0) onCreateMemberClick()

        // const temp = response.filter(each=>each.firstName !== ABSENCE)
        sort(response).asc(each => each.firstName)
        setMembersList(response)
      }
    });
  }

  // ------------------------------ 验证理发师时间 ------------------------------
  const validationOfBeautician = (startDateTime, endDateTime, beauticianId) => {
    // alert('验证美容师')
    
    if (beauticianId && beauticianId !== NOT_MEMTIONED) {
      const relevantBeauticianBookings = reservationList.filter(each => each.extendedProps.beauticianId == beauticianId)
      const targetStartDateTime = startDateTime && startDateTime.format("x") // Unix timestamp
      const targetEndDateTime = endDateTime && endDateTime.format("x")

      console.log('validationOfBeautician,startDateTime', startDateTime);
      console.log('validationOfBeautician,endDateTime', endDateTime);

      let flag = []

      relevantBeauticianBookings.forEach(each => {
        const startDateTime = moment(each.start).format("x") // Unix timestamp
        const endDateTime = moment(each.end).format("x") // Unix timestamp
        const situation1 = (targetStartDateTime <= startDateTime) && (targetEndDateTime <= startDateTime)
        const situation2 = (targetStartDateTime >= endDateTime) && (targetEndDateTime >= endDateTime)

        console.log('validationOfBeautician,relevantBeauticianBookings', relevantBeauticianBookings);

        // 任意的选中时间，都必须在区间外面，
        if (situation1 || situation2) {
          flag.push(true)
        } else {
          flag.push(false)
        }
      });
      console.log('validationOfBeautician,flag', flag);

      if (flag.includes(false)) {
        return false
      } else return true
    } else {
      return true
    }

  }


  // ---------------------------------- 验证地址的占有情况 ----------------------------------
  const validationOfLocation = (startDateTime, endDateTime, locationId) => {

    if (locationId && locationId !== NOT_MEMTIONED) {
      const relevantLocationBookings = reservationList.filter(each => each.extendedProps.locationId == locationId)
      const targetStartDateTime = startDateTime && startDateTime.format("x") // Unix timestamp
      const targetEndDateTime = endDateTime && endDateTime.format("x")

      console.log('validationOfLocation,startDateTime', startDateTime);
      console.log('validationOfLocation,endDateTime', endDateTime);
      console.log('validationOfLocation,locationId', locationId);
      console.log('validationOfLocation,relevantLocationBookings', relevantLocationBookings);
      let flag = []

      relevantLocationBookings.forEach(each => {
        const startDateTime = moment(each.start).format("x") // Unix timestamp
        const endDateTime = moment(each.end).format("x") // Unix timestamp

        const situation1 = (targetStartDateTime <= startDateTime) && (targetEndDateTime <= startDateTime)
        const situation2 = (targetStartDateTime >= endDateTime) && (targetEndDateTime >= endDateTime)

        // 任意的选中时间，都必须在区间外面，
        if (situation1 || situation2) flag.push(true)
        else flag.push(false)
      });
      return !flag.includes(false)
    } else {
      return true
    }

  }


  const onCreateBookingClick = () => {
    // 自动填入叫做缺席的会员

    const values = form.getFieldsValue()

    console.log('onCreateBookingClick,values', values);
    console.log('onCreateBookingClick,formValues', formValues);
    console.log('onCreateBookingClick,membersList', membersList);

    if (values.startDateTime && values.endDateTime && values.name) {

      const startDate = moment(values.startDateTime).format()
      const endDate = moment(values.endDateTime).format()

      console.log('onCreateBookingClick,formate,startDate', startDate);
      console.log('onCreateBookingClick,formate,endDate', endDate);

      const isBeauticianApplied = formValues.beauticianId && formValues.beauticianId !== NOT_MEMTIONED
      const isLocationApplied = formValues.locationId && formValues.locationId !== NOT_MEMTIONED

      const body = {
        "branchId": currentBranchInfo.branchId,
        "start": startDate,
        "end": endDate,
        "customerId": values.name.slice(0, 36),
        "customerName": values.name.slice(36, values.name.length),
        'locationId': isLocationApplied ? formValues.locationId : '',
        "isBeauticianApplied": isBeauticianApplied ? true : false,
        "beauticianId": isBeauticianApplied ? formValues.beauticianId : null,
        "beauticianName": isBeauticianApplied ? formValues.beauticianName : null,
      }

      console.log('createReservation,body', body);
      setLoading(true)
      dispatch({
        type: 'reservation/createReservation',
        payload: {
          body: body
        },
        callback: (res) => {
          console.log('create976,res', res.data);
          fetAllReservation()
          setVisible(false)
          setLoading(false)
        }
      })

    } else {
      message.error('Please check your customer name and date.')
    }
  }

  // ------------------------------ 新增缺席 ------------------------------
  const onCreateAbcence = () => {

    try {
      const values = form.getFieldsValue()
      console.log('onCreateAbcence,values', values);
      console.log('onCreateAbcence,formValues', formValues);
      console.log('onCreateAbcence,membersList', membersList);

      const absence = membersList.filter(each => each.firstName == ABSENCE && each.lastName == ABSENCE)[0]
      const startDateTime = values.startDateTime1
      const endDateTime = values.endDateTime1
      console.log('onCreateAbcence,absence', absence);

      if (startDateTime && endDateTime && values.staff1) {
        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        const isRepeat = values.repeat
        if (isRepeat == 'Day') {
          for (var i = 0; i < 7; i++) {
          }
        }

        createOneReservation(startDateTime, endDateTime, absence)
      } else {
        message.error('Please check your customer name and date.')
      }
    } catch {
    }
  }

  const createOneReservation = (startDateTime, endDateTime, absence) => {
    const startDate = moment(startDateTime).format()
    const endDate = moment(endDateTime).format()

    console.log('onCreateAbcence,formate,startDate1', startDate);
    console.log('onCreateAbcence,formate,endDate1', endDate);

    const body = {
      "branchId": currentBranchInfo.branchId,
      "start": startDate,
      "end": endDate,
      "customerId": absence.id,
      "customerName": absence.firstName,
      'locationId': '',
      "isBeauticianApplied": true,
      "beauticianId": formValues.beauticianId1,
      "beauticianName": formValues.beauticianName1,
    }

    console.log('createReservation,body', body);
    setLoading(true)
    dispatch({
      type: 'reservation/createReservation',
      payload: {
        body: body
      },
      callback: (res) => {
        console.log('create976,res', res.data);
        fetAllReservation()
        setVisible(false)
        setLoading(false)
      }
    })
  }


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

  const STAFF_DISPLAY_NAME = 'STAFF_DISPLAY_NAME'
  const staffName = localStorage.getItem(STAFF_DISPLAY_NAME) || 'Beautician'
  const membersListFilted = membersList.filter(each => each.firstName !== ABSENCE)

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
            onClick={() => {
              if (activeKey == '1') onCreateBookingClick()
              else onCreateAbcence()
            }}
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

        <Tabs
          activeKey={activeKey}
          defaultActiveKey="1"
          style={{ marginBottom: 32 }}
          onChange={(value) => { setActiveKey(value) }}>
          <TabPane tab="New Booking" key="1">
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
                  rules={[{ required: true }]}
                >
                  <Select
                    style={{ width: "100%" }}
                  >
                    {membersListFilted.length == 0 ? <Option value={WAITING_DATA}>{WAITING_DATA}</Option> :
                      <>{membersListFilted.map(each => {
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
                  validateStatus={warningSet['Start']}
                  help={warningSet['Start'] === 'error' && 'Start Time should be earlier than end time.'}
                >
                  <DatePicker
                    showTime={{ format: 'HH:mm', minuteStep: minuteStep, use12Hours: true }}
                    format="DD/MMM/YYYY HH:mm A"
                    style={{ width: '60%' }}
                    disabledTime={() => disabledDateTime()}
                    onChange={(value) => {
                      console.log('DatePicker18,value', value);
                      const beauticianId = form.getFieldValue('staff')
                      const locationId = form.getFieldValue('locationId')
                      const endDateTime = form.getFieldValue('endDateTime')

                      const formatedStart = value.format("x") 
                      const formatedEnd = endDateTime.format("x") 

                      console.log('DatePicker18,beauticianId', beauticianId);
                      console.log('DatePicker18,locationId', locationId);

                      if(formatedStart > formatedEnd) {
                        // alert(1)
                        setWarningSet({
                          Start: 'error',
                        })
                      } else {
                        // alert(2)
                        const isPassed = validationOfBeautician(value, endDateTime, beauticianId)
                        const isPassed1 = validationOfLocation(value, endDateTime, locationId)
  
                        setWarningSet({
                          Beautician: isPassed ? 'Pass' : 'error',
                          Location: isPassed1 ? 'Pass' : 'error',
                        })
                      }

                    }}
                  />
                </Form.Item>

                <Form.Item
                  label='End Date'
                  name='endDateTime'
                  rules={[{ required: true }]}
                  validateStatus={warningSet['End']}
                  help={warningSet['End'] === 'error' && 'End Time should be later than start time.'}
                >
                  <DatePicker
                    showTime={{ format: 'HH:mm', minuteStep: 15, use12Hours: true }}
                    format="DD/MMM/YYYY HH:mm A"
                    style={{ width: '60%' }}
                    disabledTime={() => disabledDateTime()}
                    onChange={(value) => {
                      console.log('DatePicker4448,value', value);
                      const beauticianId = form.getFieldValue('staff')
                      const locationId = form.getFieldValue('locationId')
                      const startDateTime = form.getFieldValue('startDateTime')

                      console.log('DatePicker4448,beauticianId', beauticianId);
                      console.log('DatePicker4448,locationId', locationId);

                      const formatedStart = startDateTime.format("x") 
                      const formatedEnd = value.format("x") 

                      if(formatedStart > formatedEnd) {
                        setWarningSet({
                          End: 'error',
                        })
                      } else {
                        const isPassed = validationOfBeautician(startDateTime, value, beauticianId)
                        const isPassed1 = validationOfLocation(startDateTime, value, locationId)

                        setWarningSet({
                          Beautician: isPassed ? 'Pass' : 'error',
                          Location: isPassed1 ? 'Pass' : 'error',
                        })
                      }
                    }}
                  />
                </Form.Item>

                <h3 style={{ margin: '50px 0 15px 20px' }}>More Information</h3>

                <Form.Item
                  label={`${staffName.replace(/^\S/, s => s.toUpperCase())}`}
                  name='staff'
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
                      console.log('Select.onChange,value', value);
                      console.log('Select.onChange,option', option);
                      console.log('Select.onChange,option.children', option.children);

                      // 设置数据
                      setFormValues({
                        ...formValues,
                        beauticianId: value,
                        beauticianName: option.children,
                      })

                      // 验证
                      const s1 = form.getFieldValue('startDateTime')
                      const s2 = form.getFieldValue('endDateTime')

                      if (s2 && s1) {
                        var isPassed = validationOfBeautician(s1, s2, value)
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

                    {isDefaultStaffSelected && <> {myTreeDataLocal.map(each => {
                      return <Option value={each.value}>{each.title}</Option>
                    })}</>}

                    {!isDefaultStaffSelected && <> {filteredRoleUserPairs.map(each => {
                      return <Option value={each.userId}>{each.userName}</Option>
                    })}</>}

                  </Select>
                </Form.Item>


                <Form.Item
                  label='Location'
                  name='locationId'
                  validateStatus={warningSet['Location']}
                  help={warningSet['Location'] === 'error' && 'This location is occupied during this time period.'}
                >
                  <Select
                    style={{ width: "100%" }}
                    // disabled={currentLocationId !=''}
                    defaultValue={currentLocationId == '' ? NOT_MEMTIONED : currentLocationId}
                    onChange={(value) => {
                      setFormValues({
                        locationId: value
                      })
                      const s1 = form.getFieldValue('startDateTime')
                      const s2 = form.getFieldValue('endDateTime')

                      if (s2 && s1) {
                        var isPassed = validationOfLocation(s1, s2, value)
                        setWarningSet({
                          ...warningSet,
                          'Location': isPassed ? 'Pass' : 'error'
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
          </TabPane>

          {/* ----------------------------------- 缺席 ----------------------------------- */}
          <TabPane tab="Absence" key="2">
            <Form
              {...layout}
              name="basic"
              form={form}
            >
              <Absence
                form={form}
                validationOfBeautician={validationOfBeautician}
                setWarningSet={setWarningSet}
                validationOfLocation={validationOfLocation}

                staffName={staffName}
                warningSet={warningSet}
                isDefaultStaffSelected={isDefaultStaffSelected}
                currentBeauticianInfo={currentBeauticianInfo}
                ALL_STAFF={ALL_STAFF}
                formValues={formValues}
                setFormValues={setFormValues}
                myTreeDataLocal={myTreeDataLocal}
                filteredRoleUserPairs={filteredRoleUserPairs}
              />

            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </Router>
  )
}

