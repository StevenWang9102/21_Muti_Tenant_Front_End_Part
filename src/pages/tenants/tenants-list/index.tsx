import { Tag, notification} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType, IntlProvider, zhCNIntl, zhTWIntl, enUSIntl } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { getLocale } from 'umi';
import { TenantApplication } from './data.d';
import { fetchTenantsList } from './service';
import { IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';

const selectedLang = getLocale();
const intlMap = {
  'zh-CN': zhCNIntl,
  'zh-TW': zhTWIntl,
  'en-US': enUSIntl,
};

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();

  useEffect(()=>{
    if(!IsSuperAdmin()){
      notification.open({
        message: 'Unauthorized Page',
        description:
          'You are on an Unauthorized Page. Developers are still working on authorization management.',
        className: 'custom-class',
        style: {
          width: 600,
        },
      });
    }
  }, [])

  const columns: ProColumns<TenantApplication>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '45%',
      sorter: true,
    },

    {
      title: 'Name',
      dataIndex: 'name',
      width: '18%',
      sorter: true,
      render: (name: any) => (
        <Tag color={name.length % 2 == 1 ? 'blue' : 'green'}> {name} </Tag>
      ),
    },

    {
      title: 'Connection String',
      width: '15%',
      hideInSearch: true,
      dataIndex: 'connectionString',
    },

    {
      title: 'Status',
      dataIndex: 'isInactive',
      width: '35%',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        false: { text: 'Active', status: 'Success' },
        true: { text: 'Inactive', status: 'Error' },
      },
    },
  ];

  return (
    <section style={{ backgroundColor: 'white' }}>
      <h2 style={{ padding: 20 }}>Company List</h2>
      <IntlProvider value={intlMap[selectedLang]}>
        <ProTable<TenantApplication>
          columns={columns}
          actionRef={actionRef}
          search={false}
          options={false} 
          rowKey="id"
          onChange={(_, _filter, _sorter) => {
            const sorterResult = _sorter as SorterResult<TenantApplication>;
            if (sorterResult.field) {
              setSorter(`${sorterResult.field}_${sorterResult.order}`);
            }
          }}
          params={{ sorter }}
          request={(params) => fetchTenantsList(params)}
        />
      </IntlProvider>
    </section>
  );
};

export default TableList;
