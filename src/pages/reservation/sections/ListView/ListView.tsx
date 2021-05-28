import React, { useEffect, useState } from 'react';
import { connect, Dispatch, getLocale } from 'umi';
import { DatePicker, Space, Popconfirm, Button, Input, message, Row, Col } from 'antd';
import { CreateModal } from '../../components/CalanderModal/CreateModal';
import { EditModal } from '../../components/CalanderModal/EditModal';
import { BranchSettingInterface } from '../../data';
import AbsenceSelector from '../../components/Selector/AbsenceSelector'
import { WAITING_DATA, ALL_BRANCH, ALL_LOCATION, ALL_STAFF, MY_STAFF_NAME_UPPER } from '../../../public-component/names'
import styles from './myStyles.less';
import BranchSelect from '../../components/Selector/BranchSelect'
import BeauticianSelect from '../../components/Selector/BeauticianSelect'
import LocationSelect from '../../components/Selector/LocationSelect'
import sort from 'fast-sort';
import { EditAbsenceModal } from '../../components/CalanderModal/EditAbsenceModal';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';

interface BranchInfo {
  branchId: string;
  branchName: string;
}

interface updateInfo {
  oldEventInfo: any;
  movementArgs: any;
}


interface PropsInterFace {
  dispatch: Dispatch;
  visibleCreate?: boolean;
  setVisibleCreate?: (boolean) => void;
}

