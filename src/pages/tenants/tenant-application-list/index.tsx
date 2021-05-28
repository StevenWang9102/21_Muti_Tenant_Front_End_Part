import { DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Modal, Tag } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { getLocale, history } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TenantApplication } from './data.d';
import { fetchCandidatesListSA, fetchCandidatesListTA, updateCandidateTA, deleteCandidateTA } from './service';
import { IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';
import jsonpatch from 'fast-json-patch';
import { connect, Dispatch, Link } from 'umi';
import dateFormat from "dateformat";

const selectedLang = getLocale();
const intlMap = {
  'zh-CN': zhCNIntl,
  'zh-TW': zhTWIntl,
  'en-US': enUSIntl,
};

// 更新节点
const handleUpdate = async (stepFormValues: TenantApplication, fields: FormValueType) => {
  const hide = message.loading('Updating');

  try {
    console.log("handleUpdate, stepFormValues=", stepFormValues);
    console.log("handleUpdate, fields=", fields);

    let document = stepFormValues;
    let observer = jsonpatch.observe<Object>(document);

    document.legalName = fields.legalName;
    document.tradingName = fields.tradingName;
    document.shortName = fields.shortName;
    document.phone = fields.phone;
    document.email = fields.email;
    document.street = fields.street;
    document.suburb = fields.suburb;
    document.city = fields.city;
    document.country = fields.country;
    document.gstNumber = fields.gstNumber;
    document.userFirstName = fields.userFirstName;
    document.userMiddleName = fields.userMiddleName;
    document.userLastName = fields.userLastName;

    const updateEnum = jsonpatch.generate(observer);
    console.log("handleUpdate=", updateEnum);

    await updateCandidateTA({
      id: stepFormValues.id,
      jsonpatchOperation: updateEnum,
    });

    hide();
    message.success('Updated successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Update failed, please try again');
    return false;
  }
};

interface tenantApplicationInterface {
  dispatch: Dispatch;
}

const TableList: React.FC<tenantApplicationInterface> = (props) => {
  const [sorter, setSorter] = useState<string>('');
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [isApproved, setIsApproved] = useState(false);
  // record.isApproved
  const actionRef = useRef<ActionType>();
  const { dispatch } = props;
  console.log("props=", props);

  useEffect(() => {
    dispatch({
      type: 'tenantsAndtenantProfile/ResetStatus',
    });
  })

  const columns: ProColumns<TenantApplication>[] = [

    {
      title: 'Company Name',
      dataIndex: 'shortName',
      width: '12%',
      render: (_, record) => (
        <section style={{color: 'darkblue', fontWeight: 600}}>
          {record.shortName}
        </section>
      ),    
    },

    {
      title: 'Created Time',
      dataIndex: 'createdTime',
      width: '12%',
      render: (_, record) => (
        <section>
          {dateFormat(record.createdTime, "dd/mm/yyyy")}
        </section>
      ),
    },

    {
      title: 'Legal Name',
      dataIndex: 'legalName',
      width: '12%',
    },

    {
      title: 'Trading Name',
      dataIndex: 'tradingName',
      width: '12%',
    },

    {
      title: 'Staff Name',
      width: '12%',
      render: (_, record) => {
        console.log('record', record)

        return (
          <section>
            { record.userMiddleName ? `${record.userFirstName} ${record.userMiddleName} ${record.userLastName}`:`${record.userFirstName} ${record.userLastName}`}
          </section>
        )
        
      },
    },

    {
      title: 'Status',
      dataIndex: 'isApproved',
      hideInForm: true,
      width: '9%',
      filters: [
        {
          "text": "Pending",
          "value": null,
        },
        {
          "text": "Approved",
          "value": true
        },
        {
          "text": "Denied",
          "value": false
        }
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.isApproved == value,
      render: (_, record) => (
        <Tag color={record.isApproved === null ? 'blue' :
          record.isApproved ? 'green' : 'red'}> {record.isApproved === null ? <span>Pending</span> :
            record.isApproved ? <span>Approved</span> :
              <span>Denied</span>} </Tag>),
    },

    {
      title: 'Actions',
      dataIndex: 'option',
      valueType: 'option',
      width: '25%',
      render: (_, record) => (
        <section>
          {IsSuperAdmin() ?
            <>
              <Button
                type={record.isApproved !== null ? "" : "primary"}
                style={{ padding: "0 10px", height: 25, width: 70 }}
                onClick={() => {
                  dispatch({
                    type: 'tenantsAndtenantProfile/ResetStatus',
                  });
                  setIsApproved(record.isApproved)
                  handleUpdateOneItem(record)
                }}
              >{record.isApproved !== null ? "View" : "Handle"}</Button>
            </>
            :
            record.isApproved ? <Button
              style={{ padding: "0 10px", height: 25, width: 70 }}
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >View</Button> :
              <Button
                type='primary'
                style={{ padding: "0 10px", height: 25, width: 70 }}
                onClick={() => {
                  handleUpdateModalVisible(true);
                  setStepFormValues(record);
                }}
              >Edit</Button>
          }

          {record.isApproved === null &&
            <>
              <Divider type="vertical" />
              <Button
                type='primary'
                danger
                style={{ padding: "0 10px", height: 25, width: 70 }}
                onClick={() => ConfirmRemoveOneItem(record)}
              >Delete</Button>
            </>
          }

        </section>
      ),
    },
  ];

  /**
   *  批量删除节点
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: TenantApplication[]) => {
    const hide = message.loading('Deleting');
    if (!selectedRows) return true;
    try {
      const arrHostUserId = selectedRows.map((row) => row.id);
      arrHostUserId.forEach(async function (value, index) {
        console.log(index + ":" + value);
        await deleteCandidateTA({
          id: value,
        });
      });
      hide();
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('Detete failed, please try again');
      return false;
    }
  };

  /**
   *  指定删除节点
   * @param selectedRows
   */
  const handleRemoveOneItem = async (id) => {
    const hide = message.loading('Deleting');
    try {
      await deleteCandidateTA({
        id: id,
      });
      hide();
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('Detete failed, please try again');
      return false;
    }
  };

  const ConfirmRemoveOneItem = (currentItem) => {
    Modal.confirm({
      title: 'Delete application',
      content: 'Are you sure you want to delete this application?',
      okText: 'Ok',
      cancelText: 'Cancel',
      onOk: () => handleRemoveOneItem(currentItem.id),
    });
  };

  const handleUpdateOneItem = (currentItem) => {
    const tenantApplicationFormId = currentItem.id;
    history.push({
      pathname: '/tenants/tenant-profile',
      state: {
        tenantApplicationFormId,
      },
    });
  };

  const toolBarRender = (action, { selectedRows }) => [
    selectedRows && selectedRows.length > 0 && (
      <Dropdown
        overlay={
          <Menu
            onClick={async (e) => {
              if (e.key === 'remove') {
                await handleRemove(selectedRows);
                action.reload();
              }
            }}
            selectedKeys={[]}
          >
            <Menu.Item key="isInactive">Batch Delete</Menu.Item>
          </Menu>
        }
      >
        <Button>
          Batch operations <DownOutlined />
        </Button>
      </Dropdown>
    ),
  ]

  const tableAlertRender = ({ selectedRowKeys, selectedRows }) => (
    <div>
      Selected <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>&nbsp;&nbsp;
    </div>
  )

  const checkIsNumber = (value, name) => {    
    dispatch({
      type: 'tenantApplicationList/checkNumber',
      payload: {
        name: name,
        value: !isNaN(value),
        isNull: value === ''
      },
    });
  };

  const checkEmail = (value) => {
    dispatch({
      type: 'tenantApplicationList/checkEmail',
      payload: {
        name: "email",
        value: value,
        isNull: value === ''
      },
    });
  };


  const checkIsNotNull = (value, name) => {
    dispatch({
      type: 'tenantApplicationList/checkIsNotNull',
      payload: {
        name: name,
        isNull: value === ''
      },
    });
  };

  const checkLegalName = (value, name) => {
    const payload = {
      "legalName": value
    }

    console.log(stepFormValues);
    dispatch({
      type: 'tenantApplicationList/checkLegalName',
      payload: {
        hostId: stepFormValues.hostUserId,
        cadidateId: stepFormValues.id,
        name: name,
        value: payload,
        isNull: value === ''
      },
    });
  };

  const checkShortName = (value, name) => {
    const payload = {
      "shortName": value
    }

    dispatch({
      type: 'tenantApplicationList/checkShortName',
      payload: {
        name: name,
        value: payload,
        isNull: value === ''
      },
    });
  };

  console.log("props=", props);

  return (
    <section style={{ backgroundColor: 'white' }}>
      <h2 style={{ padding: '17px 16px 11px' }}> Company Application Management</h2>

      <Button type='primary' style={{float: 'right', marginRight: '20px', zIndex: 1}}>
        <Link to="/dashboard/workplace">Go to DashBoard</Link>
      </Button>

      <IntlProvider value={intlMap[selectedLang]}>
        <ProTable<TenantApplication>
          actionRef={actionRef}
          rowKey="id"
          style={{ padding: '0px 20px' }}
          search={false}
          options={false}
          toolBarRender={toolBarRender}
          onChange={(_, _filter, _sorter) => {
            const sorterResult = _sorter as SorterResult<TenantApplication>;
            if (sorterResult.field) {
              setSorter(`${sorterResult.field}_${sorterResult.order}`);
            }
          }}
          params={{ sorter }}
          request={(parm) => IsSuperAdmin() ? fetchCandidatesListSA(parm) : fetchCandidatesListTA(parm)}
          columns={columns}
        />

        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            dispatch={dispatch}
            isApproved={isApproved}
            handleUpdate={async (value, fieldsValue) => {
              console.log(value); // 之前的
              console.log(fieldsValue);
              const success = await handleUpdate(value, fieldsValue);
              if (success) {
                handleUpdateModalVisible(false);
                setStepFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setStepFormValues({});
            }}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            warning={props.tenantApplicationList.warningMessage || {}}
            checkEmail={(m) => checkEmail(m)}
            checkIsNumber={(m, n) => checkIsNumber(m, n)}
            checkIsNotNull={(m, n) => checkIsNotNull(m, n)}
            checkLegalName={(m, n) => checkLegalName(m, n)}
            checkShortName={(m, n) => checkShortName(m, n)}
          />
        ) : null}

      </IntlProvider>
    </section>
  );
};

export default connect(
  ({
    loading,
    tenantApplicationList,
  }: {
    loading: {
      effects: {
        [key: string]: boolean;
      };
    },
    tenantApplicationList: any;
  }) => ({
    tenantApplicationList, loading
  }),
)(TableList);
