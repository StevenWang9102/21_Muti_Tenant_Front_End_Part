import React, { useEffect, useState, FC } from 'react';
import { Modal, Form, Input, Select, Button, message, DatePicker } from 'antd';
import 'antd/dist/antd.css';
import { Dispatch } from 'umi';
import { Tabs } from 'antd';
import { CloseSquareTwoTone } from '@ant-design/icons';
import style from '../style.less';
import { formatMessage } from 'umi';
import styles from '../style.less';
import jsonpatch from 'fast-json-patch';
import { Radio } from 'antd';
import { MyDatePicker } from './DatePicker';
import moment from 'moment';

const { TextArea } = Input;
const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};


export const EditUserDetails: FC<any> = ({
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
  const [radioValue, setRadioValue] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState(moment(new Date()));

  useEffect(() => {
    if (visible) {
      console.log('useEffect,oneMemberInfo', oneMemberInfo);
      console.log('useEffect,oneMemberInfo.dateOfBirth', oneMemberInfo.dateOfBirth);
      console.log('useEffect,oneMemberInfo.dateOfBirth1', moment(oneMemberInfo.dateOfBirth));

      setActiveKey('1')
      form.setFieldsValue(oneMemberInfo)
      const myMomemnt = moment(oneMemberInfo.dateOfBirth)
      setDateOfBirth(myMomemnt)
    }
  }, [visible, oneMemberInfo]);


  // --------------------------- 编辑用户 ---------------------------
  const onUpdateMemberClick = () => {
    const values = form.getFieldsValue()
    let myGender;

    console.log('onUpdateMemberClick,oneMemberInfo', oneMemberInfo);
    console.log('onUpdateMemberClick,values', values);


    if (values.gender == 'Male') myGender = 1
    else if (values.gender == 'Female') myGender = 2
    else myGender = 0

    let document = oneMemberInfo;
    let observer = jsonpatch.observe<Object>(document);

    document.barcode = values.barcode;
    document.city = values.city;
    document.country = values.country;
    document.dateOfBirth = dateOfBirth.format('YYYY-MM-DD');
    document.email = values.email;
    document.firstName = values.firstName;
    document.gender = myGender;
    document.lastName = values.lastName;
    document.middleName = values.middleName;
    document.moniker = values.moniker;
    document.note = values.note;
    document.phone = values.phone;
    document.street = values.street;
    document.suburb = values.suburb;


    const updateEnum = jsonpatch.generate(observer);
    console.log("onUpdateMemberClick=", updateEnum);

    if (updateEnum.length !== 0) {
      dispatch({
        type: 'menberManagement/updateMember',
        payload: {
          id: oneMemberInfo.id,
          body: updateEnum,
        },
        callback: (res) => {
          requestAllMembers()
          onCancelButtonClick()
        }
      });
    }
  };

  const onRadioButtonChange = event => {
    console.log('onRadioButtonChange checked', event.target.value);
    setRadioValue(event.target.value);
  };

  // --------------------------- 检查Number ---------------------------
  // const checkIsNumber = (inputValue, name) => {
  //   const isNull = inputValue === '';

  //   dispatch({
  //     type: 'userManagementPro/checkPhoneNumberFunction',
  //     payload: {
  //       name: name,
  //       isNull: isNull,
  //       value: !isNaN(inputValue),
  //     },
  //   });
  // };

  const width = '95%'
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
              <Input style={{ width: width }} />
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
              <Radio.Group
                onChange={onRadioButtonChange}
                value={radioValue}
                style={{ width: width }}
              >
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
              <Input
                disabled={true}
                style={{ width: width }}
              />
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
              onClick={() => setActiveKey('2')}
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
                  onClick={() => onUpdateMemberClick()}
                >
                  Update
                </Button>
              </div>
            )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
