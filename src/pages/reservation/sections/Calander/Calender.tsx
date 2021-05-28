import React, { useState, useEffect } from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { connect } from 'umi';
import styles from './myStyles.less'
import { Modal, Space, Popconfirm, Button, Input, message, Row, Col } from 'antd';
import sort from 'fast-sort';
import BranchSelect from '../../components/Selector/BranchSelect'
import BeauticianSelect from '../../components/Selector/BeauticianSelect'
import LocationSelect from '../../components/Selector/LocationSelect'
import AbsenceSelector from '../../components/Selector/AbsenceSelector'
import { CreateModal } from '../../components/CalanderModal/CreateModal';
import { EditModal } from '../../components/CalanderModal/EditModal';
import { EditAbsenceModal } from '../../components/CalanderModal/EditAbsenceModal';
import moment from 'moment';
import errorImg from './close.png'
import listPlugin from '@fullcalendar/list';

interface BranchInfo {
  branchId: string;
  branchName: string;
}

interface updateInfo {
  type: string;
  oldEventInfo: any;
  movementArgs: any;
}

interface beauticianInterface {
  id: string;
  name: string;
}

const Calendar = (props) => {
  const WAITING_DATA = 'Waiting data...'
  const ALL_BRANCH = 'All Branches'
  const ALL_LOCATION = 'All Location'
  const STAFF_DISPLAY_NAME = 'STAFF_DISPLAY_NAME'
  const staffName = localStorage.getItem(STAFF_DISPLAY_NAME) || 'Beautician'
  const ALL_BEAUTICIAN = `All ${staffName}`
  const IS_RESCHEDUAL = 'Are you sure you want to reschedule this booking?'
  const BEAUTI_IS_OCCUPIED = 'This beautician is occupied. Please change anther time.'
  const ALL_STAFF = 'All Staff'

  const { dispatch } = props;
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const [reservationList, setReservationList] = useState([]);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [branchList, setBranchList] = useState<Array<any>>([])
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleEditAbsen, setVisibleEditAbsen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [usersList, setUsersList] = useState<Array<any>>([])
  const [selectedTime, setSelectedTIme] = useState({});
  const [branchSelectValue, setBranchSelectorValue] = useState('All Branches');
  const [initReservationList, setInitiReservationList] = useState([]);
  const [currentBranchInfo, setCurrentBranchInfo] = useState<BranchInfo>({ branchId: '', branchName: '' });
  const [roleUserPairs, setRoleUserPairs] = useState<any>([])
  const [myTreeData, setMyTreeData] = useState<any>([])
  const [currentBeauticianInfo, setCurrentBeauticianInfo] = useState<beauticianInterface>({ id: ALL_STAFF, name: ALL_STAFF })
  const [locationList, setLocationList] = useState<any>([])
  const [currentLocationId, setCurrentLocationId] = useState<any>('')
  const [currentAbsence, setCurrentAbsence] = useState<any>('')
  const [visible, setVisible] = useState<any>(false)
  const [updateInfo, setUpdateInfo] = useState<updateInfo>(undefined)
  const [displayMessage, setMessage] = useState(IS_RESCHEDUAL)

  console.log('Calender4168,reservationList', reservationList);
  console.log('Calender4168,INITIAL_EVENTS', INITIAL_EVENTS);
  console.log('Calender4168,roleUserPairs', roleUserPairs);
  console.log('Calender4168,locationList', locationList);

  useEffect(() => {
    fetAllReservation()
    fetchAllBranch()
    fetchAllUsers()
  }, []);


  useEffect(() => {
    // 筛选当前信息
    console.log('useEffect97,initReservationList', initReservationList);
    console.log('useEffect97,currentBeauticianInfo', currentBeauticianInfo);
    console.log('useEffect97,currentBranchInfo', currentBranchInfo);
    console.log('useEffect97,currentLocationId', currentLocationId);
    console.log('useEffect97,currentAbsence', currentAbsence);

    let temp = initReservationList

    const isBranchExist = currentBranchInfo.branchId !== '' && currentBranchInfo.branchId != ALL_BRANCH
    const isBeauticianExist = currentBeauticianInfo && currentBeauticianInfo.id != 'All Staff'
    const isLocationExist = currentLocationId != '' && currentLocationId != ALL_LOCATION

    if (isBranchExist) {
      temp = temp.filter(each => each.branchId === currentBranchInfo.branchId)
      setBranchSelectorValue(currentBranchInfo.branchName)
    }

    if (isBeauticianExist && isLocationExist) {
      console.log('useEffect97, 过滤1');
      temp = initReservationList.filter(each => each.extendedProps.beauticianId === currentBeauticianInfo.id && each.extendedProps.locationId === currentLocationId)
    }

    if (isBeauticianExist && !isLocationExist) {
      console.log('useEffect97, 过滤2');
      temp = initReservationList.filter(each => each.extendedProps.beauticianId === currentBeauticianInfo.id)
    }

    if (!isBeauticianExist && isLocationExist) {
      console.log('useEffect97, 过滤3');
      temp = initReservationList.filter(each => each.extendedProps.locationId === currentLocationId)
    }

    if (currentAbsence == 'Present') {
      temp = temp.filter(each => each.title !== "Absence  Absence")
      console.log('useEffect97,temp1', temp);
    }

    if (currentAbsence == 'Absent') {
      temp = temp.filter(each => each.title == "Absence  Absence")
      console.log('useEffect97,temp2', temp);
    }

    setReservationList(temp)
  }, [currentBeauticianInfo, currentBranchInfo, currentLocationId, currentAbsence, initReservationList]);


  useEffect(() => {
    if (roleUserPairs.length !== 0) {
      // 生成树选择器的数据
      const myRoleList = []
      // 给一个全选美容师
      myRoleList.push({
        selectable: true,
        title: ALL_STAFF,
        value: ALL_STAFF,
        children: [],
      })

      roleUserPairs.forEach(each => {
        const titles = myRoleList.map(each => each.title)

        if (titles.includes(each.roleName)) {
          // 如果出现过的Role，则在原有基础上，增加children
          const index = titles.indexOf(each.roleName)
          const originalChildren = myRoleList[index].children // 是数组，里面是对象
          const newChildren = [{
            title: each.userName,
            value: each.userId,
          }]
          myRoleList[index].children = [...originalChildren, ...newChildren]
        } else {
          myRoleList.push({
            selectable: false,
            title: each.roleName,
            value: each.roleId,
            children: [
              {
                title: each.userName,
                value: each.userId,
              }
            ],
          })
        }
      })
      console.log('currentRecord1681,roleUserPairs,myRoleList', myRoleList);
      setMyTreeData(myRoleList)
    }
  }, [roleUserPairs])


  const ABSENCE = 'Absence'


  const fetAllReservation = () => {
    const hide = message.loading('Loading...')
    dispatch({
      type: 'reservation/fetAllReservation',
      callback: (res) => {
        console.log('useEffect,fetAllReservation,res', res);

        const response = res.data
        sort(response).desc(user => new Date(user.creationDate).getTime())

        const temp = response.map(each => {
          const isAbsent = each.customerName.includes(ABSENCE)
          return {
            id: `${each.id}`,
            branchId: each.branchId,
            title: each.customerName,
            start: each.start,
            end: each.end,
            extendedProps: {
              isAbsent: isAbsent,
              beauticianName: each.beauticianName,
              beauticianId: each.beauticianId,
              locationName: each.locationName,
              locationId: each.locationId,
              start: each.start,
              end: each.end,
            },
            backgroundColor: isAbsent ? '#C1C1C1' : '#F2F2F2',
            borderColor: isAbsent ? 'black' : 'blue',
            allDay: false, // 是否在上面的ALL—DAY中显示
          }
        })
        setReservationList(temp)
        setInitiReservationList(temp)

        setTimeout(() => {
          hide()
        }, 3000)
      }
    })
  }

  const fetchAllBranch = () => {
    try {
      dispatch({
        type: 'reservation/fetchAllBranch',
        callback: (res) => {
          console.log('fetchAllBranch,res', res);
          sort(res).asc(each => each.shortName.toLowerCase())
          setBranchList(res)

          if (res[0]) {
            // 请求Branch对应信息
            requestBranchUsers(res[0].id)
            requestBranchLoacation(res[0].id)

            // 设置当前Branch
            setCurrentBranchInfo({
              branchId: res[0].id,
              branchName: res[0].shortName,
            })
          }
        }
      })
    } catch {
    }
  }

  const fetchAllUsers = () => {
    try {
      dispatch({
        type: `reservation/fetchAllUser`,
        callback: (res) => {
          console.log('fetchAllUser,res', res);
          sort(res).asc(each => each.firstName)
          setUsersList(res)
        }
      });
    } catch {
    }
  }

  // ------------------------------ 选择一个Branch -----------------------------
  const onOneBranchSelected = (value, option) => {
    // 旧数据清零
    setLocationList([])
    setUsersList([])

    // 请求新数据
    requestBranchLoacation(value)
    requestBranchUsers(value)
    setCurrentBeauticianInfo({ id: "All Staff", name: ALL_STAFF })

    console.log('onChange1168,value', value);
    console.log('onChange1168,option', option);
    console.log('onChange1168,isAll', value == ALL_BRANCH);

    // 设置当前数据
    const branchName = option.children
    setCurrentBranchInfo({
      branchId: value,
      branchName: branchName
    })
    setBranchSelectorValue(option.children)



    const branchId = value
    if (branchId == ALL_BRANCH) {
      setReservationList(initReservationList)
    } else {
      // 过滤当前数据
      const temp = initReservationList.filter(each => each.branchId == branchId)
      console.log('onChange1168,initReservationList', initReservationList);
      console.log('onChange1168,temp', temp);

      setReservationList(temp)
    }
  }

  const requestBranchLoacation = (branchId) => {
    dispatch({
      type: 'reservation/requestBranchLoacation',
      payload: {
        branchId: branchId
      },
      callback: (res) => {
        setLocationList(res)
      }
    })
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

  const handleEventClick = (clickInfo) => {
    console.log('handleEventClick,clickInfo', clickInfo);
    const bookingId = clickInfo.event._def.publicId
    setCurrentRecord({ id: bookingId })

    const isAbsence = clickInfo.event._def.title == 'Absence  Absence'
    isAbsence ? setVisibleEditAbsen(true) : setVisibleEdit(true)
  }

  const eventBlock = {
    color: 'darkblue',
  }

  function renderEventContent(eventInfo) {
    const extendedProps = eventInfo.event._def.extendedProps
    console.log('renderEventContent', eventInfo);
    console.log('renderEventContent,extendedProps', extendedProps);

    const isAbsent = extendedProps.isAbsent
    const beauticianStyle = { fontSize: 12, fontWeight: 500 }
    const locationStyle = { color: 'blue', fontSize: 12, fontWeight: 600 }

    let myContent;
    if (extendedProps.locationName && extendedProps.beauticianName) {
      myContent = <><span style={beauticianStyle}>{`${staffName.replace(/^\S/, s => s.toUpperCase())}: ${extendedProps.beauticianName}, at`}</span> <span style={locationStyle}>{`${extendedProps.locationName}`}</span> </>
    } else if (extendedProps.locationName) {
      myContent = <> at <span style={locationStyle}>{`${extendedProps.locationName}`}</span> </>
    } else if (extendedProps.beauticianName) {
      myContent = <span style={beauticianStyle}>{`${staffName.replace(/^\S/, s => s.toUpperCase())}: ${extendedProps.beauticianName}`}</span>
    } else {
      myContent = ''
    }

    return (
      <section style={eventBlock}>
        <b style={{ color: isAbsent && 'black' }}>{isAbsent ? `[${ABSENCE}]` : `${eventInfo.event.title}`}</b>
        <p style={isAbsent ? { color: 'black' } : { color: 'gray' }}>{myContent}</p>
      </section>
    )
  }


  // ------------------------------ 验证理发师时间 ------------------------------
  const validationOfBeautician = (startDateTime, endDateTime, beauticianId, bookingId) => {
    let flag = []

    // 过滤美容师
    const relevantBeauticianBookings = initReservationList.filter(each =>
      bookingId != each.id && each.extendedProps.beauticianId == beauticianId)

    const targetStartDateTime = startDateTime && startDateTime.format("x") // Unix timestamp
    const targetEndDateTime = endDateTime && endDateTime.format("x")

    // 过滤时间
    relevantBeauticianBookings.forEach(each => {
      const startDateTime = moment(each.start).format("x") // Unix timestamp
      const endDateTime = moment(each.end).format("x") // Unix timestamp
      const situation1 = (targetStartDateTime <= startDateTime) && (targetEndDateTime <= startDateTime)
      const situation2 = (targetStartDateTime >= endDateTime) && (targetEndDateTime >= endDateTime)

      // 任意的选中时间，都必须在区间外面，
      if (situation1 || situation2) flag.push(true)
      else flag.push(false)

    });

    if (flag.includes(false)) {
      return false
    } else return true
  }

  const NOT_MEMTIONED = 'Not memtioned'
  // ---------------------------------- 验证地址的占有情况 ----------------------------------
  const validationOfLocation = (startDateTime, endDateTime, locationId, bookingId) => {

    const isLocationExist = locationId !== NOT_MEMTIONED && locationId

    if (!isLocationExist) {
      return true
    } else {
      const relevantLocationBookings = initReservationList.filter(each =>
        bookingId != each.id && each.extendedProps.locationId == locationId)

      console.log('relevantLocationBookings', relevantLocationBookings);

      const targetStartDateTime = startDateTime && startDateTime.format("x") // Unix timestamp
      const targetEndDateTime = endDateTime && endDateTime.format("x")

      let flag = []

      relevantLocationBookings.forEach(each => {
        const startDateTime = moment(each.start).format("x") // Unix timestamp
        const endDateTime = moment(each.end).format("x") // Unix timestamp

        const situation1 = (targetStartDateTime <= startDateTime) && (targetEndDateTime <= startDateTime)
        const situation2 = (targetStartDateTime >= endDateTime) && (targetEndDateTime >= endDateTime)

        // 任意的选中时间，都必须在区间外面，
        if (situation1 || situation2) {
          flag.push(true)
        } else {
          flag.push(false)
        }
      });

      if (flag.includes(false)) {
        return false
      } else return true
    }
  }

  const myFormate = "YYYY-MM-DD HH:mm:ss"
  const updateOneBooking = ({ type, oldEventInfo, movementArgs }) => {

    const bookingId = oldEventInfo.publicId
    const beauticianId = oldEventInfo.extendedProps.beauticianId
    const locationId = oldEventInfo.extendedProps.locationId

    const validStart = moment(oldEventInfo.extendedProps.start).add(movementArgs)
    const validEnd = moment(oldEventInfo.extendedProps.end).add(movementArgs)

    if (type == 'eventDrop') {
      var newStart = moment(oldEventInfo.extendedProps.start).add(movementArgs).format(myFormate)
      var newEnd = moment(oldEventInfo.extendedProps.end).add(movementArgs).format(myFormate)
    } else {
      var newStart = moment(oldEventInfo.extendedProps.start).format(myFormate)
      var newEnd = moment(oldEventInfo.extendedProps.end).add(movementArgs).format(myFormate)
    }

    console.log('updateOneBooking,type', type);
    console.log('updateOneBooking,oldEventInfo', oldEventInfo);
    console.log('updateOneBooking,movementArgs', movementArgs);

    console.log('updateOneBooking48811811,newStart', newStart);
    console.log('updateOneBooking48811811,newEnd', newEnd);

    // 验证这个时间段内，LOCATION和Beautician
    const beautPasses = validationOfBeautician(validStart, validEnd, beauticianId, bookingId)
    const locaPassed = validationOfLocation(validStart, validEnd, locationId, bookingId)


    if (beautPasses && locaPassed) {
      const updateEnum = [
        { op: "replace", path: "/start", value: newStart },
        { op: "replace", path: "/end", value: newEnd }
      ]

      dispatch({
        type: 'reservation/updateReservation',
        payload: {
          id: bookingId,
          body: updateEnum,
        },
        callback: () => {
          fetAllReservation()
        }
      })
      setVisible(false)
    } else {
      if (beautPasses && !locaPassed) setMessage(BEAUTI_IS_OCCUPIED)
      else if (locaPassed && !beautPasses) setMessage(BEAUTI_IS_OCCUPIED)
      else setMessage('This beautician is occupied. This location is occupied.')

      fetAllReservation()
    }
  }

  let calendarRef = React.createRef();

  const myFooter = () => {
    if (displayMessage.includes('reschedule')) {
      return [
        <Button
          type='primary'
          size="small"
          onClick={() => updateOneBooking(updateInfo)}>Comfirm</Button>,
        <Button
          size="small"
          onClick={() => {
            setVisible(false)
            fetAllReservation()
          }}>Cancel</Button>
      ]
    } else {
      return [
        <Button
          size="small"
          onClick={() => {
            setVisible(false)
            fetAllReservation()
          }}>Cancel</Button>
      ]
    }
  }

  const createNewEvent = (event: any) => {
    console.log('select97', event);

    if (event.allDay) {
      setSelectedTIme({
        start: moment(event.start),
        end: moment(event.end).add(-1, 'minutes'),
      })
    } else {
      setSelectedTIme({
        start: moment(event.start),
        end: moment(event.end),
      })
    }

    if (currentBranchInfo.branchId !== '') {
      setVisibleCreate(true)
    }
  }

  return (
    <div style={{ padding: 30 }}>

      <Modal
        width={400}
        visible={visible}
        onCancel={() => {
          setVisible(false)
          fetAllReservation()
        }}
        footer={myFooter()}

      >
        <h3>{displayMessage.includes('reschedule') ? <span>Are you sure?</span> : <span style={{ color: 'red' }}><img style={{ height: 24, marginRight: 8 }} src={errorImg} alt='' />Error</span>}</h3>
        {displayMessage.includes('reschedule') ? <p style={{ fontSize: 15 }}>{displayMessage}</p> : <p style={{ color: 'red' }}>{displayMessage}</p>}
      </Modal>

      <Row style={{ marginBottom: 20, marginLeft: 0, backgroundColor: "white" }}>

        <Col span={8}>
          <label style={{ marginRight: 5 }}>Branch：</label>
          <BranchSelect
            branchList={branchList}
            ALL_BRANCH={ALL_BRANCH}
            WAITING_DATA={WAITING_DATA}
            branchSelectValue={branchSelectValue}
            onOneBranchSelected={onOneBranchSelected}
            initReservationList={initReservationList}
          />
        </Col>

        <Col span={8}>
          <label style={{ marginRight: 5, marginLeft: 15 }}>Staff:</label>
          <BeauticianSelect
            roleUserPairs={roleUserPairs}
            currentBranchInfo={currentBranchInfo || {}}
            myTreeData={myTreeData}
            currentBeauticianInfo={currentBeauticianInfo}
            setCurrentBeauticianInfo={setCurrentBeauticianInfo}
          />
        </Col>

        <Col span={8}>
          <label style={{ marginRight: 5, marginLeft: 15 }}>Location: </label>
          <LocationSelect
            locationList={locationList}
            setCurrentLocationId={setCurrentLocationId}
            ALL_LOCATION={ALL_LOCATION}
          />
        </Col>


      </Row>

      <Row style={{ marginBottom: 20, marginLeft: 0, backgroundColor: "white" }}>
        <Col span={8} offset={16}>
          <label style={{ marginRight: 5 }}>Attendance: </label>
          <AbsenceSelector
            setCurrentAbsence={setCurrentAbsence}
          />
        </Col>
      </Row>


      {/* --------------------------------- DAY WEEK YEAR --------------------------------- */}
      <div
        className={styles.dayHeader}
        style={{ padding: 30 }}
      >
        <FullCalendar
          // https://app.skedda.com/ 例子
          //  https://fullcalendar.io/ 插件
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          events={reservationList} // 使用这个渲染页面即可
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }} // 控制时间显示格式
          droppable={true}
          select={(event) => { createNewEvent(event) }} // 使用这个添加新事件
          eventClick={handleEventClick}
          eventDrop={(arg) => {
            // alert('eventDrop')
            console.log('eventDrop,arg', arg);
            const oldEventInfo = arg.oldEvent._def
            const movementArgs = arg.delta
            console.log('eventDrop,arg,oldEventInfo', oldEventInfo);
            console.log('eventDrop,arg,movementArgs', movementArgs);

            setMessage(IS_RESCHEDUAL)
            setVisible(true)

            setUpdateInfo({
              type: 'eventDrop',
              oldEventInfo: oldEventInfo,
              movementArgs: movementArgs
            })
          }}
          eventResize={(arg) => {
            // 拉伸事件
            // alert('eventResize')
            console.log('eventResize,arg', arg);
            const oldEventInfo = arg.oldEvent._def
            const movementArgs = arg.endDelta
            console.log('eventResize,arg,oldEventInfo', oldEventInfo);
            console.log('eventResize,arg,movementArgs', movementArgs);

            setMessage(IS_RESCHEDUAL)
            setVisible(true)

            setUpdateInfo({
              type: 'eventResize',
              oldEventInfo: oldEventInfo,
              movementArgs: movementArgs
            })
          }}
          eventContent={renderEventContent} // 修改渲染的样式
          eventDisplay='list-item'
          expandRows={true} // 调试显示是否缩放的
          dayHeaders={true}
          dayHeaderFormat={{
            weekday: 'long',
            month: 'numeric',
            day: 'numeric',
            omitCommas: true
          }}
          views={
            {
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'short', day: '2-digit' },
                dayHeaderFormat: {
                  weekday: 'long',
                  omitCommas: true
                }
              },
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'short', day: '2-digit' },
                dayHeaderFormat: {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  // omitCommas: true
                }
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'short', day: '2-digit' },
                dayHeaderFormat: {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  // omitCommas: true
                }
              },
            }}
          navLinks={true}
          // 上方Header时间格式
          slotEventOverlap={false} // 是否重叠显示Events
          slotMinTime="07:00:00" // 设置每天起始时间
          scrollTime="07:00:00"
          allDaySlot={false} // 去掉全天的选择
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth'
          }}
          initialView='timeGridWeek'
          eventDidMount={info => {
            console.log('eventDidMount18', info);
            const isAbsence = info.event._def.extendedProps.isAbsent
            info.el.style.borderColor = isAbsence ? '#353030' : 'lightgray'
            info.el.style.borderWidth = '2px'
            info.el.style.borderRadius = '3px'
          }} // 修改Event的边框样式
          editable={true}
          ref={calendarRef}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          eventsSet={(events) => setCurrentEvents(events)} // called after events are initialized/added/changed/removed
        />
      </div>

      <CreateModal
        myTreeData={myTreeData}
        roleUserPairs={roleUserPairs}
        currentBeauticianInfo={currentBeauticianInfo}
        currentLocationId={currentLocationId}
        locationList={locationList}
        ALL_BEAUTICIAN={ALL_BEAUTICIAN}
        ALL_STAFF={ALL_STAFF}
        requestBranchLoacation={requestBranchLoacation}
        currentBranchInfo={currentBranchInfo}
        reservationList={initReservationList}
        selectedTime={selectedTime}
        branchList={branchList}
        setVisible={(m) => setVisibleCreate(m)}
        visible={visibleCreate}
        fetAllReservation={fetAllReservation}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => { setVisibleCreate(false) }}
      />

      <EditModal
        myTreeData={myTreeData}
        currentBranchInfo={currentBranchInfo}
        reservationList={initReservationList}
        ALL_STAFF={ALL_STAFF}
        setBranchSelectorValue={setBranchSelectorValue}
        currentBeauticianInfo={currentBeauticianInfo}
        currentRecord={currentRecord}
        visible={visibleEdit}
        usersList={usersList}
        fetAllReservation={fetAllReservation}
        setVisible={(m) => setVisibleEdit(m)}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => { setVisibleEdit(false) }}
      />

      <EditAbsenceModal
        myTreeData={myTreeData}
        currentBranchInfo={currentBranchInfo}
        reservationList={initReservationList}
        ALL_STAFF={ALL_STAFF}
        setBranchSelectorValue={setBranchSelectorValue}
        currentBeauticianInfo={currentBeauticianInfo}
        currentRecord={currentRecord}
        visible={visibleEditAbsen}
        usersList={usersList}
        fetAllReservation={fetAllReservation}
        setVisible={(m) => setVisibleEditAbsen(m)}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => { setVisibleEditAbsen(false) }}
      />
    </div>
  )
}


export default connect(() => ({}))(Calendar);
