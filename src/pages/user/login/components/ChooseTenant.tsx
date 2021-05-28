import React, { useState, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import sort from 'fast-sort';
import { IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';

const { Option } = Select;
const FormItem = Form.Item;

interface ChooseTenantProps {
  onChooseTenant: (choosedTenantId: any) => void;
  chooseTenantModalVisible: boolean;
  onCancel: () => void;
  tenantList: [any];
}

const ChooseTenant: React.FC<ChooseTenantProps> = (props) => {
  const { onChooseTenant, chooseTenantModalVisible, onCancel, tenantList } = props;
  const [form] = Form.useForm();
  const [choosedTenantId, setChoosedTenantId] = useState('');

  console.log('tenantList', tenantList);

  useEffect(() => {
    console.log(tenantList);
    if (tenantList.length === 1) {
      onChooseTenant(tenantList[0].id);
    }
  }, []);

  const renderContent = () => {
    sort(tenantList).asc(user => user.name)

    // @ 如果是管理员，直接onChange第一个
    // if(IsSuperAdmin()){
    //   onChooseTenant(tenantList[0] && tenantList[0].id)
    //   console.log('tenantList',tenantList);
    // }

    return (
      <FormItem
        name="tenantId"
        label="Choose a company"
        rules={[{ required: true, message: 'Please choose a company.' }]}
      >
        <Select 
          onChange={onChange} 
          placeholder='Please select...'>
          
          {tenantList.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </FormItem>
    );
  };

  const onChange = (value: string) => {
    setChoosedTenantId(value);
  };

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 13 },
  };

  return (
    <>
      {tenantList.length !== 1 && (
        <Modal
          destroyOnClose
          title="Choose a company"
          visible={chooseTenantModalVisible}
          onOk={() => onChooseTenant(choosedTenantId)}
          onCancel={() => onCancel()}
        >
          <Form {...formLayout} form={form} style={{paddingTop: 10}}>
            {renderContent()}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChooseTenant;
