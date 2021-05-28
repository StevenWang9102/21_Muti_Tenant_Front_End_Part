import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Table, Space, Button, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { EditRole } from './components/EditRole';
import { SingleLineRecordInterface } from './data';
import { RoleManagementInterface, LocalPropsInterface } from './data';
import 'antd/dist/antd.css';
import styles from './style.less';
import { formatMessage } from 'umi';

const RoleManagement: React.FC<RoleManagementInterface> = (props) => {
  const { dispatch } = props;
  const allRoles = props.roleManagementPro && props.roleManagementPro.allRoles;
  const [currentRoleInfo, setCurrentRoleInfo] = useState<any>();
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    dispatch({
      type: 'roleManagementPro/getAllRoles',
    });
  }, []);


  // Admin账号是：ba5aea99-dbd5-4aa4-89b5-fae951359aff

  const setVisibleOnStore = (flag: boolean) => {
    dispatch({
      type: 'roleManagementPro/setVisible',
      payload: flag,
    });
  };

  const columns = [
    {
      title: formatMessage({ id: 'user.management.role' }),
      dataIndex: 'rolename',
      key: 'rolename',
      width: '50%',
      render: (text)=>(
        <div>
          {text === 'TenantAdmin'? 'Admin': text}
        </div>
      )
    },

    // --------------------------- Actions -------------------------
    {
      title: formatMessage({ id: 'user.management.action' }),
      key: 'action',
      width: '40%',
      render: (text: any, wholeLineRecord: SingleLineRecordInterface) => (
        // console.log();

        <Space size="middle">
          {text.rolename !== 'TenantAdmin' && (
            <a
              onClick={() => {
                setVisibleOnStore(true);
                setCurrentPage('EditRole');
                setCurrentRoleInfo(allRoles![text.key - 1]);
              }}
            >
              <EditOutlined /> &nbsp;
              {formatMessage({ id: 'user.management.edit' })}
            </a>
          )}

          <Popconfirm
            className={styles.deleteButton}
            title="Are you sure to delete this role？"
            onConfirm={() => {
              console.log(text.rolename);
              console.log(text);
              console.log(text);
              console.log(wholeLineRecord);
              console.log(wholeLineRecord);
              console.log(wholeLineRecord);

              dispatch({
                type: 'roleManagementPro/deleteRole',
                payload: currentRoleInfo && currentRoleInfo!.id,
              });
            }}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            {text.rolename !== 'TenantAdmin' && (
              <a
                href="#"
                className={styles.delete}
                onClick={() => {
                  setCurrentRoleInfo(allRoles![text.key - 1]);
                }}
              >
                <DeleteOutlined />
                &nbsp; {formatMessage({ id: 'user.management.delete' })}
              </a>
            )}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const sourceData: Array<SingleLineRecordInterface> = [];

  for (let i = 0; i < (allRoles! && allRoles!.length); i++) {
    const eachRole = allRoles![i];

    sourceData.push({
      key: (i + 1).toString(),
      rolename: eachRole.name,
    });
  }

  return (
    <div>
      <Button
        type="primary"
        className={styles.createRole}
        onClick={() => {
          setVisibleOnStore(true);
          setCurrentPage('AddRole');
        }}
      >
        {formatMessage({ id: 'user.management.addnewrole' })}
      </Button>

      <EditRole
        currentPage={currentPage}
        submittingOfNewUser={props.submittingOfNewUser}
        currentRoleInfo={currentRoleInfo}
        allRoles={allRoles}
        visible={props.roleManagementPro!.visible}
        dispatch={dispatch}
        onCancelButtonClick={() => {
          setVisibleOnStore(false);
        }}
      />

      <Table 
        loading={props.submitting} 
        style={{padding: "20px 60px 10px 60px"}}
        columns={columns} 
        dataSource={sourceData}
        pagination={sourceData.length < 10 && false}
      />
    </div>
  );
};

const mapStateToProps = ({
  roleManagementPro,
  loading,
}: {
  roleManagementPro: LocalPropsInterface;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}) => ({
  roleManagementPro,
  submitting: loading.effects['roleManagementPro/getAllRolesSuccess'],
});

export default connect(mapStateToProps)(RoleManagement);
