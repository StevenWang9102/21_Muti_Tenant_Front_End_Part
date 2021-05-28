
import {
  Col,
  Input,
  Row,
  Modal,
  message,
  Button,
} from 'antd';
import jwt from 'jsonwebtoken'
import { getToken } from '@/utils/authority';
import { Form } from '@ant-design/compatible';
import React, { Component, CSSProperties, } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { GridContent } from '@ant-design/pro-layout';
import { RouteChildrenProps } from 'react-router';
import { connect } from 'dva';
import { StateType } from './model';
import { BranchDropDownList } from './components/Orders/BranchDropDown';
import { TagType, OrderItemsParams, OrderParams } from './data.d';
import styles from './styles.less';
import jsonpatch from 'fast-json-patch';
import PrintReceipt from './components/PrintReceipt';
import { history } from 'umi';
import CryptoJS from 'crypto-js';
import * as service from './service';
import { PaymentMainPage } from './components/Payment/PaymentMainPage';
import sort from 'fast-sort';
import { PaymentFooter } from './components/Payment/PaymentFooter';
import { CategoriesCardList } from './components/Categories/CategoriesCardList';
import { LocationStaff } from './components/LocationStaff/LocationStaff';
import { RenderMPMModal } from './components/Orders/RenderMPMModal';
import { OrderDetails } from './components/Orders/OrderDetails';
import { ItemDetailModal } from './components/Categories/ItemDetailModal';
import { ItemList } from './components/Categories/ItemList';
import BrowserPrinter from './components/BrowserPrinter'
import ServerPrinter from './components/ServerPrinter'
import { MemberSelector } from './components/Selector/MemberSelector';


interface CrossPlatformPOSProps extends RouteChildrenProps, FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'currentPOSData/addOrder'
      | 'currentPOSData/fetchBasicInfo'
      | 'currentPOSData/fetchBundles'
      | 'currentPOSData/fetchOneBranch'
      | 'currentPOSData/fetchLocation'
      | 'currentPOSData/fetchOneOrder'
      | 'currentPOSData/isResumeOrder'
      | 'currentPOSData/clearAllStatus'
      | 'menberManagement/fetchMembers'
    >
  >;
  currentPOSData: Partial<StateType>;
  currentBasicInfoLoading: boolean;
  currentShoppingCartLoading: boolean;
}

interface CrossPlatformPOSState {
  paymentFinished: boolean;
  newTags: TagType[];
  tabKey?: string;
  inputVisible?: boolean;
  inputValue?: string;
  visible?: boolean;
  currentOrder?: Partial<OrderParams>;
  currentOrderItem?: Partial<OrderItemsParams>;
  currentOrderItems?: Partial<OrderItemsParams[]>;
  done: boolean;
  visiableCategoryCard: boolean;
  visibleAllPayments: boolean;
  visibleAllLTs: boolean;
  LTsModelType: string;
  record: any;
  MPMVisible: boolean;
  MPMRequest: string;
  MPMMessageDisplayed: { [x: string]: any };
  currentBranchName: string;
  currentBranchId: string;
  allBranchInformation: any;
  branchSelectorDisable: boolean;
  islocationApplied: boolean;
  isStaffApplied: boolean;
  currentOrderId: string | number;
  currentStaff: undefined | string,
  currentLocation: undefined | string,
  currentSearchValue: undefined | string,
  allInformation: object,
  memeberList: Array<object>,
  selectedCustomerId: string | undefined,
  posVisible: boolean;
  isPaymentClicked: boolean;
  posStatus: string,
  currentUserName: string,
  oneBranchInfo: any,
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    loading,
    currentPOSData,
  }: {
    loading: { effects: { [key: string]: boolean } };
    currentPOSData: StateType;
  }) => ({
    currentPOSData: currentPOSData,
    currentShoppingCartLoading: loading.effects['currentPOSData/addItemsToOrder'],
  }),
)

class CrossPlatformPOS extends Component<CrossPlatformPOSProps, CrossPlatformPOSState> {
  state: CrossPlatformPOSState = {
    paymentFinished: false,
    newTags: [],
    inputVisible: false,
    inputValue: '',
    tabKey: undefined,
    visible: false,
    currentOrder: {},
    currentOrderId: '',
    currentOrderItem: {},
    currentOrderItems: [],
    done: false,
    visiableCategoryCard: false,
    visibleAllPayments: false,
    visibleAllLTs: false,
    LTsModelType: '',
    MPMVisible: false,
    MPMRequest: '',
    MPMMessageDisplayed: {},
    currentBranchId: undefined,
    currentBranchName: '',
    allBranchInformation: [],
    branchSelectorDisable: false,
    islocationApplied: false,
    isStaffApplied: false,
    currentStaff: undefined,
    currentLocation: undefined,
    currentSearchValue: '',
    record: {},
    allInformation: {},
    memeberList: [],
    selectedCustomerId: '',
    posVisible: false,
    posStatus: '',
    isPaymentClicked: false,
    currentUserName: '',
    oneBranchInfo: {}
  };

