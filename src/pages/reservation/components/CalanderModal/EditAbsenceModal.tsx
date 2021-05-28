import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, Popconfirm } from 'antd';
import { HashRouter as Router } from "react-router-dom";
// import { Dispatch } from "umi";
import { DatePicker, message } from 'antd';
import { Select, TreeSelect } from 'antd';
import moment from 'moment';
import sort from 'fast-sort';
import jsonpatch from 'fast-json-patch';

const { RangePicker } = DatePicker;
const { Option } = Select;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

export const EditAbsenceModal = ({
  dispatch,
  ALL_STAFF,
  reservationList = [],
  visible,
  myTreeData,
  onCancelButtonClick,
  setVisible,
  currentRecord,
  fetAllReservation,
  currentBranchInfo,
  currentBeauticianInfo,
}) => {

  console.log('currentRecord184', currentRecord);


  const ALL_BRANCH = 'All Branch'
  const NOT_MEMTIONED = 'Not memtioned'

  const [form] = Form.useForm()
  const [membersList, setMembersList] = useState<any>([])
  const [formValues, setFormValues] = useState<any>({})
  const [locationList, setLocationList] = useState<any>([])
  const [initials, setInitials] = useState<any>({})
  const [roleUserPairs, setRoleUserPairs] = useState<any>([])
  const [warningSet, setWarningSet] = useState({});
  const [myTreeDataLocal, setMyTreeDateLocal] = useState([]);

  const BRANCH_ROLE_PAIRS = 'BRANCH_ROLE_PAIRS'
  const branchRolePairs = JSON.parse(localStorage.getItem(BRANCH_ROLE_PAIRS)) || {}
  const currentBranchRole = branchRolePairs[currentBranchInfo.branchId] || {}
  const isDefaultStaffSelected = currentBranchRole.roleId && currentBranchRole.roleId != 'All Staff'


  // 计算未选默认状态
  const filteredRoleUserPairs = []
  Array.isArray(roleUserPairs) && roleUserPairs.forEach(each => {
    const currentUserIds = filteredRoleUserPairs.map(each => each.userId)
    if (!currentUserIds.includes(each.userId)) filteredRoleUserPairs.push(each)
  })

  // value={currentBeauticianInfo.id || ALL_STAFF}
  console.log('EditAbsenceModal58441,currentBeauticianInfo', currentBeauticianInfo);
  console.log('EditAbsenceModal58441,myTreeDataLocal', myTreeDataLocal);
  // console.log('EditAbsenceModal58441,filteredRoleUserPairs', filteredRoleUserPairs);

  useEffect(() => {
    if (myTreeData.length != 0) {

      const targetRoleId = currentBranchRole.roleId
      const filteredStaff = myTreeData && myTreeData.filter(each => each.title != ALL_STAFF && each.value === targetRoleId )
      const temp = (filteredStaff[0] && filteredStaff[0].children) || []

      console.log('useEffect5678,myTreeData', myTreeData);
      console.log('useEffect5678,filteredStaff', filteredStaff);
      console.log('useEffect5678,temp', temp);

      setMyTreeDateLocal(temp)
    }
  }, [myTreeData]);

  const ABSENCE = 'Absence'

  useEffect(() => {
    if (visible) {
      setWarningSet({})
      // 请求Booking信息
      dispatch({
        type: `reservation/fetchOneReservation`,
        payload: {
          id: currentRecord.id
        },
        callback: (res) => {
          console.log('fetchOneReservation,res', res);
          setFormValues(res)
          setInitials(res)
          requestBranchLoacation(res.branchId)
          requestBranchUsers(res.branchId)

          // 设置Form
          form.setFieldsValue({
            name: res.customerName,
            startDateTime: moment(res.start),
            endDateTime: moment(res.end),
            staff: res.beauticianId || NOT_MEMTIONED,
            staffName: res.beauticianName || NOT_MEMTIONED,
            locationId: res.locationId || NOT_MEMTIONED
          })
        }
      });

      // 请求客户信息
      dispatch({
        type: `menberManagement/fetchMembers`,
        callback: (res) => {
          console.log('fetchMembers,res', res.data);
          const temp = res.data.filter(each => each.firstName !== ABSENCE)
          sort(temp).asc(each => each.firstName)
          setMembersList(temp)
        }
      });
    } else {
      form.resetFields()
      setFormValues({
        // ...formValues,
        start: '',
        end: 'endDateTime',
      })
    }
  }, [visible]);

  let branchBookings
  let currentBranchId = initials.branchId
  if (currentBranchId !== ALL_BRANCH) {
    branchBookings = reservationList.filter(each => each.branchId == currentBranchId)
  } else {
    branchBookings = reservationList
  }

  // console.log('EditModal151,reservationList=', reservationList);
  // console.log('EditModal151,currentBranchId=', currentBranchId);
  // console.log('EditModal151,branchBookings=', branchBookings);

  // ------------------------------ 验证理发师时间 ------------------------------
  const validationOfBeautician = (startDateTime, endDateTime) => {
    const beauticianId = form.getFieldValue('staff')
    const relevantBeauticianBookings = branchBookings.filter(each =>
      initials.id != each.id &&
      each.extendedProps.beauticianId == beauticianId)

    const targetStartDateTime = startDateTime && startDateTime.format("x") // Unix timestamp
    const targetEndDateTime = endDateTime && endDateTime.format("x")

    let flag = []

    console.log('validationOfBeautician,relevantBeauticianBookings', relevantBeauticianBookings );
    console.log('validationOfBeautician,beauticianId', beauticianId );
    console.log('validationOfBeautician,targetStartDateTime', targetStartDateTime );
    console.log('validationOfBeautician,targetEndDateTime', targetEndDateTime );
    

    relevantBeauticianBookings.forEach(each => {
      const startDateTime = moment(each.start).format("x") // Unix timestamp
      const endDateTime = moment(each.end).format("x") // Unix timestamp
      const situation1 = (targetStartDateTime <= startDateTime) && (targetEndDateTime <= startDateTime)
      const situation2 = (targetStartDateTime >= endDateTime) && (targetEndDateTime >= endDateTime)

      // 任意的选中时间，都必须在区间外面，
      if (situation1 || situation2) flag.push(true)
      else flag.push(false)
    });

    console.log('validationOfBeautician,flag', flag );


    if (flag.includes(false)) {
      return false
    } else return true
  }


  const requestBranchLoacation = (branchId) => {
    dispatch({
      type: `reservation/requestBranchLoacation`,
      payload: {
        branchId: branchId
      },
      callback: (res) => {
        console.log('requestBranchLoacation,res', res);
        setLocationList(res)
      }
    });
  }

  const requestBranchUsers = (branchId) => {
    dispatch({
      type: 'reservation/requestBranchUsers',
      payload: {
        branchId: branchId
      },
      callback: (res) => {
        try {
          console.log('requestBranchUsers41584,res', res);
          const roleUserPairs = res.map(each => {
            return {
              roleName: each.roleName,
              roleId: each.roleId,
              userId: each.userId,
              userName: each.userFullName,
            }
          })
          console.log('requestBranchUsers,roleUserPairs', roleUserPairs);
          setRoleUserPairs(roleUserPairs)
        } catch {
        }
      }
    })
  }


  const onUpdateClick = () => {
    const values = form.getFieldsValue()

    if (values.startDateTime && values.endDateTime && values.staff) {
      const hide = message.loading('Updating...')

      let document = initials;
      let observer = jsonpatch.observe<Object>(document);

      console.log('onUpdateClick,values', values);
      console.log('onUpdateClick,document', document);
      console.log('onUpdateClick,document,formValues', formValues);

      document.start = formValues.start;
      document.end = formValues.end;
      document.beauticianId = formValues.beauticianId;
      document.beauticianName = formValues.beauticianName;

      const updateEnum = jsonpatch.generate(observer);
      console.log("onUpdateClick,updateEnum=", updateEnum);

      dispatch({
        type: 'reservation/updateReservation',
        payload: {
          id: formValues.id,
          body: updateEnum,
        },
        callback: () => {
          hide()
          fetAllReservation()
          setVisible(false)
        }
      })

    } else {
      message.error('Please check your staff name and date.')
    }
  }

  const onDeleteCustomer = (id) => {
    dispatch({
      type: `reservation/deleteReservation`,
      payload: {
        id: id,
      },
      callback: (res) => {
        fetAllReservation()
        setVisible(false)
      }
    });
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

  return (
    <Router>
      <Modal
        maskClosable={true}
        visible={visible}
        destroyOnClose={true}
        onCancel={() => { onCancelButtonClick() }}
        width='600px'
        bodyStyle={{ padding: '30px 60px' }}
        footer={[
          <Popconfirm
            title="Are you sure to delete this booking？"
            onConfirm={() => initials.id && onDeleteCustomer(initials.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              type="primary"
              danger
              style={{ float: 'left', marginLeft: 10 }}
            >
              Delete
            </Button>
          </Popconfirm>,

          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => onUpdateClick()}
          >
            Update
          </Button>,

          <Button
            style={{ marginLeft: 10, float: 'right' }}
            onClick={() => { onCancelButtonClick() }}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
        >
          <>
           <h3 style={{ margin: '20px 0 20px 15px' }}>Absence Information</h3>

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
                  // console.log('Select.onChange,value', value);
                  // console.log('Select.onChange,option', option);
                  // console.log('Select.onChange,option.children', option.children);

                  // 设置数据
                  setFormValues({
                    ...formValues,
                    beauticianId: value,
                    beauticianName: option.children,
                  })

                  const s1 = form.getFieldValue('startDateTime')
                  const s2 = form.getFieldValue('endDateTime')
          
                  let isPassed;
                  if (s2 && s1) {
                    isPassed = validationOfBeautician(s1, s2)
                  } else {
                    isPassed = false
                  }

                  console.log('Select8765,s1', s1);
                  console.log('Select8765,s2', s2);
                  console.log('Select8765,isPassed', isPassed);


                  setWarningSet({
                    ...warningSet,
                    'Beautician': isPassed ? 'Pass' : 'error'
                  })
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
              label='Start Date'
              name='startDateTime'
              rules={[{ required: true }]}
              validateStatus={warningSet['Start']}
              help={warningSet['Start'] === 'error' && 'Start time should be earlier than end time.'}
            >
              <DatePicker
                showTime={{ format: 'HH:mm', minuteStep: 15, use12Hours: true }}
                format="DD/MMM/YYYY HH:mm A"
                style={{ width: '70%' }}
                disabledTime={()=>disabledDateTime()}
                onChange={(value) => {
                  const startDateTime = value.format("YYYY-MM-DD HH:mm:ss")
                  
                  // 设置
                  setFormValues({
                    ...formValues,
                    start: startDateTime,
                  })

                  // 验证
                  const beauticianId = form.getFieldValue('staff')
                  const endDateTime = form.getFieldValue('endDateTime')

                  const startFormatted = moment(value).format("x") 
                  const endFormatted = moment(endDateTime).format("x") 

                  console.log('DatePicker18,value', value);
                  console.log('DatePicker18,endDateTime', endDateTime);
                  console.log('DatePicker18,beauticianId', beauticianId);
                  console.log('DatePicker18,startFormatted', startFormatted);
                  console.log('DatePicker18,endFormatted', endFormatted);

                  if(startFormatted > endFormatted){
                    // message.error('Start time should be earlier than end time.')
                    setWarningSet({
                      Start: 'error',
                    })
                  } else {
                    const isPassed = validationOfBeautician(value, endDateTime)
                    setWarningSet({
                      Beautician: isPassed ? 'Pass' : 'error',
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
              help={warningSet['End'] === 'error' && 'End time should be later than start time.'}

            >
              <DatePicker
                showTime={{ format: 'HH:mm', minuteStep: 15, use12Hours: true }}
                format="DD/MMM/YYYY HH:mm A"
                style={{ width: '70%' }}
                disabledTime={()=>disabledDateTime()}
                onChange={(value)=>{
                  console.log('DatePicker184,value', value);
                  const endDateTime = value.format("YYYY-MM-DD HH:mm:ss")
                  
                  // 设置
                  setFormValues({
                    ...formValues,
                    end: endDateTime,
                  })

                  // 验证
                  const beauticianId = form.getFieldValue('staff')
                  const startDateTime = form.getFieldValue('startDateTime')

                  const startFormatted = moment(startDateTime).format("x") 
                  const endFormatted = moment(value).format("x") 

                  console.log('DatePicker184,value', value);
                  console.log('DatePicker184,startDateTime', startDateTime);
                  console.log('DatePicker184,beauticianId', beauticianId);

                  if(startFormatted > endFormatted){
                    // message.error('End time should be later than start time.')
                    setWarningSet({
                      End: 'error',
                    })
                  } else {
                    const isPassed = validationOfBeautician(startDateTime, value)
                    setWarningSet({
                      Beautician: isPassed ? 'Pass' : 'error',
                    })
                  }

     

                 
                }}
              />
            </Form.Item>
          </>
        </Form>
      </Modal>
    </Router>
  )
}

