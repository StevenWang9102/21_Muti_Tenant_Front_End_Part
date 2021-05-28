import React, { useEffect, useState } from 'react';
import { connect, Dispatch, formatMessage, getLocale } from 'umi';
import jwt from 'jsonwebtoken';
import { Space, Button, Switch, Tag, message, notification } from 'antd';
import ProTable, { ProColumns, IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { EditUserDetails } from './components/EditUserDetails';
import 'antd/dist/antd.css';
import styles from './style.less';
import { ProtablePropsInterface } from './data';
import { IsSuperAdmin } from '@/utils/authority';
import { unique } from './functions/unique'
import { CascadingMenu } from './components/CascadingMenu'
import { DropDownList } from './components/DropDownList'
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
const tenantUserId = decodedToken && decodedToken.TenantUserId;

interface UserManagementInterface {
  dispatch: Dispatch;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  submittingOfChangeFullName?: boolean;
  submittingOfNewUser?: boolean;
  userManagementPro?: LocalPropsInterface;
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
  const {dispatch, userManagementPro } = props;
  const {allUserInformation, reloadAllUserSuccess, branchUserInfo } = userManagementPro
  const allBranchInformation = userManagementPro!.allBranchNames || [];
  const { allRoles } = userManagementPro!;
  const [branchName, setBranchName] = useState<any>()
  const [searchValue, setSearchValue] = useState('');
  const [currentUserId, setCurrentId] = useState<number>();

  const [currentBranchId, setCurrentBranchId] = useState<string>();
  const [roleFilter, setRoleFilter] = useState([]);
  const [dataSource, setDataSource] = useState<any>();
  const [selectedRowKeys, setSelectedKeys] = useState([]);

  const [fromPage, setFromPage] = useState<string>('');
  const [superAdmin, setSuperAdmin] = useState<any>('')
  const {warningMessage} = userManagementPro!;

  console.log("currentBranchId=", currentBranchId);
  console.log("allUserInformation=", allUserInformation);


  let branchIdsAndShortName = {}
  for (let i = 0; i < allBranchInformation.length; i++) {
    const branchId = allBranchInformation[i].id
    branchIdsAndShortName[branchId] = allBranchInformation[i].shortName
  }

  const getUserRolosList = (allUserInformation) => {
    const userRoles = []
    const roleIdNames = {}
    allRoles && allRoles.map((each) => roleIdNames[each.id] = each.name)

    allUserInformation && allUserInformation.map((eachBranch, index) => {
      const branchIdRoles = eachBranch.branchRoleIds
      let roleList = []
      branchIdRoles && branchIdRoles.forEach((each, index) => {
        let roleName = roleIdNames[each.roleId]
        roleList.push(roleName)
      })
      roleList = unique(roleList)
      userRoles.push(roleList)
    })
    return userRoles
  }

  const getUserRolosListForBranch = (allUserInformation) => {
    const userRoles = []
    const roleIdNames = {}

    // 查询Map
    allRoles && allRoles.map((each) => roleIdNames[each.id] = each.name)

    allUserInformation && allUserInformation.map((eachBranch, index) => {
      console.log('getUserRolosListForBranch,currentBranchId',currentBranchId);
      console.log('getUserRolosListForBranch,allUserInformation',allUserInformation);

        const branchIdRoles = eachBranch.branchRoleIds.filter(each=>each.branchId == currentBranchId)
        console.log('getUserRolosListForBranch,branchIdRoles',branchIdRoles);

        let roleList = []
        branchIdRoles && branchIdRoles.forEach((each, index) => {
          let roleName = roleIdNames[each.roleId]
          roleList.push(roleName)
        })
        roleList = unique(roleList)
        userRoles.push(roleList)
    })
    // 打印
    // console.log('getUserRolosListForBranch,allRoles',allRoles);
    // console.log('getUserRolosListForBranch,userRoles',userRoles);
    
    return userRoles
  }

  const sourceDataMaker = (allUserInformation, type) => {
    const sourceData: Array<any> = [];
    const userRoles = type =='all'? getUserRolosList(allUserInformation) : getUserRolosListForBranch(allUserInformation)
    const allUserInformationLocal = allUserInformation || []
    const userBranchArray = []

    allUserInformationLocal.forEach((each, index)=>{
      console.log(each);
      const userBranchRoles = each.branchRoleIds
      let branchArray = []
      userBranchRoles.forEach((each)=>{
        const branchShortName = branchIdsAndShortName[each.branchId]
        branchArray.push(branchShortName)
      })
      branchArray = unique(branchArray)
      userBranchArray.push(branchArray)
    })
    
    for (let i = 0; i < allUserInformationLocal!.length; i++) {
      const eachUser = allUserInformationLocal![i];
      const tagArray = [];
      eachUser.moniker && tagArray.push(eachUser.moniker);
      sourceData.push({
        id: eachUser.id,
        key: (i + 1).toString(),
        fullName: `${`${eachUser.firstName} ${eachUser.middleName === null ? ''
          : eachUser.middleName} ${eachUser.lastName}`}`,
        moniker: `${eachUser.moniker == null ? '-' : eachUser.moniker}`,
        code: `${eachUser.code == null ? '-' : eachUser.code}`,
        email: `${eachUser.email == null ? '-' : eachUser.email}`,
        branch: userBranchArray[i],
        active: eachUser.isInactive ? "F" : 'T',
        phone: `${eachUser.phoneNumber == null ? '-' : eachUser.phoneNumber}`,
        tags: tagArray,
        roles: userRoles[i]
      });
    }
    return sourceData
  }

  // --------------------------- 初始化 ---------------------------
  useEffect(() => {
    setFromPage('');
    dispatchFunction('getAllRoles', { value: null });
    dispatchFunction('getAllRoles', { value: null });
    dispatchFunction('getAllBranchName', 'no message');
    dispatchFunction('getAllBranchName', 'no message');
    dispatchFunction('getAllUserInformation', { value: null });
    dispatchFunction('getAllUserInformation', { value: null });
  }, []);


  useEffect(() => {
    // 全部Branch的用户信息，重新渲染页面
    const allUserInformation = (userManagementPro && userManagementPro.allUserInformation) || [];
    const sourceData = sourceDataMaker(allUserInformation, 'all')
    setDataSource(sourceData)
    if (currentBranchId) setBranchName('All Branch')
  }, [allUserInformation])


  useEffect(() => {
    // 特定Branch的用户信息，重新渲染页面
    console.log('= branchUserInfo 发生变化 =', branchUserInfo);
    const rightId = []
    branchUserInfo && branchUserInfo.map((each) => rightId.push(each.userId))
    const filtedUserInfo = []
    const render = reloadAllUserSuccess ? reloadAllUserSuccess : allUserInformation
    render.forEach((each) => {
      if (rightId.includes(each.id)) filtedUserInfo.push(each)
    })
    console.log("filtedUserInfo=", filtedUserInfo);
    const sourceData = sourceDataMaker(filtedUserInfo, 'branch')
    console.log("sourceData=", sourceData);
    setDataSource(sourceData)
  }, [branchUserInfo])

  useEffect(() => {
    // 点击Active之后，重新过滤页面数据
    console.log("reloadAllUserSuccess=", reloadAllUserSuccess);
    console.log("currentBranchId=", currentBranchId);
    requestBranchUserInformation(currentBranchId)
  }, [reloadAllUserSuccess])

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

  const getUserShortName = (allBranchInformation) => {
    let branchIdsAndShortName = {}
    for (let i = 0; i < allBranchInformation.length; i++) {
      const branchId = allBranchInformation[i].id
      branchIdsAndShortName[branchId] = allBranchInformation[i].shortName
    }
    console.log(branchIdsAndShortName);
    
    return branchIdsAndShortName
  }

  // 激活的UserID都保存在数组中
  const activeUserId = [];
  if (allUserInformation) {
    allUserInformation.forEach((eachUserInfo, index) => {
      if (eachUserInfo.isInactive === false) activeUserId.push(eachUserInfo.id);
    });
  }

  const dispatchFunction = (name, payload) => {
    dispatch({
      type: `userManagementPro/${name}`,
      payload,
    });
  };

  const onSwitchClicked = (id: number | string, message: string, type: string) => {
    const payload = { id, message, type, currentBranchId: currentBranchId };
    dispatchFunction('changActiveStatus', payload);
    setSearchValue('')
  };

  const requestBranchUserInformation = (branchId) => {
    if (branchId === "All Branch") {
      dispatchFunction('getAllUserInformation', { value: null });
    } else {
      dispatchFunction('requestBranchUserInformation', branchId);
    }
  }

  const warningMessageAlert = () => {
    message.warning('You need to keep your account active !');
  };

  const renderColorTags = (tags, type) => {
    return (
      <div>
        {tags !== "-" && tags.map((tag, record) => {
          if (type === 'Branch') {
            let color = '';
            if (tag) {
              if (tag.length > 6) color = 'green';
              else if (tag.length === 6) color = 'red';
              else if (tag.length === 4) color = 'blue';
              else if (tag.length === 3) color = 'orange';
              else color = 'purple';
            }
            return (
              <Tag color={color} key={tag}>{tag && tag}</Tag>
            );
          } else {
            // Type = Role 的情况
            let color = '';
            if (tag) {
              if( tag === 'TenantAdmin') color = 'red';
              else if (tag.length % 3 === 0) color = 'purple';
              else if (tag.length % 3 === 1) color = 'orange';
              else color = 'blue';
            }
            return (
              <Tag color={color} key={tag}>
                { tag && ( tag==='TenantAdmin'? 'Admin': tag)}
              </Tag>
            );
          }
        })}
      </div>
    )
  }

  const columns: ProColumns<ProtablePropsInterface>[] = [
    {
      title: "Staff Name",
      dataIndex: 'fullName',
      key: 'fullName',
      width: '23%',
      hideInSearch: true,
      sorter: (a, b) => a.fullName.toLowerCase().charCodeAt(0) - b.fullName.toLowerCase().charCodeAt(0),
    },

    {
      title: formatMessage({ id: 'user.management.branch' }),
      dataIndex: 'branch',
      key: 'branch',
      width: '25%',
      hideInSearch: true,
      render: (tags: Array<string>) => (
        <div>
          {renderColorTags(tags, 'Branch')}
        </div>
      ),
    },

    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      width: '25%',
      hideInSearch: true,
      filters: roleFilter,
      filterMultiple: false,
      onFilter: (value, record) => record.roles.includes(value),

      render: (tags: Array<string>) => (
        <div>
          {renderColorTags(tags, "Roles")}
        </div>
      ),
    },


    // --------------------------------- Active Switch ---------------------------------
    {
      title: formatMessage({ id: 'user.management.active' }),
      key: 'active',
      width: '10%',
      hideInSearch: true,
      filters: [
        {
          "text": "Active",
          "value": "T"
        },
        {
          "text": "Inactive",
          "value": "F"
        }
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.active.indexOf(value) === 0,

      render: (text: any, record: any) => (
        <Switch
          size="small"
          loading={props.submittingOfSwitch}
          checked={dataSource[text.key - 1].active === "T"}
          onChange={() => {
            console.log(text)
            console.log(record)

            if (tenantUserId === allUserInformation![text.key - 1].id) {
              warningMessageAlert();
            } else {
              const userId = dataSource![text.key - 1].id
              onSwitchClicked(userId, 'only one switch', 'Switch_Once');
            }
          }}
        />
      ),
    },

    {
      title: formatMessage({ id: 'user.management.action' }),
      key: 'action',
      width: '24%',
      hideInSearch: true,

      render: (text: string, wholeLineRecord: any) => (
        <Space size="middle">
          <Button
            type="primary"
            className={styles.edit}
            onClick={() => {
              dispatch({
                type: `userManagementPro/setVisibleOfNewUserModal`,
                payload: { value: true }},
              );

              setCurrentId(wholeLineRecord!.id);
              setFromPage('Edit');
            }}
          >
            {formatMessage({ id: 'user.management.edit' })}
          </Button>
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

  const deactiveStyle =  { 
    position: "absolute", 
    top: "-20px", 
    right: "320px", 
    width: "95px",
    color: "#1890ff",
    fontWeight: 600,
    border: "1px solid #1890ff"
  }
  
  const activeStyle =  { 
    position: "absolute", 
    top: "-20px", 
    right: "220px", 
    width: "95px",
    color: "#1890ff",
    fontWeight: 600,
    border: "1px solid #1890ff"
  }

  const tableBar = (_, { selectedRowKeys }) => [
    <Button
      key="3"
      type="primary"
      style={{ position: "absolute", top: "-5px", right: "20px", width: "190px" }}
      onClick={() => {
        setFromPage('Create');
        dispatchFunction('setVisibleOfNewUserModal', { value: true });
      }}
    >
      <PlusOutlined />
      {formatMessage({ id: 'user.management.create' })}
    </Button>,

    //  -------------------------- Deactive All Button --------------------------
    selectedRowKeys && selectedRowKeys.length && (
      <>
        <Button
          key="3"
          style={deactiveStyle}
          onClick={() => {
            selectedRowKeys.map((id, index) => {
              let message;
              if (index === 0) message = 'first one success';
              else if (index === selectedRowKeys.length - 1) message = 'last one success';
              else message = 'no message';
              // 选中的ID中，排除掉管理员的id
              if (activeUserId.includes(id) && id === tenantUserId) {
                warningMessageAlert();
              } else {
                activeUserId.includes(id) && onSwitchClicked(id, message, 'Switch_All_Off');
              }
              setSelectedKeys([])// 清空选中
            });
            setSearchValue('')
          }}
        >
          {formatMessage({ id: 'user.management.switchalloff' })}
        </Button>

        {/* -------------------------- Active All Button ---------------------------*/}
        <Button
          key="3"
          style={activeStyle}
          onClick={() => {
            console.log(selectedRowKeys);
            selectedRowKeys.map((id, index) => {
              let message;
              if (index === 0) message = 'first one success';
              else if (index === selectedRowKeys.length - 1) message = 'last one success';
              else message = 'no message';
              if (activeUserId.includes(id) && id === tenantUserId) {
                warningMessageAlert();// 选中的ID中，排除掉管理员的id
              } else {
                console.log(activeUserId);
                !activeUserId.includes(id) && onSwitchClicked(id, message, "Switch_All_On"); // 只有当前是关闭的时候，才去Switch
              }
              setSelectedKeys([])// 清空选中
            });
            setSearchValue('')
          }}
        >
          {formatMessage({ id: 'user.management.switchallon' })}
        </Button>
      </>
    ),
  ];

  const getRowSelection = () => {
    return currentBranchId ? false : {
      selectedRowKeys, onChange: (selectedRowKeys) => 
        setSelectedKeys(selectedRowKeys)
    }
  }

  return (
    <section style={{ backgroundColor: 'white' }}>
       <DropDownList
          currentBranchName={branchName}
          allBranchInformation={userManagementPro!.allBranchNames}
          setSelectedBranchId={(n) => { setCurrentBranchId(n); }}
          setCurrentBranchName={(n) => { setBranchName(n); }}
          requestBranchUserInformation={(m) => requestBranchUserInformation(m)}
        />

      <MySearch
        searchValue={searchValue}
        setSearchValue={(n) => setSearchValue(n)}
        dispatchFunction={(m, n) => dispatchFunction(m, n)}
      />

      <IntlProvider value={intlMap[selectedLang]}>
        <section>
          <ProTable<ProtablePropsInterface>
            style={{ margin: 20 }}
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            search={false}
            options={false}
            rowSelection={getRowSelection()}
            tableAlertRender={tableAlertRender}
            tableAlertOptionRender={tableOptions}
            toolBarRender={tableBar}
          />
        </section>

      </IntlProvider>

      <EditUserDetails
        fromPage={fromPage}
        superAdmin={allUserInformation[allUserInformation.length-1] || {}}
        branchIdsAndShortName={getUserShortName(allBranchInformation)}
        currentUserId={currentUserId}
        currentBranchId={currentBranchId}
        setSearchValue={(n)=>setSearchValue(n)}
        submittingOfNewUser={props.submittingOfNewUser}
        loadingEditUser={props.loadingEditUser}
        loadingOneUser={props.loadingOneUser}
        allBranchInformation={allBranchInformation}
        oneUserInformation={userManagementPro.oneUserInformation}
        oneUserBranchRoles={userManagementPro.oneUserBranchRoles}
        allRoles={allRoles}
        visible={userManagementPro!.visibleOfNewUser}
        dispatch={(n) => dispatch(n)}
        warningMessage={warningMessage}
        onCancelButtonClick={() => {
          dispatchFunction('setVisibleOfNewUserModal', false);
        }}
      />
    </section>
  );
};

const mapStateToProps = ({
  userManagementPro,
  loading,
}: {
  userManagementPro: LocalPropsInterface;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}) => ({
  userManagementPro,
  loadingOneUser: loading.effects['userManagementPro/getSingleUserInformation'],
  loadingEditUser: loading.effects['userManagementPro/editUserInformation'],
  submitting: loading.effects['userManagementPro/getAllUserInformation'],
  submittingOfNewUser: loading.effects['userManagementPro/createNewUser'],
  submittingOfSwitch: loading.effects['userManagementPro/changActiveStatus'],
});

export default connect(mapStateToProps)(UserManagement);
