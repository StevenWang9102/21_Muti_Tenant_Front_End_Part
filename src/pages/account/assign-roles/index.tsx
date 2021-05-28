import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input, Tooltip, Tag, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { BranchDropDownList } from './components/DropDownListOfBranch';
import { RoleDropDownList } from './components/DropDownListOfRole';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { unique } from './functions/unique'
import ProTable, {
  ProColumns,
  ActionType,
  IntlProvider,
  zhCNIntl,
  zhTWIntl,
  enUSIntl,
} from '@ant-design/pro-table';
import { getLocale, Switch } from 'umi';
import { BranchRole } from './data.d';
import { getUserFullName } from './functions/getUserFullName'
import CreateForm from './components/CreateForm';
import DeleteForm from './components/DeleteForm';
import { TableListItem } from './data.d';
import * as service from './service';
import styles from './style.less'
import { MySearch } from './components/MySearch'
import { IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';
import sort from 'fast-sort';
import dateFormat from 'dateformat'

const selectedLang = getLocale();
const intlMap = {
  'zh-CN': zhCNIntl,
  'zh-TW': zhTWIntl,
  'en-US': enUSIntl,
};

/**
 * 添加节点
 * @param fields
 */

/**
 *  删除节点
 * @param selectedRows
 */

// const dismissUsersBranchRole = async (selectedRows, parms) => {
 
//   const hide = message.loading('Loading......');
//   if (!selectedRows) return true;
//   try {
//     const arrUserIds = selectedRows.map((row) => row.id);
//     console.log(arrUserIds);


//     parms.roleId.map((roleId)=>{

//       const payload = {
//         branchId: parms.branchId[0],
//         roleId: roleId[0],
//         userIds: arrUserIds,
//       }
  
//       requestDismissUser(payload)
//       // await service.deleteUsersForOneBranchRole(payload);
//     })

//     hide();
//     return true;
//   } catch (error) {
//     hide();
//     return false;
//   }
// };

// const requestDismissUser = async (payload) =>{
//   await service.deleteUsersForOneBranchRole(payload);
// }

const TableList: React.FC<{}> = () => {
  const [assignModalVisible, setAssignModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [source, setSource] = useState([]);
  const [fromPage, setFromPage] = useState('');
  const [selectedRowsUserId, setSelectedRowsUserId] = useState([]);
  const [branchesData, setBranchesData] = useState<any[]>();
  const [branchValueEnum2, setBranchValueEnum] = useState({});
  const [rolesData, setRolesData] = useState<any[]>();
  const [rolesValueEnum, setRolesValueEnum] = useState({});
  const [selectedBranchId, setSelectedBranchId] = useState<any>();
  const [currentBranchName, setCurrentBranchName] = useState<any>();
  const [selectedRoleId, setSelectedRoleId] = useState<any>();
  const [currentRoleName, setCurrentRoleName] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [selectedRowKeys, setSelectedKeys] = useState([]);
  const [currentKeyWord, setCurrentKeyword] = useState();

  const actionRef = useRef<ActionType>();

  console.log('selectedRowsUserId1581',selectedRowsUserId);
  

  useEffect(() => {
    fetchInitialData();
    requestUserData({})
  }, []);

  useEffect(() => {
    requestUserData({})
  }, [selectedRoleId, selectedBranchId]);

  // 生成User数据用的(整体Table的数据)
  const requestUserData = async (params): Promise<any> => {
    console.log(params);

    console.log('IsTenantAdmin1', IsTenantAdmin());
    
    const hide = message.loading('Loading...');
    try {
      let userList;
      if (params.value) userList = await service.getUserWithQueryFunction({ value: params.value })
      else userList = await service.fetchUserlist({ ...params });


      // 剪切掉：创建时间最早的超级管理员，不能重新分配角色
      sort(userList).asc(user => new Date(user.createTime).getTime())
      userList = userList.slice(1)

      var newUserList = userDataFilter(params, userList)
      newUserList = roleDataFilter(params, newUserList)

      const branchList: BranchRole[] = await service.fetchUserBranchRoleslist({ ...params });
      const source = userTableGenerator(newUserList, branchList);

      console.log('requestUserData,source15', source);
      
      setSource(source)
      hide();
      return { data: source };
    } catch (error) {
      hide();
      message.error('Request Error!');
      return false;
    }
  };

  // 筛选过滤用
  const userDataFilter = (params, userList) => {
    let newUserList = []
    if (selectedBranchId && (selectedBranchId !== 'All Branches')) {
      userList.forEach((each1) => {
        each1.branchRoleIds.forEach((each2) => {
          console.log(each2);
          if (each2.branchId === selectedBranchId) {
            newUserList.push(each1)
          }
        })
      })
    } else {
      newUserList = userList
    }
    console.log(newUserList);
    return newUserList
  }

  // 筛选过滤用
  const roleDataFilter = (params, userList) => {
    let newUserList = []
    if (selectedRoleId && (selectedRoleId !== 'All Roles')) {
      userList.forEach((each1) => {
        console.log(each1);
        each1.branchRoleIds.forEach((each2) => {
          console.log(each2);
          if (each2.roleId === selectedRoleId) {
            newUserList.push(each1)
          }
        })
      })
    } else {
      newUserList = userList
    }
    console.log(newUserList);
    return newUserList
  }

  // 生产Branch以及Role字典用的
  const fetchInitialData = async () => {
    const userResponse = await service.fetchUserlist();
    const branchRoleResponse = await service.fetchUserBranchRoleslist();
    const branchResponse = await service.fetchBranchesList();
    const roleResponse = await service.fetchRolesList();

    console.log('userResponse=', userResponse);
    console.log('branchResponse=', branchResponse);
    console.log('branchRoleResponse=', branchRoleResponse);
    console.log('roleResponse=', roleResponse);

    const searchShortName = getBranchShortName(branchResponse, 'shortName')
    const searchRoleName = getBranchShortName(roleResponse, 'name')

    const userIdandBranches = {}
    const userIdandRoles = {}
    branchRoleResponse.forEach((eachBranchRole) => {
      const oneUserBranchRole = userResponse.filter(
        (user) => user.id == eachBranchRole.userId,
      );
      const branchArray = []
      const roleArray = []
      oneUserBranchRole[0].branchRoleIds.forEach((each) => {

        branchArray.push(searchShortName[each.branchId])
        roleArray.push(searchRoleName[each.roleId])
      })
      userIdandBranches[oneUserBranchRole[0].id] = unique(branchArray)
      userIdandRoles[oneUserBranchRole[0].id] = unique(roleArray)
    })


    var branchMap = userIdandBranches;
    var roleMap = userIdandRoles

    console.log('branchMap=', branchMap);
    console.log('rolesList=', roleMap);

    setBranchesData(branchResponse);
    setRolesData(roleResponse);

    // 用来查询对应数据的(从UserId到BranchName)
    setBranchValueEnum(branchMap)
    setRolesValueEnum(roleMap);
  };


  const getBranchShortName = (branchResponse, type) => {
    console.log(branchResponse);
    let searchShortName = {};
    branchResponse.forEach(element => {
      searchShortName[element.id] = element[type]
    });
    return searchShortName
  }

  const loopUpdateBranchRoles = async (arrUserId, value) => {
    const flag = []
    arrUserId.forEach(async function (vul, index) {
      var success = await service.updateUserBranchRoles({
        userId: vul,
        data: value,
      });
      success ? flag.push(true) : flag.push(false)
    });

    if (flag.includes(false)) {
      loopUpdateBranchRoles(arrUserId, value)
    } else {
      fetchInitialData()
    }
  }

  const postNewBranchRoles = async (value, selectedRows) => {
    console.log("selectedRows=", selectedRows);

    const hide = message.loading('Loading...');
    if (!selectedRows) return true;
    try {
      const arrUserId = selectedRows.map((row) => row.id);
      const success = loopUpdateBranchRoles(arrUserId, value)
      success && setAssignModalVisible(false)
      hide();
    } catch (error) {
    }
  };

  const renderColorfulTags = (tags, type) => {
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
              <Tag color={color} key={tag}>{tag && (tag==='TenantAdmin'? 'Admin': tag)}</Tag>
            );
          } else {
            let color = '';
            if (tag) {
              if (tag === 'TenantAdmin') color = 'red';
              else if (tag.length % 3 === 0) color = 'purple';
              else if (tag.length % 3 === 1) color = 'orange';
              else if (tag.length % 3 === 2) color = 'green';
              else color = 'blue';
            }
            return (
              <Tag color={color} key={tag}>
                { tag && (tag==='TenantAdmin'? 'Admin': tag)}
              </Tag>
            );
          }
        })}
      </div>
    )
  }

  // 生成基本表格数据
  const userTableGenerator = (userList = [], branchList: BranchRole[]) => {
    let userColumn = [];
    console.log('userList=', userList);
    console.log('branchList=', branchList);

    userList.map((each) => {
      console.log(each);
      const fullName = getUserFullName(each)
      userColumn.push({
        id: each.id,
        fullName: fullName,
        code: each.code,
        moniker: each.moniker,
      })
    })
    return unique(userColumn);
  };


  const handleModalVisible = (visible, selectedRows) => {
    setAssignModalVisible(visible);
    setSelectedRowsUserId(selectedRows);
  };

  const handleModalVisible1 = (visible, selectedRows) => {
    setDeleteModalVisible(visible);
    setSelectedRowsUserId(selectedRows);
  };
  

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      width: '20%',
      hideInSearch: true,
      sorter: (a, b) => a.fullName.toLowerCase().charCodeAt(0) - b.fullName.toLowerCase().charCodeAt(0),
    },

    {
      title: 'Branch',
      dataIndex: 'id',
      width: '20%',
      hideInSearch: true,
      valueEnum: { ...branchValueEnum2 }, // 值的枚举，会自动转化把值当成 key 来取出要显示的内容
      render: (tag: Array<string>) => (
        <div>
          { Array.isArray(tag) && renderColorfulTags(tag, 'Branch')}
        </div>
      ),
    },

    {
      title: 'Role',
      dataIndex: 'id',
      width: '20%',
      hideInSearch: true,
      valueEnum: { ...rolesValueEnum },
      render: (tag: Array<string>) => (
        <div>
          { Array.isArray(tag) && renderColorfulTags(tag, 'Role')}
        </div>
      ),
    },

    {
      title: 'Code',
      dataIndex: 'code',
      width: '15%',
      hideInSearch: true,
    },

    {
      title: 'Moniker',
      dataIndex: 'moniker',
      width: '15%',
      hideInSearch: true,
    },

    // {
    //   title: 'Is Active',
    //   dataIndex: 'isInactive',
    //   width: '15%',
    //   hideInSearch: true,
    //   filters: [
    //     {
    //       text: status[0],
    //       value: 'true',
    //     },
    //     {
    //       text: status[1],
    //       value: 'false',
    //     },
    //   ],
    //   render(val: boolean) {
    //     let i = val ? 0 : 1;
    //     return <Tag color={statusColor[i]}>{status[i]}</Tag>;
    //   },
    // },
  ];

  // const statusColor = [ 'red', 'blue' ]

  return (
    <PageHeaderWrapper style={{ backgroundColor: 'white' }}>
      <IntlProvider value={intlMap[selectedLang]}>

        <BranchDropDownList
          currentBranchName={currentBranchName}
          allBranchInformation={branchesData}
          setSelectedBranchId={(n) => { setSelectedBranchId(n); }}
          setCurrentBranchName={(n) => { setCurrentBranchName(n); }}
        />

        <RoleDropDownList
          currentRoleName={currentRoleName}
          allRoleInformation={rolesData}
          setSelectedRoleId={(n) => { setSelectedRoleId(n); }}
          setCurrentRoleName={(n) => { setCurrentRoleName(n); }}
        />

        <MySearch
          searchValue={searchValue}
          setSearchValue={(n) => setSearchValue(n)}
          setCurrentKeyword={(n) => setCurrentKeyword(n)}
          requestUserData={(n) => requestUserData(n)}
        />

        <section
          className={styles.reset}
          onClick={() => {
            setSelectedBranchId()
            setSelectedRoleId()
            setCurrentBranchName()
            setCurrentRoleName()
            requestUserData({})
            setSearchValue('')
          }}
        >
          Reset
      </section>

        <ProTable<TableListItem>
          headerTitle="Assign Roles"
          dataSource={source}

          columns={columns}
          rowSelection={{ selectedRowKeys, onChange: (selectedRowKeys)=>{
            setSelectedKeys(selectedRowKeys)
          },
        }}  
                
        style={{ padding: 5 }}
          rowKey="id"
          search={false}
          actionRef={actionRef}
          toolBarRender={(action, { selectedRows }) => [
            <Button
              type="primary"
              disabled={selectedRows && selectedRows.length > 0 ? false : true}
              onClick={() => 
                {
                  setFromPage('Assign')
                  handleModalVisible(true, selectedRows)
                }
                }
            >
              <PlusOutlined /> Assign Selected Staff
            </Button>,

            <Button
              danger
              disabled={selectedRows && selectedRows.length > 0 ? false : true}
              onClick={async (e) => {
                console.log('selectedRows4848',selectedRows);
                
                setFromPage('Delete')
                handleModalVisible1(true, selectedRows)
                action.reload();
              }}
            >
              <DeleteOutlined /> Dismiss Staff
            </Button>,
          ]}
          tableAlertRender={({ selectedRowKeys, selectedRows }) => (
            <div>
              Select <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> staff&nbsp;&nbsp;
            </div>
          )}
        />
      </IntlProvider>

      {/* ----------------------------- Assign Table ----------------------------- */}
        <CreateForm
          fromPage={fromPage}
          onSubmit={async (value) => {
            try {
              await postNewBranchRoles(value, selectedRowsUserId);
              handleModalVisible(false, {});
              fetchInitialData();
              requestUserData({})
            } catch {
              message.error('Assign Failed !')
            }

          }}
          onCancel={() => handleModalVisible(false, selectedRowsUserId)}
          setSelectedKeys={(n) => { setSelectedKeys(n) }}
          setSelectedRowsUserId={(n) => { setSelectedRowsUserId(n) }}
          modalVisible={assignModalVisible}
          branchesData={branchesData}
          rolesData={rolesData}
        />

      <DeleteForm
          fromPage={fromPage}
          onSubmit={async (value) => {
            // console.log('DeleteForm,onSubmit', value); 
            try {
              console.log('Error 0'); 

              const parms = {
                branchId: value.selectedBranchIds,
                roleId: value.selectedRoleIds[0]
              }
              console.log('Error 1'); 


              console.log('DeleteForm,selectedRowsUserId', selectedRowsUserId); 
              console.log('DeleteForm,map', selectedRowsUserId.map(each=>each.id)); 
              console.log('DeleteForm,parms', parms); 

              // const body = { "UserIds": selectedRowsUserId.map(each=>each.id)}
              const body =  selectedRowsUserId.map(each=>each.id)
              console.log('Error 2'); 

              await service.deleteUsersForOneBranchRole(parms, body);
              console.log('Error 3'); 
              handleModalVisible1(false, selectedRowsUserId)
              fetchInitialData();
              requestUserData({})
            } catch {
              message.error('Dismiss Failed !')
            }
          }}
          onCancel={() => handleModalVisible1(false, selectedRowsUserId)}
          setSelectedRowsUserId={(n) => { setSelectedRowsUserId(n) }}
          modalVisible={deleteModalVisible}
          branchesData={branchesData}
          rolesData={rolesData}
        />
    </PageHeaderWrapper>
  );
};

export default TableList;
