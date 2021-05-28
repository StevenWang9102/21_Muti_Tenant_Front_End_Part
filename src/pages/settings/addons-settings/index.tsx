import React, { useEffect, useState } from 'react';
import { connect, Dispatch, formatMessage, getLocale } from 'umi';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DropDownList } from './components/DropDownList'
import { CreateAddsOn } from './components/CreateAddsOn'
import { EditAddsOn } from './components/EditAddsOn'
import { Switch, Card, List, Typography, Tooltip, Button, message } from 'antd';
import styles from './style.less';
import ReceiptPrinter from './components/Icon/ReceiptPrinter.png'
import UnionPay from './components/Icon/UnionPay.png'
import WindCave from './components/Icon/WindCave.png'
import Alipay from './components/Icon/Alipay.png'
import WeChatPay from './components/Icon/WeChatPay.png'
import Xero from './components/Icon/Xero.png'
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface AddOnSettingInterface {
  dispatch: Dispatch;
  addsOnSetting: any;
}

const BranchManagement: React.FC<AddOnSettingInterface> = (props) => {
  const { dispatch } = props;
  const [currentBranchName, setCurrentBranchName] = useState()
  const [currentBranchId, setCurrentBranchId] = useState()
  const [source, setSource] = useState([])
  const [addsOnNames, setAddsOnNames] = useState({})
  const [currentItemInfo, setCurrentItemInfo] = useState({})
  const allBranchInformation = props.addsOnSetting && props.addsOnSetting.allBranchNames
  const oneBranchData = props.addsOnSetting && props.addsOnSetting.oneBranchData || []
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)

  console.log("props=", props);
  console.log('allBranchInformation=', allBranchInformation);
  console.log("oneBranchData=", oneBranchData);


  useEffect(() => {
    dispatch({ type: `addsOnSetting/loadAllBranch`, payload: null });
    setSource([]) // 清空
  }, []);

  useEffect(() => {
    setVisible(false)
    const oneBranchData = props.addsOnSetting && props.addsOnSetting.oneBranchData || []
    console.log('oneBranchData=', oneBranchData);

    const searchObjectIsActive = {}
    const searchObjectIsActive1 = {}
    const searchObjectIsInitial = {}
    const searchObjectId = {}
    const searchObjectName = {}
    const searchObjectTitle = {}

    if(oneBranchData && oneBranchData.data !=="") {
      oneBranchData.forEach(each => {
        searchObjectIsActive[each.id] = each.value
      });
  
      oneBranchData.forEach(each => {
        searchObjectIsActive1[each.type] = each.value
      });
  
      oneBranchData.forEach(each => {
        searchObjectIsInitial[each.type] = each.value === null ? false : true
      });
  
      oneBranchData.forEach(each => {
        searchObjectId[each.type] = each.id
      });
  
      oneBranchData.forEach(each => {
        searchObjectName[each.id] = each.name
      });
  
      oneBranchData.forEach(each => {
        searchObjectTitle[each.type] = each.name
      });
    }
    

    console.log('searchObject=', searchObjectIsActive);
    console.log('searchObjectId=', searchObjectId);
    console.log('searchObjectId=', searchObjectName);

    setAddsOnNames(searchObjectName)

    const list = [
      {
        "id": "Alipay",
        "type": "Payment1",
        'addsOnId': searchObjectId["Payment1"],
        "title": searchObjectTitle["Payment1"] || "Alipay (Default)",
        "avatar": Alipay,
        "description": "Alipay is a virtual payment platform launched in 2004 by the Chinese private firm Alibaba Group which was founded by Jack Ma in 1999.",
        "disabled": true,
        "isActive": searchObjectIsActive1['Payment1'] === 'true',
        "isInitial": searchObjectIsInitial['Payment1'],
      },
      {
        "id": "WeChatPay",
        "type": "Payment2",
        'addsOnId': searchObjectId["Payment2"],
        "title": searchObjectTitle["Payment2"] || 'WeChat Pay (Default)',
        "avatar": WeChatPay,
        "description": "WeChat Pay is a payment feature integrated into the WeChat app, users can complete payment quickly with smartphones.",
        "disabled": true,
        "isActive": searchObjectIsActive1['Payment2'] === 'true',
        "isInitial": searchObjectIsInitial['Payment2'],
      },
      {
        "id": "MyPOSMate",
        "type": "Payment3",
        'addsOnId': searchObjectId["Payment3"],
        "title": searchObjectTitle["Payment3"] || 'UnionPay (Default)',
        "avatar": UnionPay,
        "description": "Terminal equipment integrated with UnionPay, Alipay, WeChat Pay, Eftpos.",
        "disabled": false,
        "isActive": searchObjectIsActive1['Payment3'] === 'true',
        "isInitial": searchObjectIsInitial['Payment3'],
      },
      {
        "id": "WindCave",
        "type": "Payment4",
        'addsOnId': searchObjectId["Payment4"],
        "title": searchObjectTitle["Payment4"] || 'WindCare (Default)',
        "avatar": WindCave,
        "description": "Windcave facilitates seamless ecommerce, retail and unattended transactions for customers around the world.",
        "disabled": false,
        "isActive": searchObjectIsActive1['Payment4'] === 'true',
        "isInitial": searchObjectIsInitial['Payment4'],
      },
      {
        "id": "Xero",
        "type": "Setting1",
        'addsOnId': searchObjectId["Setting1"],
        "title": searchObjectTitle["Setting1"] || 'Xero (Default)',
        "avatar": Xero,
        "description": "Xero is a cloud-based small business accounting software with tools for managing invoicing, bank reconciliation, inventory, purchasing and more.",
        "disabled": true,
        "isActive": searchObjectIsActive1['Setting1'] === 'true',
        "isInitial": searchObjectIsInitial['Setting1'],
      },
      {
        "id": "ReceiptPrinter",
        "type": "Setting2",
        'addsOnId': searchObjectId["Setting2"],
        "title": searchObjectTitle["Setting2"] || 'Receipt Printer (Default)',
        "avatar": ReceiptPrinter,
        "description": "Receipt printers are an important part of a point of sale (POS) system. They are used in retail environments to print customer receipts.",
        "disabled": true,
        "isActive": searchObjectIsActive1['Setting2'] === 'true',
        "isInitial": searchObjectIsInitial['Setting2'],
      },
    ]

    console.log("list=", list);
    setSource(list)
  }, [oneBranchData]);

  useEffect(() => {
    console.log(allBranchInformation);

    // 默认发送
    const branchId = allBranchInformation && allBranchInformation[0].id
    branchId && requestBranchAddsOn(branchId)
    branchId && setCurrentBranchId(branchId)
  }, [allBranchInformation]);

  const requestBranchAddsOn = (branchId) => {
    // alert(branchId)
    dispatch({
      type: `addsOnSetting/requestBranchAddsOn`,
      payload: {
        branchId: branchId
      }
    });
  }

  const onSubmitAddsOnClick = (values) => {
    console.log(values);
    const value = {
      type: 'Payment',
      name: values.name,
      value: ''
    }
    dispatch({
      type: `addsOnSetting/addAddons`,
      payload: {
        values: value,
        branchId: currentBranchId
      }
    });
  }

  const checkInputName = (value) => {
    const post = {
      "Type": currentItemInfo.type,
      "Name": value
    }

    dispatch({
      type: `addsOnSetting/checkInputName`,
      payload: {
        id: currentItemInfo.addsOnId,
        branchId: currentBranchId,
        value: post,
      }
    });
  }

  const onEditAddsOnUpdate = (currentValue) => {
    console.log(currentValue);
    console.log(currentItemInfo);

    const value = [
      {
        "op": "replace",
        "path": "/name",
        "value": currentValue.name
      }
    ]

    dispatch({
      type: `addsOnSetting/updateAddons`,
      payload: {
        id: currentItemInfo.addsOnId,
        branchId: currentBranchId,
        value: value,
      }
    });
    setVisible1(false)
  }

  const deleteAddsOn = (item) => {
    console.log(item);
    console.log(currentItemInfo);

    dispatch({
      type: `addsOnSetting/deleteAddons`,
      payload: {
        id: item.addsOnId,
        branchId: currentBranchId,
      }
    });
  }

  const onSwitchActiveClick = (item) => {
    console.log(item);

    if (item.isInitial) {
      const value = [
        {
          "op": "replace",
          "path": "/value",
          "value": !item.isActive
        }
      ]
      dispatch({
        type: `addsOnSetting/updateAddons`,
        payload: {
          id: item.addsOnId,
          branchId: currentBranchId,
          value: value,
        }
      });
    } else {
      let type;
      let name;
      if (item.id === "Alipay") { type = "Payment1", name = 'Alipay' }
      if (item.id === "WeChatPay") { type = "Payment2", name = 'WeChat Pay' }
      if (item.id === "MyPOSMate") { type = "Payment3", name = 'UnionPay' }
      if (item.id === "WindCave") { type = "Payment4", name = 'WindCave' }
      if (item.id === "Xero") { type = "Setting1", name = "Xero" }
      if (item.id === "ReceiptPrinter") { type = "Setting2", name = 'Receipt Printer' }

      const add = {
        type: type,
        name: name,
        value: true,
      }

      dispatch({
        type: `addsOnSetting/addAddons`,
        payload: {
          values: add,
          branchId: currentBranchId
        }
      });
    }
  }

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        The system has connected to some third-party services. Third-party services that do not appear in the list will increase according to customer needs.
      </p>
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="This is a title"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );

  return (
    <PageHeaderWrapper title="Add-ons Settings" content={content} extraContent={extraContent}>

      <section style={{ backgroundColor: "white", height: "auto" }}>
        <DropDownList
          allBranchInformation={allBranchInformation}
          currentBranchName={currentBranchName}
          setCurrentBranchId={(m) => { setCurrentBranchId(m) }}
          setCurrentBranchName={(m) => { setCurrentBranchName(m) }}
          requestBranchAddsOn={(m) => requestBranchAddsOn(m)}
        />


        <CreateAddsOn
          onCancelButtonClick={() => setVisible(false)}
          onSubmitAddsOnClick={(m) => onSubmitAddsOnClick(m)}
          visible={visible}
        />

        <EditAddsOn
          addsOnNames={addsOnNames}
          currentItemInfo={currentItemInfo}
          onCancelButtonClick={() => setVisible1(false)}
          checkInputName={(m) => checkInputName(m)}
          onEditAddsOnUpdate={(m) => onEditAddsOnUpdate(m)}
          visible={visible1}
        />

        <div className={styles.cardList}>
          <List
            rowKey="id"
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={source}
            renderItem={item => {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    style={{color: "green"}}
                    cover={
                      <img
                        // style
                        alt="example"
                        src={item.avatar}
                      />
                    }
                    actions={[
                      <Tooltip key="activate" title="Activate current adds on">
                        <Switch
                          style={{ marginTop: 5 }}
                          checked={item.isActive}
                          onClick={() => {
                            console.log(item);
                            onSwitchActiveClick(item)
                          }}
                        />
                      </Tooltip>,
                      <Tooltip key="edit" title="Edit Adds on.">
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          disabled={!item.isInitial}
                          style={{ fontSize: "20px" }}
                          onClick={() => {
                            setCurrentItemInfo(item)
                            setVisible1(true)
                          }}
                        />
                      </Tooltip>,
                      <Tooltip key="delete" title="">

                        <Popconfirm 
                          title="Are you sure to delete?" 
                          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                          onConfirm={() => deleteAddsOn(item)}
                        >
                            <Button
                              type="link"
                              icon={<DeleteOutlined />}
                              disabled={!item.isInitial}
                              className={styles.deleteBtn}
                              style={{ fontSize: "20px" }}
                            />
                        </Popconfirm>

                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      title={<a>{item.title}</a>}
                      description={
                        <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {item.description}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>

      </section>
    </PageHeaderWrapper>

  );
};

export default connect(
  ({
    addsOnSetting,
    loading,
  }: {
    addsOnSetting: any;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    addsOnSetting,
  }),
)(BranchManagement);