const ListView: React.FC<PropsInterFace> = (props) => {
  const { dispatch } = props;
  const [reservationList, setReservationList] = useState([]);
  const [visibleEditAbsen, setVisibleEditAbsen] = useState(false);
  const [branchList, setBranchList] = useState<Array<any>>([])
  const [usersList, setUsersList] = useState<Array<any>>([])
  const [branchSelectValue, setBranchSelectorValue] = useState('All Branches');
  const [initReservationList, setInitiReservationList] = useState([]);
  const [currentBranchInfo, setCurrentBranchInfo] = useState<BranchInfo>({ branchId: '', branchName: '' });
  const [roleUserPairs, setRoleUserPairs] = useState<any>([])
  const [myTreeData, setMyTreeData] = useState<any>([])
  const [currentBeauticianInfo, setCurrentBeauticianInfo] = useState<any>({ id: ALL_STAFF, name: ALL_STAFF })
  const [locationList, setLocationList] = useState<any>([])
  const [currentLocationId, setCurrentLocationId] = useState<any>('')
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [currentAbsence, setCurrentAbsence] = useState<any>('')

  console.log('Calender4168,reservationList', reservationList);
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

    let temp = initReservationList
    const isBranchExist = currentBranchInfo.branchId !== '' && currentBranchInfo.branchId != ALL_BRANCH
    const isBeauticianExist = currentBeauticianInfo.id && currentBeauticianInfo.id != ALL_STAFF
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
  }, [currentBeauticianInfo, currentBranchInfo, currentLocationId, initReservationList]);


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
            backgroundColor: '#F2F2F2',
            borderColor: 'blue',
            allDay: false, // 是否在上面的ALL—DAY中显示
          }
        })
        setReservationList(temp)
        setInitiReservationList(temp)

        setTimeout(() => {
          hide()
        }, 2000)
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
            // 请求Branc对应信息
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
    setCurrentBeauticianInfo({ id: ALL_STAFF, name: ALL_STAFF })

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

  const eventBlock = {
    color: 'darkblue',
    // border: '2px solid green'
  }

  function renderEventContent(eventInfo) {
    const extendedProps = eventInfo.event._def.extendedProps
    console.log('renderEventContent', eventInfo);
    console.log('renderEventContent,extendedProps', extendedProps);

    const beauticianStyle = { fontSize: 14, fontWeight: 600 }
    const locationStyle = { color: 'blue', fontSize: 14, fontWeight: 600 }

    const isAbsent = extendedProps.isAbsent
    return (
      <section style={eventBlock} >
        <Row >
          <Col span={6}>
            {isAbsent? <b style={{color: 'gray'}}>{`[${ABSENCE}]`}</b> : <b>{`${eventInfo.event.title}`}</b>}
            
          </Col>

          <Col span={8}>
            <span style={beauticianStyle}>{extendedProps.beauticianName ? `${MY_STAFF_NAME_UPPER}: ${extendedProps.beauticianName}` : ''}</span>
          </Col>

          <Col span={8}>
            <span style={locationStyle}>{`${extendedProps.locationName || ''}`}</span>
          </Col>
        </Row>
      </section>
    )
  }

  const [currentRecord, setCurrentRecord] = useState({});

  const handleEventClick = (clickInfo) => {
    console.log('handleEventClick,clickInfo', clickInfo);
    const bookingId = clickInfo.event._def.publicId
    setCurrentRecord({ id: bookingId })
    
    // 判断 
    const isAbsence = clickInfo.event._def.title == 'Absence  Absence'
    isAbsence ? setVisibleEditAbsen(true) : setVisibleEdit(true)
  }

  return (
    <section style={{
      backgroundColor: "white",
      border: '2px solid white',
      padding: 30,
    }}
    >
      {/* --------------------------------- LIST --------------------------------- */}
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

      {/* <Row style={{ marginBottom: 20, marginLeft: 10, backgroundColor: "white" }}>

        <Col span={7}>
          <label style={{ marginRight: 10 }}>Branch：</label>
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
          <label style={{ marginRight: 10 }}>{`${MY_STAFF_NAME_UPPER}:`} </label>
          <BeauticianSelect
            myTreeData={myTreeData}
            roleUserPairs={roleUserPairs || []}
            currentBranchInfo={currentBranchInfo || {}}
            currentBeauticianInfo={currentBeauticianInfo}
            setCurrentBeauticianInfo={setCurrentBeauticianInfo}
          />
        </Col>

        <Col span={8}>
          <label style={{ marginRight: 10 }}>Location: </label>
          <LocationSelect
            locationList={locationList}
            setCurrentLocationId={setCurrentLocationId}
            ALL_LOCATION={ALL_LOCATION}
          />
        </Col>
      </Row> */}

      <div
        className={styles.dayHeader}
        style={{ padding: 10 }}
      >
        <FullCalendar
          // https://app.skedda.com/ 例子
          // https://fullcalendar.io/ 插件
          plugins={[listPlugin]}
          events={reservationList} // 使用这个渲染页面即可
          eventClick={handleEventClick}

          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }} // 控制时间显示格式
          headerToolbar={
            {
              left: 'prev,next today',
              center: 'title',
              right: 'listDay,listWeek,listMonth'
            }
          }
          eventContent={renderEventContent} // 修改渲染的样式
          views={
            {
              listDay: { buttonText: 'list day' },
              listWeek: { buttonText: 'list week' },
              listMonth: { buttonText: 'list month' }
            }
          }
          timeZone='UTC'
          initialView='listWeek'
          navLinks={true}
          dateClick={(info) => {
            // handleDateClick(info)
          }}
        />
      </div>

      <EditModal
        ALL_STAFF={ALL_STAFF}
        myTreeData={myTreeData}
        currentBranchInfo={currentBranchInfo || {}}
        reservationList={initReservationList}
        setBranchSelectorValue={setBranchSelectorValue}
        currentRecord={currentRecord}
        visible={visibleEdit}
        usersList={usersList}
        fetAllReservation={fetAllReservation}
        setVisible={(m) => setVisibleEdit(m)}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => { setVisibleEdit(false) }}
        currentBeauticianInfo={currentBeauticianInfo}
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

    </section>
  );
};

export default connect(
  ({
    branchManagement,
    loading,
  }: {
    branchManagement: BranchSettingInterface;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    branchManagement,
    submittingOfChangeAllRoles: loading.effects['branchManagement/changeAllRoles'],
  }),
)(ListView);
