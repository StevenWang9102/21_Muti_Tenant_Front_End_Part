import React, { useEffect, useState } from 'react';
import { connect, Dispatch, getLocale } from 'umi';
import { DatePicker, Space, Popconfirm, Button, Input, message, Row, Col } from 'antd';
import { CreateModal } from '../components/CalanderModal/CreateModal';
import { EditModal } from '../components/CalanderModal/EditModal';
import { BranchSettingInterface } from '../data';
import { AudioOutlined } from '@ant-design/icons';
import styles from '../style.less';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { IsSuperAdmin } from '@/utils/authority';
import sort from 'fast-sort';
import { clearSpaces } from '../../public-component/clearSpaces'
import moment from 'moment';
import { Select } from 'antd';


const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

const selectedLang = getLocale();
const intlMap = {
  'zh-CN': zhCNIntl,
  'zh-TW': zhTWIntl,
  'en-US': enUSIntl,
};


interface PropsInterFace {
  dispatch: Dispatch;
  visibleCreate?: boolean;
  setVisibleCreate?: (boolean)=> void;
}

const ReservationList: React.FC<PropsInterFace> = (props) => {
  // visibleCreate={visibleCreate}
  // setVisibleCreate={setVisibleCreate}
  const { dispatch} = props;
  const ALL_BRANCH = 'All Branch'

  const [searchValue, setSearchValue] = useState('');
  const [initReservationList, setInitiReservationList] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [usersList, setUsersList] = useState<Array<any>>([])
  const [branchList, setBranchList] = useState<Array<any>>([])
  const [rangePickerValue, setRangePicker] = useState([]);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [branchSelectValue, setBranchSelectorValue] = useState(ALL_BRANCH);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [myTreeData, setMyTreeData] = useState<any>([])
  const [roleUserPairs, setRoleUserPairs] = useState<any>([])

  
  console.log('branchList16684', branchList);

  useEffect(() => {
    if (!IsSuperAdmin()) {
      fetAllReservation()
      fetcheAllUsers()
      fetchAllBranch()
    }
  }, []);


  const fetAllReservation = () => {
    const hide = message.loading('Loading...')
    dispatch({
      type: 'reservation/fetAllReservation',
      callback: (res) => {
        console.log('fetAllReservation,res', res);

        const response = res.data
        sort(response).desc(user => new Date(user.creationDate).getTime())

        setBranchSelectorValue(ALL_BRANCH)
        setReservationList(res.data)
        setInitiReservationList(res.data)

        setTimeout(() => {
          hide()
        }, 2000)
      }
    })
  }

  const fetchAllBranch = () => {
    // const hide = message.loading('Loading...')
    dispatch({
      type: 'reservation/fetchAllBranch',
      callback: (res) => {
        console.log('fetchAllBranch,res', res);
        sort(res).asc(each => each.shortName.toLowerCase())
        setBranchList(res)
        setTimeout(() => {
          // hide()
        }, 2000)
      }
    })
  }

  const fetcheAllUsers = () => {
    dispatch({
      type: `reservation/fetchAllUser`,
      callback: (res) => {
        console.log('fetchAllUser,res', res);
        sort(res).asc(each => each.firstName)
        setUsersList(res)
      }
    });
  }

  const onSearchButtonClicked = () => {
    const hide = message.loading('Loading...')

    console.log('onSearchButtonClicked,rangePickerValue', rangePickerValue);
    console.log('onSearchButtonClicked,searchValue', searchValue);

    let payload;
    if (rangePickerValue.length == 0) {
      payload = {
        keyword: clearSpaces(searchValue)
      }
    } else if (searchValue == '') {
      payload = {
        start: rangePickerValue[0].format("YYYY-MM-DD"),
        end: rangePickerValue[1].add(1, 'days').format("YYYY-MM-DD"),
      }
    } else {
      payload = {
        keyword: clearSpaces(searchValue),
        start: rangePickerValue[0].format("YYYY-MM-DD"),
        end: rangePickerValue[1].add(1, 'days').format("YYYY-MM-DD"),
      }
    }

    dispatch({
      type: 'reservation/ferchReservationWithQuery',
      payload: payload,
      callback: (res) => {
        console.log("ferchReservationWithQuery,res185", res);
        sort(res).desc(user => new Date(user.creationDate).getTime())
        setReservationList(res)
        hide()
      }
    });
  };

  const onDeleteCustomer = (id) => {
    dispatch({
      type: `reservation/deleteReservation`,
      payload: {
        id: id,
      },
      callback: (res) => {
        fetAllReservation()
      }
    });
  }

  const width = "18%"

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      width: width,
      render: (text: string) => {
        return <div style={{ fontWeight: 600, color: 'darkblue' }}>{text}</div>
      },
    },

    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      width: width,
      render: (text: string) => {
        return <span>{moment(text).format("DD-MM-YYYY hh:mmA")}</span>
      },
    },

    {
      title: "End Date",
      dataIndex: 'end',
      key: 'end',
      width: width,
      render: (text: string) => {
        return <span>{moment(text).format("DD-MM-YYYY hh:mmA")}</span>
      },
    },

    {
      title: "Staff",
      dataIndex: 'beauticianName',
      key: 'beauticianName',
      width: '16%',
    },

    {
      title: "Location",
      dataIndex: 'locationName',
      key: 'locationName',
      width: '16%',
    },


    // ------------------------- Action -------------------------
    {
      title: "Action",
      key: 'action',
      width: '22%',
      render: (text, record) => (
        <>
          <Space size="middle">
            <Button
              type="primary"
              size='small'
              style={{ width: 50, marginRight: 10 }}
              onClick={() => {
                setVisibleEdit(true)
                setCurrentRecord(record)
              }}
            >
              Edit
          </Button>
          </Space>

          <Popconfirm
            title="Are you sure to delete？"
            onConfirm={() => {
              console.log('Delete,record', record);
              onDeleteCustomer(record.id)
            }}
            okText="yes"
            cancelText="cancel"
          >
            <Button
              type="primary"
              size='small'
              danger
              style={{ width: 62 }}
            >
              Delete
          </Button>
          </Popconfirm>

        </>
      ),
    },
  ];

  const WAITING_DATA = 'Waiting data...'
  const searchStyle = {
    position: 'absolute',
    top: "30px",
    right: "100px",
    width: "240px",
    zIndex: 20,
  }

  const resetStyle = {
    display: "inline-block",
    position: "absolute",
    top: "30px",
    right: "40px",
    height: "32px",
    width: "52px",
    padding: "5px 7px",
    marginLeft: "5px",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "2px",
    cursor: "pointer",
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    zIndex: 1,
  }
  

  return (
    <section style={{
      backgroundColor: "white",
      border: '2px solid white'
    }}
    >
      <Row style={{ marginTop: 30, marginLeft: 30, backgroundColor: "white" }}>
        <Col span={2} style={{ padding: '5px 0' }}> Branch </Col>

        <Col span={8} style={{ padding: '5px 0' }}>
          <Select
            style={{ width: 200 }}
            value={branchSelectValue}
            onChange={(value, option) => {
              console.log('onChange1168,value', value);
              console.log('onChange1168,option', option);
              console.log('onChange1168,initReservationList', initReservationList);
              if(value == ALL_BRANCH ) {
                setReservationList(initReservationList)
              } else {
              // 过滤当前数据
              const temp = initReservationList.filter(each=> each.branchId == value)
              setReservationList(temp)
              }
              setBranchSelectorValue(option.children)
            }}
          >
            {branchList.length == 0 ? <>
              <Option value={WAITING_DATA}>{WAITING_DATA}</Option>
            </>: <>
              <Option value={ALL_BRANCH}>{ALL_BRANCH}</Option>
              {branchList && branchList.map(each => {
              return <Option value={each.id}>{each.shortName}</Option>
            })}</>}
            
          </Select>
        </Col>

        <Col span={12} offset={2}>
          <Button
            style={{ float: 'right', marginRight: '30px'}}
            key="3"
            type="primary"
            onClick={() => setVisibleCreate(true)}
          >
            <PlusOutlined />
            Create New Reservation
          </Button>
        </Col>
      </Row>


      <Row style={{ marginTop: 20, marginLeft: 30, backgroundColor: "white" }}>
        <Col span={2} style={{ padding: '5px 0' }}> Date Range </Col>
        <Col span={20}>
          <RangePicker
            allowClear={false}
            style={{ marginRight: 10, width: 256 }}
            // value={rangePickerValue}
            onChange={(value) => setRangePicker(value)}
          />

          <Search
            // className={styles.search}
            style={searchStyle}
            enterButton="Search"
            placeholder='Search Here'
            onSearch={(value) => onSearchButtonClicked(value)}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <div
            className={styles.reset}
            style={resetStyle}
            onClick={() => {
              setSearchValue('');
              setRangePicker([])
              fetAllReservation()
            }}
          >
            Reset
          </div>
        </Col>
      </Row>

      <IntlProvider value={intlMap[selectedLang]}>
        <ProTable
          style={{ marginTop: 40, padding: 30 }}
          columns={columns}
          dataSource={reservationList}
          search={false}
          // options={{ search: true}}
          options={false}
          rowKey="id"
          // toolBarRender={toolBarRender}
        />
      </IntlProvider>

      {/* <CreateModal
        branchList={branchList}
        setVisible={(m) => setVisibleCreate(m)}
        visible={visibleCreate}
        fetAllReservation={fetAllReservation}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => {
          setVisibleCreate(false);
        }}
      /> */}

      {/* <EditModal
        currentRecord={currentRecord}
        visible={visibleEdit}
        usersList={usersList}
        fetAllReservation={fetAllReservation}
        setVisible={(m) => setVisibleEdit(m)}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => {
          setVisibleEdit(false);
        }}
      /> */}

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
)(ReservationList);
