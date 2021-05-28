import { Table, Pagination, message  } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { getAuthHeader, getAuthHeaderOfImage, getToken } from '@/utils/authority';


export const StandardTable: React.FC<any> = ({
  data,
  rowKey,
  pagination,
  setPagination,
  totalItemCount,
  currentPage,
  setCurrentPage,
  requestItemsWithQueries,
  ...rest
}) => {

  useEffect(()=>{
    // 如果页码发生变化，则请求数据
    // alert('如果页码发生变化，则请求数据')
    requestItemsWithQueries(pagination)
  }, [pagination])



  const { list = [] } = data || {};
  console.log('StandardTable,list', list);
  console.log('StandardTable,pagination',pagination);
  

  return (
    <div className={styles.standardTable}>
      <p style={{marginTop: 30, fontWeight: 700}}>Item Total: {totalItemCount}</p>

      <Table
        dataSource={list}
        style={{ padding: 10 }}
        rowKey={rowKey || 'key'}
        pagination={false}
        onChange={(pagination, filters, sorter)=> {
          console.log('onTableChange,pagination', pagination);
          console.log('onTableChange,filters', filters);
          console.log('onTableChange,sorter', sorter);

        }}
        {...rest}
      />

      <Pagination
        style={{ float: 'right', marginTop: 10}}
        current={currentPage}
        total={totalItemCount} 
        defaultCurrent={1}
        defaultPageSize={20}
        hideOnSinglePage={true}
        pageSizeOptions={["10", "20", "50"]}
        onShowSizeChange={(page, size)=> {
          console.log('onShowSizeChange', page);
          console.log('onShowSizeChange', size);
          
          setPagination({ pagenumber: page, pagesize: size })
        }}
        onChange={(page, size)=> {
          console.log('requestItemsWithQueries', page);
          console.log('requestItemsWithQueries', size);
          setPagination({ pagenumber: page, pagesize: size })
          setCurrentPage(page)
        }}
      />
    </div>
  );
}
