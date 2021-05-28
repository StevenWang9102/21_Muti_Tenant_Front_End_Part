import React, { useState } from 'react';
import { Form, Modal, message, Button } from 'antd';
import { BranchRoleSelector } from './BranchRoleSelector'

interface CreateFormProps {
  branchesData: any[];
  rolesData: any[];
  modalVisible: boolean;
  onSubmit: (value) => void;
  setSelectedRowsUserId: (value) => void;
  onCancel: () => void;
}

const DeleteForm: React.FC<CreateFormProps> = (props) => {
  const {modalVisible, onCancel, onSubmit, fromPage, branchesData, rolesData, setSelectedRowsUserId } = props;
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [multiSelection, setMultiSelection] = useState(['-']);
  const [selectedRoleNames, setSelectedRoleNames] = useState([]);
  const [renderArray, setRenderArray] = useState([]);
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  const isBranchOrRoleNull = () => {
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

    return isBranchRowNull
  }

  // --------------------------- Assign New Branch Role ---------------------------
  const dismissNewBranchRoles = () => {
    const isBranchRowNull = isBranchOrRoleNull()
    if (isBranchRowNull) {
      const value = {
        selectedBranchIds: selectedBranchIds,
        selectedRoleIds: selectedRoleIds,
      }
      onSubmit(value)
    }
    setSelectedRowsUserId({})
  };

  return (
    <Modal
      destroyOnClose={true}
      visible={modalVisible}
      onCancel={() => { onCancel() }}
      footer={[
        <Button key="back" onClick={(e) => { onCancel() }}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary" danger
          onClick={() => dismissNewBranchRoles()}>
          Dismiss
        </Button>,
      ]}
    >
      <Form {...formLayout} form={form}>
        <BranchRoleSelector
          fromPage={fromPage}
          branchesData={branchesData}
          rolesData={rolesData}
          multiSelection={multiSelection}
          setSelectedBranchIds={(n) => setSelectedBranchIds(n)}
          setSelectedRoleNames={(n) => setSelectedRoleNames(n)}
          setSelectedRoleIds={(n) => setSelectedRoleIds(n)}
          renderArray={renderArray}
          setRenderArray={(n) => setRenderArray(n)}
          selectedBranchIds={selectedBranchIds}
          selectedRoleIds={selectedRoleIds}
          selectedRoleNames={selectedRoleNames}
          setMultiSelection={(n) => setMultiSelection(n)}
        />
      </Form>
    </Modal>
  );
};

export default DeleteForm;
