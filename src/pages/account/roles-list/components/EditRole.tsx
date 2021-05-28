import React, { useEffect, useState, FC } from 'react'
import { Modal, Form, Input, message, Button } from 'antd';
import 'antd/dist/antd.css';
import { AddUserlInterface } from '../data';
import { IsContentChangedOrNot } from '../IsContentChange'
import { CloseSquareTwoTone } from '@ant-design/icons';


const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

export const EditRole: FC<AddUserlInterface> = (props) => {

  const { dispatch, submittingOfNewUser, currentRoleInfo, currentPage } = props;
  const initialName = currentRoleInfo && currentRoleInfo.name
  const [currentInputRoleName, setCurrentInputRoleName] = useState<string>()
  const [form] = Form.useForm()

  const sourceData = {
    name: currentPage === "AddRole" ? "" : currentRoleInfo && currentRoleInfo.name
  }

  useEffect(() => {
    form.setFieldsValue(sourceData)
  }, [props.visible]);


  const onSubmitButtonClick = () => {

    if (currentPage === "AddRole") {
      if (currentInputRoleName === "" || currentInputRoleName === undefined) {
        message.error('Name can not be blank')
      } else {
        dispatch({
          type: `roleManagementPro/createNewRole`,
          payload:
          {
            "Name": currentInputRoleName,
          }
        });
      }
    } else {
      if (currentInputRoleName == "") message.error('Name can not be blank')
      else if (IsContentChangedOrNot(initialName, currentInputRoleName)) {

        dispatch({
          type: `roleManagementPro/updateRoleName`,
          payload:
          {
            "id": currentRoleInfo && currentRoleInfo.id,
            "name": currentInputRoleName,
          }
        });
      }
      else message.error('You did not make any change')
    }
  }


  return (
    <div>
      <Modal
        width={500}
        maskClosable={false}
        closeIcon={<CloseSquareTwoTone />}
        title={currentPage === "AddRole" ? "Create New Role" : "Edit Roles"}
        visible={props.visible}
        footer={[

          <Button
            key="back"
            type="default"
            onClick={() => { props.onCancelButtonClick() }}
          >
            Cancel
          </Button>,

          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            loading={submittingOfNewUser}
            onClick={() => onSubmitButtonClick()}
          >
            {currentPage === "AddRole" ? "Create" : "Update"}
          </Button>,
        ]}
        confirmLoading={submittingOfNewUser}
        onCancel={() => {
          props.onCancelButtonClick()
        }}
      >

        <Form {...layout} name="basic" form={form} >
          <Form.Item
            label="Role Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input role name!',
              },
            ]}
          >
            <Input onChange={(e) => { setCurrentInputRoleName(e.target.value) }} />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  )
}

