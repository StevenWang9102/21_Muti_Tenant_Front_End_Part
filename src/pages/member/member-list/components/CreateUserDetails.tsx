import React, { useEffect, useState, FC } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import 'antd/dist/antd.css';
import { Dispatch } from 'umi';
import { Tabs } from 'antd';
import style from '../style.less';
import { formatMessage } from 'umi';
import styles from '../style.less';
import jsonpatch from 'fast-json-patch';
import { Radio } from 'antd';
import { MyDatePicker } from './DatePickerCreate';
import moment from 'moment';

const { TextArea } = Input;
const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};


export const CreateUserDetails: FC<any> = ({
  oneMemberInfo,
  dispatch,
  onCancelButtonClick,
  visible,
  submittingOfNewUser,
  loadingEditUser,
  loadingOneUser,
  requestAllMembers,
}) => {

  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState('1');
  const [radioValue, setRadioValue] = useState('PreferNotToSay');
  const [dateOfBirth, setDateOfBirth] = useState(undefined);

  useEffect(() => {
    if(visible) {
      form.resetFields()
      setActiveKey('1')
      setDateOfBirth(undefined)
      form.setFieldsValue({gender: 'PreferNotToSay'})
      // setRadioValue('PreferNotToSay')
    }
  }, [visible]);


  // --------------------------- 编辑用户 ---------------------------
  const onCreateMemberClick = () => {
    const values = form.getFieldsValue()
    let myGender;

    console.log('onCreateMemberClick,values',values);
     
    if(values.gender == 'Male') myGender= 1
    else if(values.gender == 'Female') myGender= 2
    else myGender = 0

    let document: any = {};

    document.firstName = values.firstName;
    document.lastName = values.lastName;
    document.middleName = values.middleName;
    document.gender = myGender;
    document.moniker = values.moniker;

    document.barcode = values.barcode;
    document.dateOfBirth = dateOfBirth && dateOfBirth.format('YYYY-MM-DD');
    document.note = values.note;
    document.phone = values.phone || undefined;
    document.email = values.email;

    document.street = values.street;
    document.suburb = values.suburb;
    document.city = values.city;
    document.country = values.country;

    console.log("onCreateMemberClick=", document);

    dispatch({
      type: 'menberManagement/createMember',
      payload: {
        body: document,
      },
      callback: (res)=>{
        console.log('callback,res198', res);
        requestAllMembers()
        onCancelButtonClick()
      }
    });

  };

  const onRadioButtonChange = event => {
    console.log('onRadioButtonChange checked', event.target.value);
    setRadioValue(event.target.value);
  };

  // --------------------------- 检查Number ---------------------------
  const width = '90%'
  const myStyle = { width: 380, marginLeft: 70 }

  return (
    <Modal
      visible={visible}
      destroyOnClose={false}
      footer={null}
      width={600}
      bodyStyle={{ padding: 50 }}
      confirmLoading={submittingOfNewUser || loadingOneUser}
      onCancel={() => { onCancelButtonClick() }}
    >
      <Form {...layout} name="basic" form={form} className={styles.alert}>
        {/* ------------------------ Basic Information ------------------------ */}
        <Tabs
          activeKey={activeKey}
          onChange={() => setActiveKey(activeKey === '1' ? '2' : '1')}
          style={{ marginBottom: 32 }}
        >
          <TabPane tab="Basic Information" key="1">
            <h3 className={style.h3Header}>
              Basic Information
            </h3>

            <Form.Item
              label="First Name"
              name="firstName"
              style={myStyle}
              rules={[{ required: true, message: 'Please input your fistname!' }]}
            >
              <Input  style={{ width: width }} />
            </Form.Item>

            <Form.Item
              label="Middle Name"
              name="middleName"
              style={myStyle}
            >
              <Input
                style={{ width: width }}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              style={myStyle}
              rules={[
                {
                  required: true,
                  message: 'Please input your lastname!',
                },
              ]}
            >
              <Input
                style={{ width: width }}
               />
            </Form.Item>

            <Form.Item
              label="Moniker"
              name="moniker"
              style={myStyle}
            >
              <Input style={{ width: width }} />
            </Form.Item>


            <Form.Item
              label="Gender"
              name="gender"
              style={myStyle}
            >
              <Radio.Group value={radioValue} onChange={onRadioButtonChange} >
                <Radio value='Male'>Male</Radio>
                <Radio value='Female'>Female</Radio>
                <Radio value='PreferNotToSay'>Not memtioned</Radio>
              </Radio.Group>
            </Form.Item>

            <h3 className={style.h3Header}>{formatMessage({ id: 'user.management.contact' })}</h3>

            <Form.Item
              label="Email"
              name="email"
              style={myStyle}
              rules={[
                {
                  required: true,
                  message: 'Please input an email!',
                },
              ]}
            >
              <Input  style={{ width: width }} />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              style={myStyle}
            >
              <Input
                style={{ width: width }}
              />
            </Form.Item>
          </TabPane>

          <TabPane tab="Other Information" key="2">
            {/* ---------------------- Other --------------------- */}
            <h3 className={style.h3Header}>Other Information</h3>

            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              style={myStyle}
            >
              <MyDatePicker
                width={width}
                dateOfBirth={dateOfBirth}
                setDateOfBirth={(m) => setDateOfBirth(m)}
              />
            </Form.Item>
            
            <Form.Item
              label="Code"
              name="barcode"
              style={myStyle}
            >
              <Input style={{ width: width }} />
            </Form.Item>

            <h3 className={style.h3Header}>Address</h3>

            <Form.Item
              label="Street/Drive"
              name="street"
              style={myStyle}
            >
              <Input style={{ width: width }} />
            </Form.Item>

            <Form.Item
              label="Suburb"
              name="suburb"
              style={myStyle}
            >
              <Input style={{ width: width }} />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              style={myStyle}
            >
              <Input style={{ width: width }} />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              style={myStyle}
            >
              <Input style={{ width: width }} />
            </Form.Item>

            <Form.Item
              label="Note"
              name="note"
              style={myStyle}
            >
              <TextArea 
                style={{ width: width }} 
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
              
            </Form.Item>

          </TabPane>
        </Tabs>

        <hr className={style.hr} />

        <Form.Item style={{ width: '100%', margin: '40px 0 0 70px' }} className={style.item}>
          {activeKey === '1' ? (
            <Button
              type="primary"
              style={{ marginLeft: 106, width: 70 }}
              onClick={() => setActiveKey('2') }
            >
              Next
            </Button>
          ) : (
              <div style={{ marginLeft: 100 }}>
                <Button
                  style={{ width: 70, display: 'inlineBlock' }}
                  onClick={() => setActiveKey('1')}
                >
                  Back
              </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 10, display: 'inlineBlock' }}
                  loading={submittingOfNewUser || loadingEditUser}
                  onClick={() => onCreateMemberClick()}
                >
                  Create
                </Button>
              </div>
            )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
