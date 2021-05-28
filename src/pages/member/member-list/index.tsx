import React, { useEffect, useState } from 'react';
import { connect, Dispatch, formatMessage, getLocale } from 'umi';
import jwt from 'jsonwebtoken';
import { Space, Button, Popconfirm, Tag, message, Row } from 'antd';
import ProTable, { ProColumns, IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { EditUserDetails } from './components/EditUserDetails';
import 'antd/dist/antd.css';
import { ProtablePropsInterface } from './data';
import { CreateUserDetails } from './components/CreateUserDetails'
import { MySearch } from './components/MySearch'
import sort from 'fast-sort';

const selectedLang = getLocale();
const intlMap = {
  'zh-CN': zhCNIntl,
  'zh-TW': zhTWIntl,
  'en-US': enUSIntl,
};

const token = localStorage.getItem('menuhub-login-token');
const decodedToken = token !== null ? jwt.decode(token) : {};

interface UserManagementInterface {
  dispatch: Dispatch;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  submittingOfChangeFullName?: boolean;
  submittingOfNewUser?: boolean;
  menberManagement?: LocalPropsInterface;
  submittingOfSwitch?: boolean;
  status?: string;
}

interface LocalPropsInterface {
  allUserInformation?: any[];
  oneUserInformation?: any[];
  warningMessage?: object;
  OneBranchInfo?: any[];
  allBranchNames: any[];
  allRoles: any[];
  visible: boolean;
  loadingEditUser: boolean;
  loadingOneUser: boolean;
  visibleOfNewUser: boolean;
}

const UserManagement: React.FC<UserManagementInterface> = (props) => {
  const { dispatch, menberManagement } = props;
  const { allUserInformation, reloadAllUserSuccess, branchUserInfo } = menberManagement
  const allBranchInformation = menberManagement!.allBranchNames || [];
  const { allRoles } = menberManagement!;
  const [oneMemberInfo, setOneMemberInfo] = useState<any>({})
  const [visible, setVisable] = useState(false)
  const [visibleCre, setVisableCre] = useState(false)
  const [membersList, setMembersList] = useState<any>()
  const [searchValue, setSearchValue] = useState('');
  const [currentUserId, setCurrentId] = useState<number>();

  const [currentBranchId, setCurrentBranchId] = useState<string>();
  const [roleFilter, setRoleFilter] = useState([]);
  const [selectedRowKeys, setSelectedKeys] = useState([]);

  const [fromPage, setFromPage] = useState<string>('');

  console.log("currentBranchId=", currentBranchId);
  console.log("allUserInformation=", allUserInformation);


  // --------------------------- 初始化 ---------------------------
  useEffect(() => {
    requestAllMembers()
  }, []);

  const requestAllMembers = () => {
    dispatch({
      type: `menberManagement/fetchMembers`,
      callback: (res) => {
        console.log('fetchMembers181,res', res.data);
        const response = res.data.filter(each=> each.firstName !== "Absence")
        const temp = sourceMaker(response)
        sort(temp).desc(user => new Date(user.creationDate).getTime())
        setMembersList(temp)
      }
    });
  }

  const requestOneMember = (id) => {
    dispatch({
      type: `menberManagement/fetchOneMembers`,
      payload: {
        id: id
      },
      callback: (res) => {
        console.log('requestOneMember,res', res);
        setOneMemberInfo(res)
      }
    });
  }

  useEffect(() => {
    // 设置Role的Filter
    const filter = []
    allRoles && allRoles.forEach((each) => {
      filter.push({
        text: each.name,
        value: each.name,
      })
    })
    setRoleFilter(filter)
  }, [allRoles])

  const onDeleteCustomer = (id) =>{
    dispatch({
      type: `menberManagement/deletCustomer`,
      payload: {
        id:id,
      },
      callback: (res)=>{
        requestAllMembers()
      }
    });
  }

  const sourceMaker = (res) => {
    console.log('sourceMaker,res',res);
    
    let tempArr = res.map(each => {
      const myAddress = []
      if (each.street) myAddress.push(each.street)
      if (each.suburb) myAddress.push(each.suburb)
      if (each.city) myAddress.push(each.city)
      if (each.country) myAddress.push(each.country)

      return {
        id: each.id,
        name: each.middleName ? `${each.firstName} ${each.middleName} ${each.lastName}` : `${each.firstName} ${each.lastName}`,
        email: each.email,
        phone: each.phone,
        code: each.barcode,
        gender: each.gender,
        dob: each.dateOfBirth,
        address: `${myAddress.join(` `)}`,
        creationDate: each.creationDate,
      }
    })
    console.log('sourceMaker,tempArr',tempArr);

    return tempArr
  }

  const searchMember =(keywords)=>{
    dispatch({
      type: `menberManagement/searchMember`,
      payload: {
        keywords: keywords,
      },
      callback: (res)=>{
        console.log('searchMember,callback,res',res);

        const temp = sourceMaker(res)
        sort(temp).desc(user => new Date(user.creationDate).getTime())
        setMembersList(temp)
      }
    });
  }

  const columns: ProColumns<ProtablePropsInterface>[] = [
    {
      title: "Member Name",
      dataIndex: 'name',
      key: 'name',
      width: '22%',
      // hideInSearch: true,
      sorter: (a, b) => a.firstName.toLowerCase().charCodeAt(0) - b.firstName.toLowerCase().charCodeAt(0),
    },

    {
      title: "Gender",
      dataIndex: 'gender',
      key: 'gender',
      width: '15%',
      render: (value, record) => {
        if (value == 1) return <Tag color="blue">Male</Tag>
        else if (value == 2) return <Tag color="red">Female</Tag>
        else return ''
      }
    },

    {
      title: "Code",
      dataIndex: 'code',
      key: 'code',
      width: '15%',
    },


    {
      title: "Email",
      dataIndex: 'email',
      key: 'email',
      width: '16%',
      // hideInSearch: true,
      // sorter: (a, b) => a.fullName.toLowerCase().charCodeAt(0) - b.fullName.toLowerCase().charCodeAt(0),
    },


    {
      title: "Phone",
      dataIndex: 'phone',
      key: 'phone',
      width: '16%',
      // hideInSearch: true,
      // sorter: (a, b) => a.fullName.toLowerCase().charCodeAt(0) - b.fullName.toLowerCase().charCodeAt(0),
    },

    {
      title: 'Action',
      key: 'action',
      width: '20%',
      hideInSearch: true,

      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{ width: 62 }}
            size='small'
            onClick={() => {
              console.log('onClick,record', record);
              setVisable(true)
              requestOneMember(record.id)
              setFromPage('Edit');
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete？"
            onConfirm={() => {
              console.log('Delete,record',record);
              onDeleteCustomer(record.id)
            }}
            okText="yes"
            cancelText="cancel"
          >
            <Button
            type="primary"
            size='small'
            danger
            style={{ width: 70 }}
          >
            Delete
          </Button>
          </Popconfirm>

          
        </Space>
      ),
    },
  ];

  const tableAlertRender = ({ selectedRowKeys, selectedRows }) =>
    `${formatMessage({ id: 'user.management.select' })} ${selectedRowKeys.length} ${formatMessage({
      id: 'user.management.user',
    })} `;

  const tableOptions = (props) => {
    const { onCleanSelected } = props;
    return (
      <Space>
        <a onClick={onCleanSelected}> {formatMessage({ id: 'user.management.clearall' })} </a>
      </Space>
    );
  };


  return (
    <section style={{ backgroundColor: 'white' }}>

      <Row>
        <MySearch
          searchValue={searchValue}
          setSearchValue={(n) => setSearchValue(n)}
          searchMember={(keywords)=>searchMember(keywords)}
          requestAllMembers={requestAllMembers}
        />

        <Button
          key="3"
          type="primary"
          style={{ position: "absolute", top: "28px", right: "20px", width: "190px" }}
          onClick={() => { setVisableCre(true) }}
        >
          <PlusOutlined />  Create New Member
        </Button>
      </Row>

      <Row>
        <IntlProvider value={intlMap[selectedLang]}>

          <ProTable<ProtablePropsInterface>
            style={{ width: '100%', margin: '100px 20px 20px 20px' }}
            columns={columns}
            dataSource={membersList}
            rowKey="id"
            search={false}
            options={false}
            // rowSelection={getRowSelection()}
            // tableAlertRender={tableAlertRender}
            tableAlertOptionRender={tableOptions}
          // toolBarRender={tableBar}
          />
        </IntlProvider>
      </Row>

      <CreateUserDetails
        requestAllMembers={requestAllMembers}
        oneMemberInfo={oneMemberInfo}
        submittingOfNewUser={props.submittingOfNewUser}
        loadingEditUser={props.loadingEditUser}
        loadingOneUser={props.loadingOneUser}
        visible={visibleCre}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => setVisableCre(false)}
      />

      <EditUserDetails
        requestAllMembers={requestAllMembers}
        oneMemberInfo={oneMemberInfo}
        submittingOfNewUser={props.submittingOfNewUser}
        loadingEditUser={props.loadingEditUser}
        loadingOneUser={props.loadingOneUser}
        visible={visible}
        dispatch={(n) => dispatch(n)}
        onCancelButtonClick={() => setVisable(false)}
      />
    </section>
  );
};

const mapStateToProps = ({
  menberManagement,
  loading,
}: {
  menberManagement: LocalPropsInterface;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}) => ({
  menberManagement,
  loadingOneUser: loading.effects['menberManagement/getSingleUserInformation'],
  loadingEditUser: loading.effects['menberManagement/editUserInformation'],
  submitting: loading.effects['menberManagement/getAllUserInformation'],
  submittingOfNewUser: loading.effects['menberManagement/createNewUser'],
  submittingOfSwitch: loading.effects['menberManagement/changActiveStatus'],
});

export default connect(mapStateToProps)(UserManagement);
