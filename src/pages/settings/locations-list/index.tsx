/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Space, Button, Switch, Popconfirm, notification } from 'antd';
import styles from './style.less';
import { DropDownList } from './components/DropDownList';
import { EditLocation } from './components/EditLocation';
import 'antd/dist/antd.css';
import { LocationInterface } from './data.d';
import { formatMessage, getLocale } from 'umi';
import ProTable, {
  ProColumns,
  IntlProvider,
  zhCNIntl,
  enUSIntl,
  zhTWIntl,
} from '@ant-design/pro-table';
import { ProtablePropsInterface } from './data';
import { IsSuperAdmin } from '@/utils/authority';

const selectedLang = getLocale();
const intlMap = {
  'zh-CN': zhCNIntl,
  'zh-TW': zhTWIntl,
  'en-US': enUSIntl,
};

interface LocalPropsInterface {
  allBranchNames: any[];
  allLocations?: any[];
  allRoles: any[];
  visible: boolean;
  visibleOfSelectBranch: boolean;
  setCurrentId: () => void;
}

const UserManagement: React.FC<LocationInterface> = (props) => {
  const { dispatch } = props;

  const dispatchFunction = (name, payload) => {
    dispatch({
      type: `location/${name}`,
      payload: payload,
    });
  };

  const [selectedBranchId, setSelectedBranchId] = useState(-1);
  const [currentBranchName, setCurrentBranchName] = useState('');
  const [currentLocationId, setCurrentId] = useState<number>();
  const [selectedRowKeys, setSelectedKeys] = useState([]);
  const [fromPage, setFromPage] = useState<string>();
  const allBranchInformation = props.location!.allBranchNames || [];
  const allLocations = props.location!.allLocations || [];
  const selectedBranch = allBranchInformation[selectedBranchId];

  console.log('allBranchInformation445', allBranchInformation);
  
  useEffect(() => {
    if(!IsSuperAdmin()){
      dispatch({ type: `location/loadAllBranch`, payload: null });
    } else {
      notification.open({
        message: 'Unauthorized Page',
        description:
          'You are on an Unauthorized Page. Developers are still working on authorization management.',
        className: 'custom-class',
        style: {
          width: 600,
        },
      });
    }
  }, []);

  useEffect(() => {
    console.log('当选中不同分支的时候，请求一次Location数据');
    
    // 当选中不同分支的时候，请求一次Location数据
    const payload = { id: selectedBranchId, message: false };
    selectedBranchId && dispatchFunction('getAllLocationInformation', payload);
  }, [selectedBranchId]);


  useEffect(() => {
    console.log("重载一次allBranchInformation =", allBranchInformation);
    // 当Branch数据返回，默认请求第一个分支
    const defaultId = allBranchInformation && allBranchInformation[0] && allBranchInformation[0].id
    const payload = { id: defaultId, message: false };
    defaultId && dispatchFunction('getAllLocationInformation', payload);
    
    setCurrentBranchName(allBranchInformation && allBranchInformation[0] && allBranchInformation[0].shortName)
    setSelectedBranchId(allBranchInformation && allBranchInformation[0] && allBranchInformation[0].id)
  }, [allBranchInformation]);

  const setVisibleOnStore = (flag: boolean) => {
    dispatchFunction('setVisible', flag);
  };

  const onDeleteButtongClicked = (index, branchId) => {
    const payload = { id: branchId, key: index };
    dispatchFunction('deleteLocation', payload);
  };

  const onSwitchClicked = (
    id: number | string,
    index: number,
    checked: boolean,
    message: string,
  ) => {
    const payload = {
      id: id,
      index: index,
      name: '/isInactive',
      value: checked,
      message: message,
    };
    dispatchFunction('changLocationActiveStatus', payload);
  };

  const columns: ProColumns<ProtablePropsInterface>[] = [
    {
      title: formatMessage({ id: 'location.nav.location' }),
      dataIndex: 'location',
      key: 'location',
      width: '25%',
      // copyable: true,
      ellipsis: true,
      hideInSearch: true,
    },

    {
      title: formatMessage({ id: 'location.nav.moniker' }),
      key: 'moniker',
      dataIndex: 'moniker',
      width: '25%',
      hideInSearch: true,

      render: (tags: Array<string>) => <div>{tags}</div>,
    },

    {
      title: formatMessage({ id: 'location.nav.note' }),
      dataIndex: 'note',
      key: 'note',
      width: '17%',
      hideInSearch: true,
    },

    // --------------------------------- Active Switch ---------------------------------
    {
      title: formatMessage({ id: 'location.active' }),
      key: 'active',
      width: '13%',
      hideInSearch: true,

      render: (text: any) => (
        <Switch
          size="small"
          checked={text && !text.isInactive}
          loading={props.loadingOfSwitch}
          onChange={() => onSwitchActiveClick(text)}
        ></Switch>
      ),
    },

    {
      title: formatMessage({ id: 'location.nav.action' }),
      key: 'action',
      width: '22%',
      hideInSearch: true,

      render: (text: any, wholeLineRecord: any) => (
        <Space size="middle">
          <a
            className={styles.edit}
            style={{ fontWeight: 600 }}
            onClick={() => {
              setVisibleOnStore(true);
              setFromPage('editLocation');
              setCurrentId(wholeLineRecord!.index - 1);
            }}
          >
            {formatMessage({ id: 'location.edit' })}
          </a>

          <Popconfirm
            title="Are you sure delete this location?"
            onClicked={() => setCurrentId(wholeLineRecord!.key - 1)}
            onConfirm={(e) => {
              const locationID = text.id;
              const branchId =
                allLocations![text.index - 1] && allLocations![text.index - 1].branchId;
              onDeleteButtongClicked(locationID, branchId);
            }}
            okText="Yes"
            cancelText="No"
          >
            <a
              href="#"
              style={{ fontWeight: 600 }}
              className={styles.delete}>
              {formatMessage({ id: 'location.delete' })}
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 单个点击Active
  const onSwitchActiveClick = (text) => {
    const currentBranchId =
      allLocations![text.index - 1] && allLocations![text.index - 1].branchId;
    const activeStatus = text && !text.isInactive;
    onSwitchClicked(currentBranchId, text.key, activeStatus, 'only one success');
  }


  // 批量active
  const onActiveAllButtonClick = () => {
    selectedRowKeys.map((id, index) => {
      let message;
      if (index === selectedRowKeys.length - 1) message = 'only one success';
      else message = 'no message';
      // 计算Location ID
      const branchId = selectedBranch && selectedBranch.id;
      const locationIndex = allLocations && allLocations[index].id;
      onSwitchClicked(branchId, locationIndex, false, message);
    });
    setSelectedKeys([]) //清空选中的Keys
  }

  // 批量deactive
  const onDeactiveAllButtonClick = () => {
    selectedRowKeys.map((id, index) => {
      let message;
      if (index === selectedRowKeys.length - 1) message = 'only one success';
      else message = 'no message';
      // 计算Location ID
      const branchId = selectedBranch && selectedBranch.id;
      const locationIndex = allLocations && allLocations[index].id;
      onSwitchClicked(branchId, locationIndex, true, message);
    });
    setSelectedKeys([]) //清空选中的Keys
  }

  const tableAlterOptions = (props) => {
    const { onCleanSelected } = props;
    return (
      <Space>
        <a onClick={onCleanSelected}>{formatMessage({ id: 'branch.management.clearall' })} </a>
      </Space>
    );
  };

  const tableAlertRender = ({ selectedRowKeys, selectedRows }) =>
    `${formatMessage({ id: 'location.select' })} ${selectedRowKeys.length} ${formatMessage({
      id: 'location.users',
    })} `;

  const toolBarButtons = (what, { selectedRowKeys }) => [
    <Button
      key="3"
      type="primary"
      onClick={() => {
        dispatchFunction('setVisible', true);
        setFromPage('createNewLocation');
      }}
    >
      <PlusOutlined />
      {formatMessage({ id: 'location.createnewlocation' })}
    </Button>,

    selectedRowKeys && selectedRowKeys.length && (
      <>
        {/* -------------------------- Deactive All Button ---------------------------*/}
        <Button
          key="3"
          className={styles.activeAllButton}
          onClick={() => {
            onDeactiveAllButtonClick()
          }}
        >
          {formatMessage({ id: 'user.management.switchalloff' })}
        </Button>

        {/* -------------------------- Active All Button ---------------------------*/}
        <Button
          key="3"
          className={styles.activeAllButton}
          onClick={() => onActiveAllButtonClick()}
        >
          {formatMessage({ id: 'user.management.switchallon' })}
        </Button>
      </>
    ),
  ];

  // ---------------------------------- Source Data ----------------------------------
  const sourceData: Array<any> = [];
  for (let i = 0; i < allLocations!.length; i++) {
    const eachLocation = allLocations![i];
    const tagArray = [];
    eachLocation.moniker && tagArray.push(eachLocation.moniker);
    sourceData.push({
      id: eachLocation.id,
      key: eachLocation.id,
      index: i + 1,
      location: eachLocation.name,
      branchId: eachLocation.branchId,
      moniker: `${eachLocation.moniker == null ? '-' : eachLocation.moniker}`,
      branch: `${eachLocation.branchName == null ? '-' : eachLocation.branchName}`,
      note: `${eachLocation.note == null ? '-' : eachLocation.note}`,
      isInactive: eachLocation.isInactive,
      tags: tagArray,
    });
  }

  return (
    <section style={{ backgroundColor: 'white', padding: "20px" }}>

      <IntlProvider value={intlMap[selectedLang]}>
        <DropDownList
          currentBranchName={currentBranchName}
          allBranchInformation={allBranchInformation}
          setSelectedBranchId={(n) => { setSelectedBranchId(n); }}
          setCurrentBranchName={(n) => { setCurrentBranchName(n); }}
        />

        <ProTable
          style={{padding: "0, 50px"}}
          columns={columns}
          dataSource={sourceData}
          search={false}
          loading={
            props.submitting ||
            props.submittingOfChangeAllNames ||
            props.submittingOfChangeAllRoles ||
            props.submittingEditLocation
          }
          options={false}
          rowKey="id"
          // rowSelection={{
          //   selectedRowKeys, onChange: (selectedRowKeys) => {
          //     setSelectedKeys(selectedRowKeys)
          //   }
          // }}
          tableAlertRender={tableAlertRender} // 蓝色提示区
          tableAlertOptionRender={tableAlterOptions} // 蓝色提示区域的操作按钮
          toolBarRender={toolBarButtons} // 控制栏的按钮区域
        />
      </IntlProvider>


      <EditLocation
        fromPage={fromPage}
        allLocations={allLocations}
        currentBranchName={currentBranchName}
        selectedBranchId={selectedBranchId}
        visible={props.location!.visible}
        loading={props.submittingEditLocation}
        loadingOfCreate={props.loadingOfCreateLocation}
        dispatch={dispatch}
        currentLocationId={currentLocationId}
        currentLocationInfo={allLocations![currentLocationId! - 1]}
        onCancelButtonClick={() => {
          dispatchFunction('setVisible', false);
        }}
      />
    </section>
  );
};

const mapStateToProps = ({
  location,
  loading,
}: {
  location: LocalPropsInterface;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}) => ({
  location,
  submitting: loading.effects['location/getAllLocationInformation'],
  submittingEditLocation: loading.effects['location/changeNames'],
  submittingOfNewUser: loading.effects['location/createNewUser'],
  loadingOfSwitch: loading.effects['location/changLocationActiveStatus'],
  loadingOfCreateLocation: loading.effects['location/createLocation'],
});

export default connect(mapStateToProps)(UserManagement);
