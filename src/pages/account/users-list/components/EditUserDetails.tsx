import React, { useEffect, useState, FC } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import 'antd/dist/antd.css';
import { Dispatch } from 'umi';
import { Tabs } from 'antd';
import { CloseSquareTwoTone } from '@ant-design/icons';
import style from '../style.less';
import { formatMessage } from 'umi';
import { MyDatePicker } from './DatePicker';
import { SelectRolesOfEdit } from './SelectRolesOfEdit';
import { SelectRolesOfCreate } from './SelectRolesOfCreate';
import styles from '../style.less';
import { IsSuperAdmin } from '@/utils/authority';

const { Option } = Select;
const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface EditUserDetailslInterface {
  dispatch: Dispatch,
  allBranchInformation: any,
  warningMessage: any,
  allRoles: any,
  currentUserId: string,
  submittingOfNewUser: boolean,
  loadingEditUser: boolean,
  loadingOneUser: boolean,
  fromPage: string,
  visible: boolean,
  oneUserInformation: any,
  oneUserBranchRoles: any,
}

export const EditUserDetails: FC<EditUserDetailslInterface> = (props) => {
  const {
    dispatch,
    superAdmin,
    setSearchValue,
    allBranchInformation,
    allRoles,
    currentUserId,
    currentBranchId,
    submittingOfNewUser,
    loadingEditUser,
    loadingOneUser,
    fromPage,
    oneUserInformation,
    oneUserBranchRoles,
  } = props;

  const [form] = Form.useForm();
  const warningMessageLocal: any = props.warningMessage || {};
  const empty = {
    firstName: '',
    middleName: '',
    lastName: '',
    moniker: '',
    code: '',
    active: false,
    email: '',
    phone: '',

    irdNumber: '',
    birthDay: '',
    country: '',
    city: '',
    suburb: '',
    street: '',
  };

  const sourceData = {
    firstName: (oneUserInformation && oneUserInformation.firstName) || '',
    middleName: (oneUserInformation && oneUserInformation.middleName) || '',
    lastName: (oneUserInformation && oneUserInformation.lastName) || '',
    moniker: (oneUserInformation && oneUserInformation.moniker) || '',
    code: (oneUserInformation && oneUserInformation.code) || '',
    active: oneUserInformation && oneUserInformation.isInactive,
    email: (oneUserInformation && oneUserInformation.email) || '',
    phone: (oneUserInformation && oneUserInformation.phoneNumber) || '',

    irdNumber: (oneUserInformation && oneUserInformation.ird) || '',
    birthDay: (oneUserInformation && oneUserInformation.dob) || '',
    country: (oneUserInformation && oneUserInformation.country) || '',
    city: (oneUserInformation && oneUserInformation.city) || '',
    suburb: (oneUserInformation && oneUserInformation.suburb) || '',
    street: (oneUserInformation && oneUserInformation.street) || '',
  };
  // setSelectedBranchIds
  const [currentBranchTitles, setCurrentBranchTitles] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [multiSelection, setMultiSelection] = useState(['-']);
  const [selectedRoleNames, setSelectedRoleNames] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(undefined);
  const [activeKey, setActiveKey] = useState('1');
  const [renderArray, setRenderArray] = useState([]);
  const [selectValues, setSelectValues] = useState([])
  const [currentSelectedBranchIds, setCurrentSelectedBranchIds] = useState([]);
  const [currentSelectedRoleNames, setCurrentSelectedRoles] = useState(undefined);
  const [newSelectedRoleNames, setNewSelectedRoleNames] = useState([]);

  console.log('Edit418419,superAdmin', superAdmin);
  console.log('Edit418419,currentUserId', currentUserId);

  const isSuperAdmin =(superAdmin.id == currentUserId)
  
  // 初始化：清空原有的数据
  useEffect(() => {
    // alert('复位动作')
    setCurrentSelectedBranchIds([]);
    setCurrentSelectedRoles([]);
    setNewSelectedRoleNames([])
  }, [props.visible]);
  
  useEffect(() => {
    form.setFieldsValue(empty);

    // 重置数据
    setDateOfBirth(undefined);
    setActiveKey('1');

    setCurrentBranchTitles([]);
    setSelectedBranchIds([]);

    setSelectedRoleIds([])
    setSelectedRoleNames([]);

    setMultiSelection(['-']);

    // 发送请求
    if (fromPage === 'Create') {
      form.resetFields();
    } else {
      props.visible &&
        dispatch({
          type: `userManagementPro/getSingleUserInformation`,
          payload: currentUserId,
        });
    }

    dispatch({
      type: `userManagementPro/warningMessage`,
      payload: null,
    });

    // setSelectValues([])
  }, [props.visible]);

  useEffect(() => {
    let defaultDate;
    if (oneUserInformation.dob && oneUserInformation.dob.slice(0, 10) !== '0001-01-01') {
      defaultDate = oneUserInformation.dob.slice(0, 10);
    } else defaultDate = undefined;
    oneUserInformation.dob && setDateOfBirth(defaultDate);
    form.setFieldsValue(sourceData);
  }, [oneUserInformation]);


  const inputEmptyValidation = (type) => {
    dispatch({
      type: 'userManagementPro/validationOfSubmit',
      payload: {
        type: type
      },
    });
  }
  // --------------------------- 新建用户 ---------------------------
  const createNewUserSubmit = () => {
    const currentValues = form.getFieldsValue();
    console.log(currentValues);
    console.log(currentValues);
    console.log(currentValues);
    console.log(currentValues);


    // 任意required input不能是空
    var isEssentialValueNull =
      currentValues.firstName === '' ||
      currentValues.lastName === '' ||
      currentValues.email === '' ||
      currentValues.firstName === undefined ||
      currentValues.lastName === undefined ||
      currentValues.email === undefined;

    // 检查发布的Branch Role数据是否存在空的情况
    var rowFlags = [];
    var isBranchRowNull = true;
    multiSelection.forEach((item, index) => {
      const flagOfNames = selectedBranchIds[index] !== null;
      const flagOfRoles = selectedRoleNames[index] && selectedRoleNames[index].length !== 0;
      if (flagOfNames && flagOfRoles) rowFlags.push(true);
      else rowFlags.push(false);
    });
    rowFlags.forEach((row, index) => { if (row === false) { isBranchRowNull = false; } });

    if (!isBranchRowNull) { message.error('Branch and roles can not be blank!'); }

    // 执行Request
    if (isBranchRowNull && !isEssentialValueNull) {
      var postData = [];
      selectedBranchIds &&
        selectedBranchIds.forEach((selectedBranchId, index) => {
          selectedRoleIds[index] &&
            selectedRoleIds[index].forEach((selectedRoleId, index) => {
              postData.push({
                BranchId: selectedBranchId,
                RoleId: selectedRoleId,
              });
            });
        });

      if (selectedBranchIds === [] || selectedRoleNames === []) {
        message.error('Branch and roles can not be blank!');
      } else {
        dispatch({
          type: `userManagementPro/createNewUser`,
          payload: {
            email: currentValues.email,
            code: currentValues.code,
            firstName: currentValues.firstName,
            middleName: currentValues.middleName,
            lastName: currentValues.lastName,
            moniker: currentValues.moniker,

            dob: dateOfBirth,
            ird: currentValues.irdNumber,

            phoneNumber: currentValues.phone,
            street: currentValues.street,
            suburb: currentValues.suburb,
            city: currentValues.city,
            country: currentValues.country,
            BranchRoleIds: postData,
          },
        });
      }
    }

    if (isEssentialValueNull) {
      if (fromPage === 'Create') {
        if (currentValues.firstName === undefined) inputEmptyValidation("firstName")
        if (currentValues.lastName === undefined) inputEmptyValidation("lastName")
        if (currentValues.email === undefined) inputEmptyValidation("email")
        setActiveKey('1');
      }
    }
  };



  // --------------------------- 编辑用户 ---------------------------
  const onEditUserClicked = () => {
    const currentValues = form.getFieldsValue();
    const postData = [];
    let isBranchRoleBlank = true;
    for (let i = 0; i < selectedBranchIds.length; i++) {
      if (selectedBranchIds[i] == 'null' || selectedRoleIds[i].length === 0) isBranchRoleBlank = false;
      for (let j = 0; j < selectedRoleIds[i].length; j++) {
        postData.push({
          branchId: selectedBranchIds[i],
          roleId: selectedRoleIds[i][j],
        });
      }
    }

    // 任意必要input不能是空
    var isEssentialValueNull =
      currentValues.firstName === '' ||
      currentValues.lastName === '' ||
      currentValues.firstName === undefined ||
      currentValues.lastName === undefined;


    if (isEssentialValueNull) {
      if (currentValues.firstName === undefined) inputEmptyValidation("firstName")
      if (currentValues.lastName === undefined) inputEmptyValidation("lastName")
      if (currentValues.email === undefined) inputEmptyValidation("email")
      setActiveKey('1');
    }

    if (!isBranchRoleBlank) {
      setActiveKey('1');
      message.error('Branch or Role can not be blank !');
    }

    if (!isEssentialValueNull && isBranchRoleBlank) {
      dispatch({
        type: 'userManagementPro/editUserInformation',
        payload: {
          currentBranchId: currentBranchId,
          id: currentUserId,
          firstName: currentValues!.firstName,
          middleName: currentValues.middleName,
          lastName: currentValues.lastName,
          moniker: currentValues.moniker,
          code: currentValues.code === '' ? undefined : currentValues.code,
          phone: currentValues.phone === '' ? undefined : currentValues.phone,

          dob: dateOfBirth || '0001-01-01', // 如果是空，则还给服务器上的默认值，以满足格式要求,
          ird: currentValues.irdNumber,

          country: currentValues.country,
          city: currentValues.city,
          suburb: currentValues.suburb,
          street: currentValues.street,

          branchRoles: postData,
        },
      });
    }

    setSearchValue('')
  };

  // --------------------------- 检查用户 ---------------------------
  const checkNameFunction = (type, fromOnchange) => {
    const currentValues = form.getFieldsValue();
    const isFirstNameNull = currentValues.firstName === undefined || currentValues.firstName === '';
    const isLastNameNull = currentValues.lastName === undefined || currentValues.lastName === '';

    if (fromOnchange === 'firstName' && isFirstNameNull) {
      // 是空的时候，提示必须输入value
      dispatch({
        type: 'userManagementPro/warningBlankOfFirstName',
        payload: {
          status: 'error',
        },
      });
    }

    if (fromOnchange === 'firstName' && !isFirstNameNull) {
      dispatch({
        type: 'userManagementPro/warningBlankOfFirstName',
        payload: {
          status: 'success',
        },
      });
    }

    if (fromOnchange === 'lastName' && isLastNameNull) {
      // 是空的时候，提示必须输入value
      dispatch({
        type: 'userManagementPro/warningBlankOfLastName',
        payload: {
          status: 'error',
        },
      });
    }

    if (fromOnchange === 'lastName' && !isLastNameNull) {
      dispatch({
        type: 'userManagementPro/warningBlankOfLastName',
        payload: {
          status: 'success',
        },
      });
    }

    if (
      currentValues.firstName !== undefined &&
      currentValues.lastName !== undefined &&
      currentValues.firstName !== '' &&
      currentValues.lastName !== ''
    ) {
      let payload = {
        type: type,
        value: {
          firstName: currentValues.firstName || '',
          middleName: currentValues.middleName || '',
          lastName: currentValues.lastName || '',
        },
        url: 'CheckFullName',
      };
      dispatch({
        type: 'userManagementPro/checkNameFunction',
        payload: payload,
      });
    }

    if (
      currentValues.firstName !== undefined ||
      currentValues.lastName !== undefined ||
      currentValues.firstName !== '' ||
      currentValues.lastName !== ''
    ) {
      dispatch({
        type: 'userManagementPro/warningBlank',
        payload: {
          type: 'name',
        },
      });
    }
  };

  // --------------------------- 检查用户（编辑状态） ---------------------------
  const checkNameFunctionOfEdit = (type, fromOnchange) => {
    const currentValues = form.getFieldsValue();
    const isFirstNameNull = currentValues.firstName === undefined || currentValues.firstName === '';
    const isLastNameNull = currentValues.lastName === undefined || currentValues.lastName === '';

    if (fromOnchange === 'firstName' && isFirstNameNull) {
      // 是空的时候，提示必须输入value
      dispatch({
        type: 'userManagementPro/warningBlankOfFirstName',
        payload: {
          status: 'error',
        },
      });
    }

    if (fromOnchange === 'firstName' && !isFirstNameNull) {
      // 不是空的时候，去掉pass的成功符号
      dispatch({
        type: 'userManagementPro/warningBlankOfFirstName',
        payload: {
          status: 'success',
        },
      });
    }

    if (fromOnchange === 'lastName' && isLastNameNull) {
      // 是空的时候，提示必须输入value
      dispatch({
        type: 'userManagementPro/warningBlankOfLastName',
        payload: {
          status: 'error',
        },
      });
    }

    if (fromOnchange === 'lastName' && !isLastNameNull) {
      dispatch({
        type: 'userManagementPro/warningBlankOfLastName',
        payload: {
          status: 'success',
        },
      });
    }

    if (currentValues.firstName !== '' && currentValues.lastName !== '') {
      let payload = {
        type: type,
        id: currentUserId,
        value: {
          firstName: currentValues.firstName || '',
          middleName: currentValues.middleName === null ? '' : currentValues.middleName,
          lastName: currentValues.lastName || '',
        },
        url: 'CheckFullName',
      };

      dispatch({
        type: 'userManagementPro/checkNameFunction',
        payload: payload,
      });
    }
  };

  // --------------------------- 检查邮箱 ---------------------------
  const checkNameFunctionOfEmail = (type, value, isNull) => {
    const currentValues = form.getFieldsValue();

    if (currentValues.email === undefined) {
      // 是空的时候，提示必须输入value
      dispatch({
        type: 'userManagementPro/warningBlankOfEmail',
        payload: {
          type: 'email',
        },
      });
    } else {
      let payload = {
        type: type,
        isNull: isNull,
        currentValue: value,
        value: {
          Email: currentValues.email || null,
        },
        url: 'CheckEmail',
      };

      dispatch({
        type: 'userManagementPro/checkEmailFunction',
        payload: payload,
      });
    }
  };

  // --------------------------- 检查Code ---------------------------
  const checkNameFunctionOfCode = (type, value, isNull) => {
    const currentValues = form.getFieldsValue();
    if (currentValues.code !== undefined) {
      let payload = {
        type: type,
        fromPage: fromPage,
        id: currentUserId,
        isNull: isNull,
        currentValue: value,
        value: {
          Code: currentValues.code || null,
        },
        url: 'CheckCode',
      };

      dispatch({
        type: 'userManagementPro/checkCodeFunction',
        payload: payload,
      });
    }
  };

  const optionChildren = [];
  for (let i = 0; i < (allRoles && allRoles.length); i++) {
    optionChildren.push(<Option key={i}>
      {allRoles[i].name === 'TenantAdmin'? 'Admin': allRoles[i].name}
      </Option>);
  }

  // --------------------------- 检查Number ---------------------------
  const checkIsNumber = (inputValue, name) => {
    const isNull = inputValue === '';

    dispatch({
      type: 'userManagementPro/checkPhoneNumberFunction',
      payload: {
        name: name,
        isNull: isNull,
        value: !isNaN(inputValue),
      },
    });
  };

  const valueOfMiddleName = form.getFieldsValue().middleName;

  return (
    <Modal
      visible={props.visible}
      destroyOnClose={false}
      footer={null}
      width={600}
      bodyStyle={{ padding: 40 }}
      confirmLoading={submittingOfNewUser || loadingOneUser}
      maskClosable={false}
      // closeIcon={<CloseSquareTwoTone />}
      onCancel={() => {
        props.onCancelButtonClick();
      }}
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
              {formatMessage({ id: 'user.management.newusername' })}
            </h3>

            <Form.Item
              label="First Name"
              name="firstName"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.firstName && warningMessageLocal.firstName.status) || 'Null'
              }
              help={warningMessageLocal.firstName && warningMessageLocal.firstName.message}
              rules={[{ required: true, message: 'Please input your fistname!' }]}
            >
              <Input
                style={{ width: 215 }}
                onBlur={(event) => {
                  if (fromPage === 'Create') checkNameFunction('name', 'firstName');
                  else checkNameFunctionOfEdit('name', 'firstName');
                }}
                onChange={(event) => {
                  if (fromPage === 'Create') checkNameFunction('name', 'firstName');
                  else checkNameFunctionOfEdit('name', 'firstName');
                }}
              />
            </Form.Item>

            <Form.Item
              label="Middle Name"
              name="middleName"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                valueOfMiddleName !== '' &&
                valueOfMiddleName !== undefined &&
                ((warningMessageLocal.middleName && warningMessageLocal.middleName.status) ||
                  'Null')
              }
              help={
                valueOfMiddleName !== '' &&
                valueOfMiddleName !== undefined &&
                warningMessageLocal.middleName &&
                warningMessageLocal.middleName.message
              }
            >
              <Input
                style={{ width: 215 }}
                onBlur={() => {
                  if (fromPage === 'Create') {
                    checkNameFunction('name', 'middleName');
                  } else {
                    checkNameFunctionOfEdit('name', 'middleName');
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.lastName && warningMessageLocal.lastName.status) || 'Null'
              }
              help={warningMessageLocal.lastName && warningMessageLocal.lastName.message}
              className={style.inputButtom}
              rules={[
                {
                  required: true,
                  message: 'Please input your lastname!',
                },
              ]}
            >
              <Input
                style={{ width: 215 }}
                onBlur={(event) => {
                  if (fromPage === 'Create') checkNameFunction('name', 'lastName');
                  else checkNameFunctionOfEdit('name', 'lastName');
                }}
                onChange={(event) => {
                  if (fromPage === 'Create') checkNameFunction('name', 'lastName');
                  else checkNameFunctionOfEdit('name', 'lastName');
                }}
              />
            </Form.Item>

            <Form.Item
              label="Moniker"
              name="moniker"
              style={{ width: 320, marginLeft: 70 }}
              className={style.moniker}
            >
              <Input style={{ width: 215 }} />
            </Form.Item>

            <h3 className={style.h3Header}>{formatMessage({ id: 'user.management.contact' })}</h3>

            <Form.Item
              label="Email"
              name="email"
              style={{ width: 320, marginLeft: 70 }}
              validateStatus={
                (warningMessageLocal.email && warningMessageLocal.email.status) || 'Null'
              }
              help={warningMessageLocal.email && warningMessageLocal.email.message}
              rules={[
                {
                  required: true,
                  message: 'Please input an email!',
                },
              ]}
            >
              <Input
                disabled={fromPage === 'Edit'}
                style={{ width: 215 }}
                onBlur={(event) => {
                  const isNull = event.target.value === '';
                  checkNameFunctionOfEmail('email', event.target.value, isNull);
                }}
                onChange={(event) => {
                  const isNull = event.target.value === '';
                  checkNameFunctionOfEmail('email', event.target.value, isNull);
                }}
              />
              {/* <span>(Please make sure this is a working email, thus this user can receive password.)</span> */}
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.phone && warningMessageLocal.phone.status) || 'Null'
              }
              help={warningMessageLocal.phone && warningMessageLocal.phone.message}
            >
              <Input
                style={{ width: 215 }}
                onChange={(event) => {
                  checkIsNumber(event.target.value, 'phone');
                }}
                onBlur={(event) => {
                  checkIsNumber(event.target.value, 'phone');
                }}
              />
            </Form.Item>

            {/* ------------------------- Select Options ------------------------- */}

            {fromPage === 'Create' ? (
              <SelectRolesOfCreate
                fromPage={fromPage}
                visible={props.visible}
                multiSelection={multiSelection}
                currentBranchTitles={currentBranchTitles}
                allBranchInformation={allBranchInformation}
                oneUserInformation={oneUserInformation}
                oneUserBranchRoles={oneUserBranchRoles}
                setCurrentBranchTitles={(n) => setCurrentBranchTitles(n)}
                setSelectedBranchIds={(n) => setSelectedBranchIds(n)}
                setSelectedRoleNames={(n) => setSelectedRoleNames(n)}
                setSelectedRoleIds={(n) => setSelectedRoleIds(n)}
                renderArray={renderArray}
                setRenderArray={(n) => setRenderArray(n)}
                selectedBranchIds={selectedBranchIds}
                selectedRoleIds={selectedRoleIds}
                selectValues={selectValues}
                setSelectValues={setSelectValues}
                selectedRoleNames={selectedRoleNames}
                allRoles={allRoles}
                optionChildren={optionChildren}
                setMultiSelection={(n) => setMultiSelection(n)}
              />
            ) : (
                <SelectRolesOfEdit
                  fromPage={fromPage}
                  isSuperAdmin = {isSuperAdmin}
                  visible={props.visible}
                  multiSelection={multiSelection}
                  currentBranchTitles={currentBranchTitles}
                  allBranchInformation={allBranchInformation}
                  oneUserInformation={oneUserInformation}
                  oneUserBranchRoles={oneUserBranchRoles}
                  setCurrentBranchTitles={(n) => setCurrentBranchTitles(n)}
                  setSelectedBranchIds={(n) => setSelectedBranchIds(n)}
                  setSelectedRoleNames={(n) => setSelectedRoleNames(n)}
                  setSelectedRoleIds={(n) => setSelectedRoleIds(n)}
                  renderArray={renderArray}
                  setRenderArray={(n) => setRenderArray(n)}
                  selectedBranchIds={selectedBranchIds}
                  selectedRoleIds={selectedRoleIds}
                  selectedRoleNames={selectedRoleNames}
                  allRoles={allRoles}
                  optionChildren={optionChildren}
                  setMultiSelection={(n) => setMultiSelection(n)}
                  currentSelectedBranchIds={currentSelectedBranchIds}
                  setCurrentSelectedBranchIds={setCurrentSelectedBranchIds}
                  currentSelectedRoleNames={currentSelectedRoleNames}
                  setCurrentSelectedRoles={setCurrentSelectedRoles}
                  newSelectedRoleNames={newSelectedRoleNames}
                  setNewSelectedRoleNames={setNewSelectedRoleNames}
                />
              )}
          </TabPane>

          <TabPane tab="Other Information" key="2">
            {/* ---------------------- Other --------------------- */}
            <h3 className={style.h3Header}>Other Information</h3>
            <Form.Item
              label="IRD Number"
              name="irdNumber"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.irdNumber && warningMessageLocal.irdNumber.status) || 'Null'
              }
              help={warningMessageLocal.irdNumber && warningMessageLocal.irdNumber.message}
            >
              <Input
                style={{ width: 215 }}
                onChange={(event) => {
                  checkIsNumber(event.target.value, 'irdNumber');
                }}
                onBlur={(event) => {
                  checkIsNumber(event.target.value, 'irdNumber');
                }}
              />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="birthDay"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.birthDay && warningMessageLocal.birthDay.status) || 'Null'
              }
              help={warningMessageLocal.birthDay && warningMessageLocal.birthDay.message}
            >
              <MyDatePicker
                dateOfBirth={dateOfBirth}
                oneUserInformation={oneUserInformation}
                setDateOfBirth={(m) => { setDateOfBirth(m); }}
              />
            </Form.Item>

            <Form.Item
              label="Code"
              name="code"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.code && warningMessageLocal.code.status) || 'Null'
              }
              help={warningMessageLocal.code && warningMessageLocal.code.message}
            >
              <Input
                style={{ width: 215 }}
                onBlur={(event) => {
                  const isNull = event.target.value === '';
                  checkNameFunctionOfCode('code', event.target.value, isNull);
                }}
                onChange={(event) => {
                  const isNull = event.target.value === '';
                  checkNameFunctionOfCode('code', event.target.value, isNull);
                }}
              />
            </Form.Item>

            <h3 className={style.h3Header}>Address</h3>

            <Form.Item
              label="Street/Drive"
              name="street"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.street && warningMessageLocal.street.status) || 'Null'
              }
              help={warningMessageLocal.street && warningMessageLocal.street.message}
            >
              <Input style={{ width: 215 }} />
            </Form.Item>

            <Form.Item
              label="Suburb"
              name="suburb"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.suburb && warningMessageLocal.suburb.status) || 'Null'
              }
              help={warningMessageLocal.suburb && warningMessageLocal.suburb.message}
            >
              <Input style={{ width: 215 }} />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.city && warningMessageLocal.city.status) || 'Null'
              }
              help={warningMessageLocal.city && warningMessageLocal.city.message}
            >
              <Input style={{ width: 215 }} />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              style={{ width: 320, marginLeft: 70 }}
              // hasFeedback
              validateStatus={
                (warningMessageLocal.country && warningMessageLocal.country.status) || 'Null'
              }
              help={warningMessageLocal.country && warningMessageLocal.country.message}
            >
              <Input style={{ width: 215 }} />
            </Form.Item>
          </TabPane>
        </Tabs>

        <hr className={style.hr} />

        <Form.Item style={{ width: '100%', margin: '40px 0 0 70px' }} className={style.item}>
          {activeKey === '1' ? (
            <Button
              type="primary"
              style={{ marginLeft: 106, width: 70 }}
              onClick={() => {
                setActiveKey('2');
              }}
            >
              Next
            </Button>
          ) : (
              <div style={{ marginLeft: 100 }}>
                <Button
                  style={{ width: 70, display: 'inlineBlock' }}
                  onClick={() => {
                    setActiveKey('1');
                  }}
                >
                  Back
              </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 10, display: 'inlineBlock' }}
                  loading={submittingOfNewUser || loadingEditUser}
                  onClick={() => {
                    if (fromPage === 'Create') createNewUserSubmit();
                    if (fromPage === 'Edit') onEditUserClicked();
                  }}
                >
                  {fromPage === 'Edit' ? 'Update' : 'Submit'}
                </Button>
              </div>
            )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