  public input: Input | null | undefined = undefined;


  componentRef: PrintReceipt; // 初始化一个ref

  renderContent = () => this.componentRef

  setRef = (ref) => (
    this.componentRef = ref
  );

  componentDidMount() {
    this.fetchInitialData();
    this.requestAllMembers()
    this.requestCurrentUser()
      // 展开左边栏 
    this.handleMenuCollapse(true)
  }

  handleMenuCollapse = (payload: boolean): void => {
    // alert('handleMenuCollapse')
    const { dispatch } = this.props;
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
  }; 

  getTenantId = ()=>{
    const gposToken = getToken();
    const decoded = jwt.decode(gposToken)
    console.log('getTenantId,gposToken', gposToken);
    console.log('getTenantId,decoded', decoded);

    return  decoded.TenantId
  }

  requestCurrentUser=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'currentPOSData/requestCurrentUser',
      callback: (res)=>{
        // 请求所有名下的Tendent 
        const tenants = res.tenants || []
        const targetTenant = this.getTenantId()
       
        console.log('requestCurrentUser,res', res);
        console.log('requestCurrentUser,tenants', tenants);
        console.log('requestCurrentUser,targetTenant', targetTenant);
        const temp = tenants.filter(each=>each.id == targetTenant)[0] || {}
        const name = temp.name || ''
        console.log('requestCurrentUser,name', name);
        
        this.setState({
          currentUserName: name
        })
      }
    });
  }

  fetchInitialData = async () => {
    const { dispatch, currentPOSData } = this.props;

    const hide = message.loading('Loading branches...')
    const branchResponse = await service.fetchBranchesList(undefined);
    hide()
    sort(branchResponse).asc((user) => user.shortName.toLowerCase());

    console.log('branchResponse=', branchResponse);

    dispatch({
      type: 'currentPOSData/fetchBasicInfo',
      payload: {
        branchId: branchResponse[0].id
      }
    });

    // 请求单一Branch信息
    this.requestOneBranchInfo(branchResponse[0].id)

    console.log('fetchInitialData,currentPOSData',currentPOSData);
    const isResumeOrder = currentPOSData && currentPOSData.data.isResumeOrder
    if (isResumeOrder) {
      dispatch({
        type: 'currentPOSData/isResumeOrder',
        payload: false
      });
    } else {
      dispatch({
        type: 'currentPOSData/clearAllStatus',
      });
    }

    // 默认状态是第一个Branch
    this.setState({
      currentOrderId: '',
      allBranchInformation: branchResponse,
      islocationApplied: branchResponse[0].isLocationApplied,
      isStaffApplied: branchResponse[0].isBeauticianApplied
    });
  };


  requestAllMembers = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `menberManagement/fetchMembers`,
      callback: (res) => {
        console.log('fetchMembers,res', res.data);
        const respsonse = res.data
        sort(respsonse).desc(each => each.firstName.toLowerCase())

        this.setState({
          memeberList: respsonse
        })
      }
    });
  }

  clearAllStatus = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'currentPOSData/clearAllStatus',
    });
    form.setFieldsValue({
      amountToPay: 0,
    });
  }

  requestOneBranchInfo = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'currentPOSData/fetchOneBranch',
      payload: {
        branchId: id
      },
      callback: (res)=>{
        console.log('fetchOneBranch184', res);
        this.setState({
          oneBranchInfo: res
        })
      }
    });

    dispatch({
      type: 'currentPOSData/fetchLocation',
      payload: {
        branchId: id
      }
    });

    dispatch({
      type: 'currentPOSData/fetchBranchPaymentModes',
      payload: {
        branchId: id
      }
    });
  }


  removeLastOrder = () => {
    localStorage.removeItem('pos-last-order');
    return;
  };


  showModal = () => {
    this.setState({
      visible: true,
      currentOrderItem: undefined,
    });
  };

  showEditModal = (item: OrderItemsParams) => {
    this.setState({
      visible: true,
      currentOrderItem: item,
    });
  };

  showAllCategoriesModal = () => {

  };

  closeAllCategoriesModal = () => {
    this.setState({
      visiableCategoryCard: false,
    });
  };

  showAllPaymentsModal = () => {
    this.setState({
      visibleAllPayments: true,
    });

  };

  closeAllPaymentsModal = () => {
    this.setState({
      visibleAllPayments: false,
    });
  };

  completePaymentsModal = () => {
    this.handleSaveOrder();
    this.setState({
      selectedCustomerId: '',
      paymentFinished: false,
      visibleAllPayments: false,
      currentOrder: {},
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onTabChange = (key: string) => {
    this.setState({
      tabKey: key as CrossPlatformPOSState['tabKey'],
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input && this.input.focus());
  };

  saveInputRef = (input: Input | null) => {
    this.input = input;
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;

    if (inputValue && newTags.filter((tag) => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }

    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };


  onSearchItemClick = (keyword) => {
    const allItemWithCode = this.props.currentPOSData.data.allItemWithCode.items
    const targetItem = allItemWithCode.filter(each => each.code === keyword && each.code !== null)

    console.log('onSearchItemClick,itemList', this.props.currentPOSData.data);
    console.log('onSearchItemClick,allItemWithCode', allItemWithCode);
    console.log('onSearchItemClick,targetItem', targetItem);

    if (targetItem.length > 0) {
      // 判断是不是重复点击
      const itemId = targetItem[0].id
      const currentOrder = this.props.currentPOSData.data.currentOrder
      const orderItems = currentOrder.orderItems || []
      const recordedItemId = orderItems.map(each => each.itemId)

      console.log('onSearchItemClick,itemId', itemId);
      console.log('onSearchItemClick,currentOrder', currentOrder);
      console.log('onSearchItemClick,orderItems', orderItems);
      console.log('onSearchItemClick,recordedItemId', recordedItemId);

      if (recordedItemId.includes(itemId)) {
        // 如果点击的是同一个，那我我们并不执行添加OrderItem的动作
        // 而是执行在原有OrderItem上，修改Quantity的动作
        const orderId = currentOrder.id
        const targetOrderItem = currentOrder.orderItems.filter(each => each.itemId == itemId)[0]
        const orderItemId = targetOrderItem && targetOrderItem.id
        const expectedQuantity = targetOrderItem.quantity + 1
        const payload = {
          orderId: orderId,
          orderItemId: orderItemId,
          body: [{ op: "replace", path: "/quantity", value: expectedQuantity }],
        }
        this.updateItemQuantity(payload)
      } else {
        this.onItemImageClicked(targetItem[0].id, 1, targetItem[0].priceInclGst)
      }
    }
  }


  onItemImageClicked = (itemId: number, quantity: number, commitPriceInclGst: number) => {
    const { dispatch, currentPOSData: { data } } = this.props;
    const currentOrderId = data.currentOrder.id;

    if (currentOrderId) {
      // 在旧订单加入新的Item
      this.addOrderItem(itemId, quantity, commitPriceInclGst);

    } else {
      // 创建新订单
      this.openLocationModal('newOrder');
      this.setState({
        branchSelectorDisable: true
      })

      if (this.state.currentBranchId) {
        dispatch({
          type: 'currentPOSData/addOrder',
          payload: {
            branchId: this.state.currentBranchId,
          },
          callback: (response) => {
            console.log('response998', response);
            this.addOrderItem(itemId, quantity, commitPriceInclGst);

            this.updateOrder()

            !response && this.setState({
              visibleAllLTs: false
            })
          },
        });
      } else {
        message.warning('Waiting for branch data...');
      }
    }
  };

  updateOrder = () => {
    const { dispatch } = this.props;

    const jsonpatchOperation = [
      { op: "replace", path: "/isLocationApplied", value: this.state.islocationApplied },
      { op: "replace", path: "/isBeauticianApplied", value: this.state.isStaffApplied },
      { op: "replace", path: "/customerId", value: this.state.selectedCustomerId }
    ]

    dispatch({
      type: 'currentPOSData/updateOrder',
      payload: {
        branchId: this.state.currentBranchId,
        orderId: this.state.currentOrderId,
        jsonpatchOperation: jsonpatchOperation,
      },
    });
  }

  updateOrderMember = (memberId) => {
    const { dispatch } = this.props;

    const jsonpatchOperation = [
      { op: "replace", path: "/customerId", value: memberId }
    ]

    dispatch({
      type: 'currentPOSData/updateOrder',
      payload: {
        branchId: this.state.currentBranchId,
        orderId: this.state.currentOrderId,
        jsonpatchOperation: jsonpatchOperation,
      },
    });
  }

  addOrderItem = (itemId, quantity, commitPriceInclGst) => {
    const hide = message.loading("Loading...")
    const { dispatch, currentPOSData: { data } } = this.props;
    const currentOrderId = data?.currentOrder?.id;
    const newItem = { orderId: data?.currentOrder?.id, };

    this.setState({
      currentOrderId: newItem.orderId ? newItem.orderId : ''
    })

    dispatch({
      type: 'currentPOSData/addItemsToOrder',
      payload: {
        branchId: this.state.currentBranchId,
        orderId: data?.currentOrder?.id,
        body: {
          itemId: itemId,
          quantity: quantity,
          commitPriceInclGst: commitPriceInclGst,
          note: '',
        }
      },

      callback: () => {
        dispatch({
          type: 'currentPOSData/fetchOneOrder',
          payload: {
            orderId: currentOrderId,
            branchId: this.state.currentBranchId,
          },
          callback: ()=>{
            hide()
          }
        });
      },
    });
  };

  handleSubmit = (formValue) => {
    console.log('handleSubmit,fieldsValue', formValue);
    this.handleUpdateOrderItem(formValue);
  };

  handleUpdateOrderItem = (fields: OrderItemsParams) => {
    const { dispatch } = this.props;
    const { currentOrderItem } = this.state;
    console.log('handleUpdate,current=', currentOrderItem);
    console.log('handleUpdate,fields=', fields);

    let document = currentOrderItem ? currentOrderItem : {};
    let observer = jsonpatch.observe<Object>(document);
    document.quantity = fields.quantity;
    document.commitPriceInclGst = fields.commitPriceInclGst;
    document.note = fields.note;

    const jsonpatchOperation = jsonpatch.generate(observer);
    console.log('handleUpdate,jsonpatchOperation=', jsonpatchOperation);

    dispatch({
      type: 'currentPOSData/updateOrderItem',
      payload: {
        ...currentOrderItem,
        branchId: this.state.currentBranchId,
        jsonpatchOperation: jsonpatchOperation,
      },
    });

    this.setState({
      done: true,
      visible: false,
    });
  };


  handleDeleteOrderItems = (currentItem: OrderItemsParams) => {
    console.log('currentItem1', currentItem);

    const { dispatch } = this.props;
    dispatch({
      type: 'currentPOSData/deleteOrderItem',
      payload: {
        branchId: this.state.currentBranchId,
        ...currentItem,
      },
    });
  };

  handleResumeOrder = () => {
    history.push('/webpos/sales_trace');
  };

  handleSaveOrder = () => {
    const { dispatch } = this.props;
    this.setState({
      branchSelectorDisable: false
    })
    dispatch({
      type: 'currentPOSData/saveSale',
    });
    this.removeLastOrder();
  };

  handleDeleteOrder = () => {
    const { dispatch, currentPOSData: { data } } = this.props;

    this.setState({
      selectedCustomerId: '',
      branchSelectorDisable: false,
      currentOrderId: '',
      inputValue: "0"
    })

    dispatch({
      type: 'currentPOSData/deleteOrder',
      payload: {
        ...data?.currentOrder,
      },
      callback: () => {
        this.removeLastOrder();
      },
    });
  };

  kickCashDrow = ()=>{

    const EFTPOS_PORTER = 'EFTPOS_PORTER'
    const EFTPOS_IP_ADDRESS = 'EFTPOS_IP_ADDRESS'

    const address = localStorage.getItem(EFTPOS_IP_ADDRESS) || 'localhost'
    const myPort = localStorage.getItem(EFTPOS_PORTER) || '5000'
    const requestAddress = `http://${address}:${myPort}/print/cashdraw`
    const userName = this.state.currentUserName
    console.log('kickCashDrow,userName', userName);

    const formData = new FormData();
    formData.append("user", userName);

    fetch(requestAddress, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      console.log('kickCashDrow,response', response);
    })
    .catch();
  }

  onPaymentMethodComfirm = (paymentId: number, pmName: string, amount: number, cashout: number) => {
    const { dispatch, currentPOSData: { data } } = this.props;
    const IS_EFTPOS_APPLIED = 'IS_EFTPOS_APPLIED'
    const isEftposApplied = localStorage.getItem(IS_EFTPOS_APPLIED) || 'YES'

    console.log('onPaymentMethodComfirm14881, isEftposApplied', isEftposApplied);
    console.log('onPaymentMethodComfirm14881, paymentId', paymentId);
    console.log('onPaymentMethodComfirm14881, pmName', pmName);
    
    const isETPOS = pmName.includes('EftPos') && isEftposApplied == 'YES'
    const isCash = pmName == 'Cash'

    console.log('onPaymentMethodComfirm9481, pmName', pmName);
    console.log('onPaymentMethodComfirm9481, isCash', isCash);
    console.log('onPaymentMethodComfirm9481, cashout', cashout);

    // 弹出钱箱
    if(isCash && cashout <= 0){
      this.kickCashDrow()
    }

    // 设置遮罩
    this.setState({
      isPaymentClicked: isETPOS? true: false,
    })

    if (data.currentInvoice && data.currentInvoice.length !== 0) {
      // 已经存在Invoice, 则增加一次支付记录
      const currentInvoice = data.currentInvoice[0]
      
      if(isETPOS){ 
        // 区分是不是ETPOS
        this.connectEtPost(paymentId, amount, currentInvoice);
      } else {
        this.createPaymentOnServer(paymentId, amount, currentInvoice)
      }
    }

    if (!data.currentInvoice || data.currentInvoice.length === 0) {
      // 如果不存在Invoice, 则新增Invoice后，增加支付记录
      console.log('onPaymentMethodClick2=', data);
      dispatch({
        type: 'currentPOSData/addInvoice',
        payload: {
          branchId: this.state.currentBranchId,
          orderId: data?.currentOrder && data?.currentOrder.id,
          priceCutInclGst: 0,
          discountRate: 0,
        },
        callback: (response) => {
          console.log('onPaymentMethodClick2=', '应该去新建Payment');
          if(isETPOS){
            this.connectEtPost(paymentId, amount, response);
          } else {
            this.createPaymentOnServer(paymentId, amount, response)
          }
        },
      });
    }
  };


  fetchWithTImeOut = (url, options, timeout) => {
    // 执行迭代器，任意一个失败，则失败
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => {
          this.setState({
            posVisible: true,
            posStatus: 'Timeout'
          })
          reject()
        }, timeout)
      )
    ]);
  }

  createPaymentOnServer = (paymentId, amount, response) => {
    const { dispatch } = this.props;

    try {
      const currentOrderId = response && response.order && response.order.id;
      const currentInvoiceId = response && response.id;


      dispatch({
        type: 'currentPOSData/createPayment',
        payload: {
          branchId: this.state.currentBranchId,
          orderId: currentOrderId,
          invoiceId: currentInvoiceId,
          body: {
            Amount: amount,
            PaymentModeid: paymentId,
            Change: this.state.inputValue, // 应该是实付款
          },
        },

        callback: (res) => {
          this.handleOrderStatus(res);
          this.setState({
            isPaymentClicked: false
          })
        },
      });
    } catch {
      message.error('Create Payment Error !')
      this.setState({
        isPaymentClicked: false
      })
    }
  }

  connectEtPost = (paymentId: number, amount: number, currentInvoice: any) => {
    // 与POS机交互

    const ref = "000"
    const eftposQueryData = {
      type: 1, //"logon",
      amount: amount,
      reference: ref,
      cashout: 0,
      refund: 0
    }

    const header = {
      method: 'POST',
      headers: {
        'Data-Type': "json",
        'Content-Type': "application/json; charset=utf-8",
      },
      body: JSON.stringify(eftposQueryData),
    }

    const EFTPOS_PORTER = 'EFTPOS_PORTER'
    const EFTPOS_IP_ADDRESS = 'EFTPOS_IP_ADDRESS'
    const EFTPOS_MODEL = 'EFTPOS_MODEL'

    const address = localStorage.getItem(EFTPOS_IP_ADDRESS) || 'localhost'
    const myPort = localStorage.getItem(EFTPOS_PORTER) || '5000'
    const model = localStorage.getItem(EFTPOS_MODEL) ||`ingenico`
    const requestAddress = `http://${address}:${myPort}/api/eftpos/${model}`


    // 加入延时 2min, 如果超过返回 错误 400
    this.fetchWithTImeOut(`${requestAddress}`, header, 999999999)
      .then((response: any) => {
        console.log('CallEftposByApi,response,综合11', response);
       
        if(response && response.status == 404) {
          this.setState({
            isPaymentClicked: false
          })
          const hide = message.error('Please check you eftpos settings or internet connection.')
          setTimeout(()=>{
            hide()}, 5000)
          }
        return response.json()
      })
      .then((response) => {
        console.log('CallEftposByApi,response,综合', response);
        if (response && response.responseCode == '00') {
          // EtPost交互成功
          this.setState({ posStatus: 'PassedPOS' })
          this.createPaymentOnServer(paymentId, amount, currentInvoice)
        } else {
          console.log('CallEftposByApi,response,失败', response);
          if (response && response.responseCode == "TI") {
            // message.error('Payment Declined ! Please try again.')
          } else if (response.responseCode == "in use") {
            message.error('Eftpos pannel is in use.')
          } else {
            message.error('Please check you connection.')
          }
          this.setState({
            isPaymentClicked: false
          })
        }
      })
      .catch(
        // this.setState({
        //   isPaymentClicked: false
        // })
      );

  };



  closeMPMModal = () => {
    this.setState({
      MPMVisible: false,
    });
  };

  handleMPMMessageDisplayed = (req: string, msg: { [x: string]: any }) => {
    this.setState({
      MPMRequest: req,
      MPMMessageDisplayed: msg,
    });
  };

  handleMD5Signature = (data: { [x: string]: any }, concatStr: string) => {
    return CryptoJS.MD5(
      Object.keys(data)
        .filter((item) => data[item] != null && data[item] != undefined && data[item] != '')
        .sort()
        .map((item) => `${item}=${data[item]}`)
        .join('&')
        .concat(concatStr),
    ).toString();
  };

  setInputValue = () => {
    const {
      currentPOSData: { data }, form
    } = this.props;

    console.log('data88', data);
    if (data.currentOrder) {
      this.setState({
        inputValue: data.currentOrder.totalInclGst.toString()
      })
      form.setFieldsValue({
        amountToPay: data.currentOrder.totalInclGst.toString(),
      });
    } else {
      this.setState({
        inputValue: data.currentInvoice[0].totalInclGst.toString()
      })
      form.setFieldsValue({
        amountToPay: data.currentInvoice[0].totalInclGst.toString(),
      });
    }
  }

  // 处理订单发生部分支付的情况
  handleOrderStatus = (res) => {
    const {
      currentPOSData: { data },
      form,
    } = this.props;

    console.log('data=', data);
    console.log('handleOrderStatus, res', res);

    const isPaid = res.isPaid;
    const balanceInclGst = res.balanceInclGst;

    console.log('isPaid=', isPaid);
    console.log('balanceInclGst=', balanceInclGst);

    this.setState({
      visibleAllPayments: true,
      inputValue: balanceInclGst.toString(),
    });

    form.setFieldsValue({
      amountToPay: balanceInclGst.toString()
    });

    if (isPaid || balanceInclGst == 0) {
      this.removeLastOrder(); // Local Storage
      this.setState({
        paymentFinished: true, // 通过这个改变页面
      });
    }
  };


  handleOrderLTSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    setTimeout(() => this.addBtn && this.addBtn.blur(), 0);
    form.validateFields((err: string | undefined, fieldsValue: OrderParams) => {
      this.handleOrderLT(fieldsValue);
    });
  };

  setCurrentLocaiton = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'currentPOSData/setCurrentLocaiton',
      payload: value
    });
  }

  setCurrentStaff = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'currentPOSData/setCurrentStaff',
      payload: value
    });
  }

  updateItemQuantity = (info) => {
    console.log('updateItemQuantity', info);
    const { dispatch } = this.props;
    const hide = message.loading('Loading...')

    dispatch({
      type: 'currentPOSData/updateOrderItem',
      payload: {
        id: info.orderItemId,
        orderId: info.orderId,
        branchId: this.state.currentBranchId,
        jsonpatchOperation: info.body,
      },
      callback:()=>{
        hide() 
      }
    });
  }

  handleOrderLT = (fields?: OrderParams) => {
    try {
      const { dispatch, currentPOSData: { data } } = this.props;
      const { usersList, locationsList } = data

      console.log('handleOrderLT 1');
      console.log('handleOrderLT 1,usersList', usersList);

      const userInfo = fields.staffId ? usersList.filter(each => each.id == fields.staffId)[0] : null
      console.log('handleOrderLT 1，userInfo', userInfo);

      const beauticianName = userInfo ? (userInfo.middleName ? `${userInfo.firstName} ${userInfo.middleName} ${userInfo.lastName}` : `${userInfo.firstName} ${userInfo.lastName}`) : ''
      console.log('handleOrderLT 2,beauticianName', beauticianName);

      const locationInfo = fields.locationId ? locationsList.filter(each => each.id == fields.locationId)[0] : null
      console.log('handleOrderLT 2,locationInfo', locationInfo);

      const locationName = locationInfo ? locationInfo.name : ''
      console.log('handleOrderLT 2,locationName', locationName);


      console.log('handleOrderLT 3');

      const jsonpatchOperation = [
        { op: "replace", path: "/locationId", value: fields.locationId },
        { op: "replace", path: "/beauticianId", value: fields.staffId },
        { op: "replace", path: "/locationName", value: locationName },
        { op: "replace", path: "/beauticianName", value: beauticianName }
      ]
      console.log('handleOrderLT 4');

      dispatch({
        type: 'currentPOSData/updateOrder',
        payload: {
          branchId: this.state.currentBranchId,
          orderId: this.state.currentOrderId,
          jsonpatchOperation: jsonpatchOperation,
        },
      });
      console.log('handleOrderLT 5');

      this.closeOrderLTModal();
    } catch {
      message.error('Save Error.')
    }
  };

  openLocationModal = (LTsModelType?: string) => {
    this.setState({
      visibleAllLTs: true,
      LTsModelType: LTsModelType,
    });
  };

  closeOrderLTModal = (LTsModelType?: string) => {
    this.setState({
      visibleAllLTs: false,
      LTsModelType: LTsModelType,
    });
  };

  resetLocationAndStaffApplied = (status1, status2) => {
    this.setState({
      islocationApplied: status1,
      isStaffApplied: status2,
    });
  };

  openBrowerPrinter = () => {

    var root = document.getElementById('PrintPOSReceiptBrowser')
    var print = document.getElementById("idPrinterContent").contentWindow;

    console.log('openBrowerPrinter,root', root.style.width);

    print.document.open();
    print.document.write(root.innerHTML);
    print.document.close();
    print.focus();
    print.print();
  }


  addBtn: HTMLButtonElement | undefined | null = undefined;

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  render() {
    const {
      paymentFinished,
      visibleAllLTs,
      LTsModelType,
      done,
      currentOrderItem,
      visible,
      visiableCategoryCard,
      visibleAllPayments,
    } = this.state;

    const { currentPOSData: { data } } = this.props;

    const {
      form: {
        getFieldDecorator,
        getFieldsError,
        getFieldError,
        getFieldValue,
      },
    } = this.props;

    const locationsList = data?.locationsList;
    const usersList = data?.usersList;
    const currentOrder = data?.currentOrder

    console.log('POS_页面,currentOrder', currentOrder);
    console.log('AccountCenter,this.props.currentPOSData', this.props.currentPOSData);
    const { islocationApplied, isStaffApplied, selectedCustomerId, allBranchInformation } = this.state
    const { allInformation, currentBranchName } = this.state

    const editAndDelete = (key: string, currentItem: OrderItemsParams) => {
      if (key === 'edit') this.showEditModal(currentItem);

      if (key === 'delete') {
        this.handleDeleteOrderItems(currentItem)
      }
    };

    const showAllCategories = () => {
      this.setState({
        visiableCategoryCard: true,
      });
    };

    const hasErrors = (fieldsError: Record<string, string[] | undefined>, fieldValue: any) => {
      let haveFV: boolean = false;
      let passFE: boolean = false;
      if (fieldValue !== undefined && fieldValue != '') haveFV = true;
      if (Object.keys(fieldsError).some((field) => fieldsError[field])) passFE = true;
      console.log(haveFV);
      console.log(passFE);
      if (haveFV && !passFE) return false;
      else return true;
    };

    const footerContent = (fromPage) => {
      return <PaymentFooter
        fromPage={fromPage}
        data={data}
        styles={styles}
        usersList={usersList}
        setInputValue={this.setInputValue}
        currentBranchId={this.state.currentBranchId}
        oneBranchInfo={this.props.currentPOSData.data.oneBranchInfo}
        setLacationStaffVisible={(n) => this.setState({ visibleAllLTs: n })}
        getLastOrder={this.state.currentOrderId}
        showAllPaymentsModal={this.showAllPaymentsModal}
        allProps={this.props.currentPOSData.data}
        openLocationModal={this.openLocationModal}
        setStaffName={(n) => this.setState({ currentStaff: n })}
        setLocationName={(n) => this.setState({ currentLocation: n })}
      />
    }

    const isInvoiceExist = data.currentInvoice != undefined && data.currentInvoice.length != 0

    return (
      <GridContent style={{ backgroundColor: 'white', padding: 15 }}>

        {/* ---------------------- 打印用的锚点 ---------------------- */}
        <iframe
          id="idPrinterContent"
          style={{
            height: 0,
            width: 0,
            position: 'absolute'
          }}>
        </iframe>

        {/* ---------------------- 用于Server打印 ---------------------- */}
        <ServerPrinter
          dispatch={this.props.dispatch}
          token={getToken()}
          record={this.state.record || {}}
          oneBranchInfoPre={this.state.oneBranchInfo}
          openBrowerPrinter={() => this.openBrowerPrinter()}
          setAllInformation={(m) => this.setState({ allInformation: m })}
        />

        {/* ---------------------- 用于Browser打印 ---------------------- */}
        <BrowserPrinter
          allInformation={allInformation}
        />

        <Row gutter={24} style={{ backgroundColor: 'white', margin: 10 }}>
          <Col span={12}>
            <BranchDropDownList
              isInvoiceExist={isInvoiceExist}
              currentOrder={this.props.currentPOSData.data}
              dispatch={this.props.dispatch}
              setCurrentLocaiton={this.setCurrentLocaiton}
              setCurrentStaff={this.setCurrentStaff}
              setBranchDropDropDownDisable={(n) => { this.setState({ branchSelectorDisable: n }) }}
              branchSelectorDisable={this.state.branchSelectorDisable}
              currentBranchName={currentBranchName}
              oneBranchInfo={this.props.currentPOSData.data.oneBranchInfo}
              allBranchInformation={allBranchInformation}
              requestOneBranchInfo={this.requestOneBranchInfo}
              resetLocationAndStaffApplied={this.resetLocationAndStaffApplied}
              setCurrentOrderId={(n) => { this.setState({ currentOrderId: n }) }}
              setSelectedBranchId={(n) => { this.setState({ currentBranchId: n }) }}
              setCurrentBranchName={(n) => { this.setState({ currentBranchName: n }) }}
              setIslocationApplied={(n) => { this.setState({ islocationApplied: n }) }}
              setIsStaffApplied={(n) => { this.setState({ isStaffApplied: n }) }}
            />
          </Col>

          {/* ---------------------- Member 选择器 ---------------------- */}
          <Col span={12}>
            {!data.isResumeOrder &&
              <MemberSelector
                memeberList={this.state.memeberList}
                isInvoiceExist={isInvoiceExist}
                selectedCustomerId={selectedCustomerId}
                currentOrder={currentOrder}
                updateOrderMember={this.updateOrderMember}
                setSelectedCustomerId={(m) => this.setState({
                  selectedCustomerId: m
                })}
              />
            }
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xl={12} lg={24} md={24}>
            {/* ---------------------------- Location ---------------------------- */}
            {(islocationApplied || isStaffApplied) &&
              <LocationStaff
                data={data}
                allProps={this.props.currentPOSData.data}
                styles={styles}
                currentOrder={currentOrder}
                islocationApplied={this.state.islocationApplied}
                isStaffApplied={this.state.isStaffApplied}
                LTsModelType={LTsModelType}
                oneBranchInfo={this.props.currentPOSData.data.oneBranchInfo}
                closeOrderLTModal={this.closeOrderLTModal}
                setCurrentLocaiton={this.setCurrentLocaiton}
                setCurrentStaff={this.setCurrentStaff}
                visibleAllLTs={visibleAllLTs}
                getFieldDecorator={getFieldDecorator}
                handleOrderLTSubmit={this.handleOrderLTSubmit}
                locationsList={locationsList}
                usersList={usersList}
              />}

            <OrderDetails
              data={data}
              currentSearchValue={this.state.currentSearchValue}
              setCurrentValue={(n) => this.setState({ currentSearchValue: n })}
              onSearchItemClick={this.onSearchItemClick}
              handleSaveOrder={this.handleSaveOrder}
              handleDeleteOrder={this.handleDeleteOrder}
              handleResumeOrder={this.handleResumeOrder}
              editAndDelete={editAndDelete}
              footerContent={footerContent('MainPage')}
            />

            <ItemDetailModal
              styles={styles}
              currentOrderItem={currentOrderItem}
              getFieldDecorator={getFieldDecorator}
              done={done}
              visible={visible}
              handleDone={this.handleDone}
              handleSubmit={this.handleSubmit}
              handleCancel={this.handleCancel}
            />

            <RenderMPMModal
              handleOrderLTSubmit={this.handleOrderLTSubmit}
              state={this.state}
              styles={styles}
              closeMPMModal={this.closeMPMModal}
            />

            <PaymentMainPage
              data={data}
              oneBranchInfo={this.state.oneBranchInfo}
              kickCashDrow={this.kickCashDrow}
              visibleAllPayments={visibleAllPayments}
              paymentFinished={paymentFinished}
              isPaymentClicked={this.state.isPaymentClicked}
              closeAllPaymentsModal={this.closeAllPaymentsModal}
              paymentFooterContent={footerContent('Payment')}
              setPrinterRecord={(m) => { this.setState({ record: m }) }}
              isFieldTouched={this.props.form.isFieldTouched}
              getFieldError={getFieldError}
              allProps={this.props}
              clearAllStatus={this.clearAllStatus}
              openLocationModal={this.openLocationModal}
              showAllPaymentsModal={this.showAllPaymentsModal}
              completePaymentsModal={this.completePaymentsModal}
              setRef={(ref) => this.componentRef = ref}
              renderContent={this.renderContent}
              getFieldDecorator={getFieldDecorator}
              getFieldsError={getFieldsError}
              hasErrors={hasErrors}
              getFieldValue={getFieldValue}
              dispatch={this.props.dispatch}
              inputValue={this.state.inputValue}
              form={this.props.form}
              setInputValue={(value) => this.setState({ inputValue: value })}
              currentBranchId={this.state.currentBranchId}
              paymentModesList={this.props.currentPOSData.data.paymentModesList}
              handleInputChange={this.handleInputChange}
              onPaymentMethodComfirm={this.onPaymentMethodComfirm}
            />
          </Col>

          {/* --------------------------------- Item List --------------------------------- */}
          <Col xl={12} lg={24} md={24}>
            <ItemList
              data={data}
              styles={styles}
              tabKey={this.state.tabKey}
              currentOrder={data?.currentOrder}
              updateItemQuantity={this.updateItemQuantity}
              setTabKey={(n) => this.setState({ tabKey: n })}
              bundlesList={this.props.currentPOSData.data.bundlesList}
              currentBranchId={this.state.currentBranchId}
              onTabChange={this.onTabChange}
              isResumeOrder={data.isResumeOrder}
              categoriesTabList={this.categoriesTabList}
              showAllCategories={showAllCategories}
              onItemImageClicked={this.onItemImageClicked}
            />

            <CategoriesCardList
              tabKey={this.state.tabKey}
              onTabChange={this.onTabChange}
              currentPOSData={this.props.currentPOSData}
              visiableCategoryCard={visiableCategoryCard}
              closeAllCategoriesModal={this.closeAllCategoriesModal}
            />

          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Form.create<CrossPlatformPOSProps>()(CrossPlatformPOS);
