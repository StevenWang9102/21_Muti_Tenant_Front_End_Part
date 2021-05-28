import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, TreeSelect, Modal } from 'antd';
import { CategoriesTreeItem } from '../data.d';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { FormValueType } from './CategoryEditor';
import { TreeNodeType } from './TreeSearch';

import React from 'react';

const FormItem = Form.Item;
const { Option } = Select;

interface MoveFormProps extends FormComponentProps {
  gData: TreeNodeType[];
  moveModalVisible: boolean;
  selectedTreeNode: Partial<CategoriesTreeItem>;
  handleUpdate: (values: FormValueType) => void;
  handleMoveModalVisible: () => void;
}
const MoveForm: React.FC<MoveFormProps> = props => {
  const { gData, moveModalVisible, selectedTreeNode, form, handleUpdate, handleMoveModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  let currentValue = "";
  const onChange = value => {
    console.log(value);
    currentValue = value;
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 }
    }
  };

  return (
    <Modal
      destroyOnClose
      title="Move Category"
      visible={moveModalVisible}
      width={700}
      onOk={okHandle}
      onCancel={() => handleMoveModalVisible()}
    >
      <Form {...formItemLayout}>
        <FormItem label="Old Category Parent">
          {form.getFieldDecorator("oldParentCategoryId", {
            rules: [
              {
                required: true,
                message: "Please select category parent!",
              }
            ], 
            initialValue: selectedTreeNode.parentCategory?.id,
          })(
            <Select disabled={true}>
              <Option value={selectedTreeNode.parentCategory?.id}>{selectedTreeNode.parentCategory?.name}</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="New Category Parent">
          {form.getFieldDecorator("parentCategoryId", {
            rules: [
              {
                required: true,
                message: "Please select a new category parent!",
              }
            ], 
          })(
            <TreeSelect
            style={{ width: '100%' }}
            value={currentValue}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={gData}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={onChange}
          />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create<MoveFormProps>()(MoveForm);
