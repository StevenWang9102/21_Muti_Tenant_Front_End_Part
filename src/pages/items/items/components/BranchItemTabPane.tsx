import React, { useEffect, FC, useState } from 'react';
import sort from 'fast-sort';
import {displayDecimal} from '../../../public-component/decimail'
import { Table, Input, Switch, InputNumber, Popconfirm, Form, Tag, Button} from 'antd';
import UnitDollar from '@/utils/UnitDollar';
import { basicRed } from '../../../public-component/color'

// ------------------------------------- Cell ----------------------------
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {

  const inputNode = inputType === 'number' ? <InputNumber
    min={0}
    precision={2}
    formatter={(value) => displayDecimal(value)}
  /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
          children
        )}
    </td>
  );
};

const EditableTable = ({
  branchItemData,
  allProps,
  swithItemMainActive
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const { dispatch } = allProps
  const activeBranchId = allProps.itemsData.activeBranchId || []

  useEffect(() => {
    
    if (branchItemData) {
      const temp1 = []
      sort(branchItemData).asc(each => each.branchName)

      console.log('useEffect1884,branchItemData48=', branchItemData);
      console.log('useEffect1884,activeBranchId=', activeBranchId);

      branchItemData.forEach((each, index) => {
          temp1.push({
            key: index,
            branch: each.branchName,
            branchId: each.branchId,
            price: each.priceInclGst,
            cost: each.costExclGst,
            margin: each.priceInclGst - each.costExclGst,
            note: each.note,
            status: !each.isInactive,
          })
      });      
      console.log('useEffect1884,temp1=', temp1);
      setData(temp1)
    }
  }, [branchItemData])


  const columns = [
    {
      title: 'Branch',
      dataIndex: 'branch',
      width: '25%',
    },

    {
      title: 'Cost (Excl. GST)',
      dataIndex: 'cost',
      width: '20%',
      editable: true,
      render: (value) => 
      <Tag color="green">
        <UnitDollar decimalPoint=".00">
          {value}
          </UnitDollar>
      </Tag>  
    },

    {
      title: 'Price',
      dataIndex: 'price',
      width: '15%',
      editable: true,
      render: (value) => 
      <Tag color="geekblue">
        <UnitDollar decimalPoint=".00">
          {value}
          </UnitDollar>
      </Tag>  
    },

    {
      title: 'Margin',
      dataIndex: 'margin',
      width: '20%',
      render: (value) => 
        <UnitDollar decimalPoint=".00">{value}</UnitDollar>
    },

    {
      title: 'Active',
      dataIndex: 'status',
      width: '10%',
      render: (_, record) => {
        console.log('record==', record);

        return (
          <Switch
            size='small'
            checked={record.status}
            onClick={() => {
              console.log('BranchStatus,status', !record.status);
              console.log('BranchStatus,record', record);
              if(!record.status){
                // 开启的时候，才有效
                swithItemMainActive(!record.status, record)
              }
              onSwitchClick(record)
            }}
          />
        )
      },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => onSaveButtonClicked(record.key)}
              style={{ marginRight: 8, fontWeight: 700, color: basicRed}}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a
                style={{ marginRight: 8, fontWeight: 500}}
              >Cancel</a>
            </Popconfirm>
          </span>
        ) : (
            <a 
              style={{ fontWeight: 500}}
              disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </a>
          );
      },
    },
  ];

  // 判断当前编辑行
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const onSwitchClick = (record) => {
    console.log('record001=', record);
    const newData = [...data];
    const key = record.key
    const index = newData.findIndex((item) => key === item.key);
    const branchId = newData[index].branchId
    const itemId = allProps.itemsData.currentItemId
    console.log('onSwitchClick, branchId=', branchId);
    console.log('onSwitchClick, itemId=', itemId);

    dispatch({
      type: 'itemsData/switchItemStatus',
      payload: {
        branchId: branchId,
        itemId: itemId,
        jsonpatchOperation: [
          {
            "op": "replace",
            "path": "/isInactive",
            "value": record.status
          },
        ]
      },
    });
  }

  const onSaveButtonClicked = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        console.log('very newData=', newData);


        const branchId = newData[index].branchId
        const itemId = allProps.itemsData.currentItemId
        const price = newData[index].price
        const cost = newData[index].cost


        dispatch({
          type: 'itemsData/switchItemStatus',
          payload: {
            branchId: branchId,
            itemId: itemId,
            jsonpatchOperation: [
              {
                "op": "replace",
                "path": "/priceInclGst",
                "value": price
              },
              {
                "op": "replace",
                "path": "/costExclGst",
                "value": cost
              }
            ]
          },
        });


        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };


  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'number',
        // inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // ----------------------- 正文 --------------------------
  return (
    <Form form={form} component={false} style={{width: 1800}}>
      <Table
        components={{ body: { cell: EditableCell } }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{ onChange: cancel }}
      />
    </Form>
  );
};

// ----------------------------------- 主体 -----------------------------------
export const BranchItemTabPane = ({
  branchItemData,
  swithItemMainActive,
  allProps
}) => {

  console.log('branchItemData17',branchItemData);
  

  return (
    <EditableTable
      allProps={allProps}
      branchItemData={branchItemData}
      swithItemMainActive={swithItemMainActive}
    />
  )
}
