import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Input, Form, Button, Radio, Row, Col, Popconfirm, message } from 'antd';
import 'antd/dist/antd.css';
import sort from 'fast-sort';
import BranchSelect from './Selector/BranchSelect'
import BranchOpening from './Selector/BranchOpening'
import { WAITING_DATA, ALL_BRANCH, ALL_LOCATION,  ALL_BEAUTICIAN, MY_STAFF_NAME, MY_STAFF_NAME_LOWER, MY_STAFF_NAME_UPPER } from '../../../pages/public-component/names'
const FormItem = Form.Item;


interface PropsInterface {
  dispatch: any;
}

const STAFF_DISPLAY_NAME = 'STAFF_DISPLAY_NAME'
const BRANCH_ROLE_PAIRS = 'BRANCH_ROLE_PAIRS'

const ReservationSetting: React.FC<PropsInterface> = (props) => {
  const [form] = Form.useForm();
  const { dispatch } = props;
  const [branchList, setBranchList] = useState<Array<any>>([])
  const [branchSelectValue, setBranchSelectorValue] = useState(ALL_BRANCH);
  const [branchUserPairs, setBranchUserPairs] = useState<any>({})
  const [branchOpenPairs, setBranchOpenPairs] = useState<any>({})

  
  useEffect(() => {
    const myStaffName = localStorage.getItem(STAFF_DISPLAY_NAME) || `Staff`
    
    // 显示，给默认值
    form.setFieldsValue({
      staff: myStaffName,
    })

    // 储存，给默认值
    localStorage.setItem(STAFF_DISPLAY_NAME, myStaffName)
  }, [])

  
  useEffect(() => {
    fetchAllBranch()
  }, []);


  const fetchAllBranch = () => {
    try {
      dispatch({
        type: 'reservation/fetchAllBranch',
        callback: (res) => {
          console.log('fetchAllBranch,res', res);
          sort(res).asc(each => each.shortName.toLowerCase())
          setBranchList(res)
        }
      })
    } catch {
    }
  }

  const onComfirmClicked = () => {

    console.log('onComfirmClicked,branchUserPairs', branchUserPairs);
    const values = form.getFieldsValue()
    console.log('onComfirmClicked,values', values);

    // 显示，给默认值
    form.setFieldsValue({
      staff: values.staff,
    })

    // 储存设置
    localStorage.setItem(STAFF_DISPLAY_NAME, `${values.staff}`)
    localStorage.setItem(BRANCH_ROLE_PAIRS, JSON.stringify(branchUserPairs))

    message.success('Success')
  }

  const onComfirmOpeningHour = () =>{

    const branches = Object.keys(branchOpenPairs)
    console.log('onComfirmClicked,branchOpenPairs', branchOpenPairs);
    console.log('onComfirmClicked,branches', branches);


    branches.forEach(each=>{
      const start = branchOpenPairs[each][0]
      const end   = branchOpenPairs[each][1]

      const body =  [
        {
        op: "replace",
        path: '/openTime',
        value: start,
      },
        {
          op: "replace",
          path: '/closeTime',
          value: end,
        }]
  
      dispatch({
        type: 'reservation/updateBranchInfo',
        payload: {
          branchId: each, 
          body: body,
        },
        callback: (res) => {
          console.log('fetchAllBranch,res', res);
          // sort(res).asc(each => each.shortName.toLowerCase())
          fetchAllBranch()
        }
      })
    })
  }

  const onResetClicked = () => {
    // 设置储存
    localStorage.setItem(STAFF_DISPLAY_NAME, 'Staff')

    // 设置显示
    form.setFieldsValue({
      staff: 'Staff',
    })
  }

  const onOneBranchSelected = (value, option) => {
   
  }

  return (
    <section style={{ backgroundColor: 'white', padding: '40px 80px' }}>

      <h1 style={{fontSize: 24, marginLeft: 50, marginBottom: 20}}>Display Settings</h1>

      <Form
        hideRequiredMark
        style={{ marginTop: 8 }}
        form={form}
        name="basic"
      >
        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="Display Staff Name"
          name="staff"
          rules={[
            {
              required: true,
              message: 'Please input a name!',
            },
          ]}
        >
          <Input />
        </FormItem>

        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 23 }}
          label="Display Branch Role"
          name="role"
          rules={[
            {
              required: true,
              message: 'Please input a name!',
            },
          ]}
        >
          <BranchSelect
            dispatch={dispatch}
            branchList={branchList}
            ALL_BRANCH={ALL_BRANCH}
            WAITING_DATA={WAITING_DATA}
            branchUserPairs={branchUserPairs}
            setBranchUserPairs={setBranchUserPairs}
            branchSelectValue={branchSelectValue}
            onOneBranchSelected={onOneBranchSelected}
          />
        </FormItem>

        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 23 }}
          label="Opening Hours"
          name="opening"
          rules={[
            {
              required: true,
              // message: 'Please input a name!',
            },
          ]}
        >
          {/* @@@@@@@@@@@@@@@@@@@@@@@@ @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
          <BranchOpening
            dispatch={dispatch}
            branchList={branchList}
            ALL_BRANCH={ALL_BRANCH}
            WAITING_DATA={WAITING_DATA}
            branchUserPairs={branchUserPairs}
            branchOpenPairs={branchOpenPairs}
            setBranchOpenPairs={setBranchOpenPairs}
            setBranchUserPairs={setBranchUserPairs}

            branchSelectValue={branchSelectValue}
            onOneBranchSelected={onOneBranchSelected}
          />
        </FormItem>

        
        <Row>
          <Col offset={7} span={12}>
            <Button
              type='primary'
              onClick={() => {
                onComfirmClicked()
                onComfirmOpeningHour()
              }}
            >Comfirm
              </Button>

            <Popconfirm
              title="Are you sure to reset ？"
              onConfirm={() => {
                onResetClicked()
              }}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button
                style={{ marginLeft: 15 }}
              >Reset
              </Button>
            </Popconfirm>

          </Col>
        </Row>

      </Form>
    </section>
  );
};

export default connect(() => ({}))(ReservationSetting);
