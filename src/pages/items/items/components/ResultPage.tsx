import React, { useState } from 'react';
import { Descriptions, Badge } from 'antd';

export const ResultPage = ({
  largeAddResults,
}) => {

  console.log('ResultPage18918', largeAddResults);
  console.log('ResultPage18918.processedItemList', largeAddResults.processedItemList);
  console.log('ResultPage18918.skippedItemList', largeAddResults.skippedItemList);

  return (
    < >
      <Descriptions title="Result" layout="vertical" bordered>
        <Descriptions.Item label="Created count:" style={{ width: 150, fontWeight: 700 }} >
          <span style={{ color: 'green', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>{largeAddResults.processedItemCount} </span>
        </Descriptions.Item>

        <Descriptions.Item label="Created items:" span={2} style={{ fontWeight: 700 }}>
          {largeAddResults.processedItemList.map(each => {

            const name = each.split(' / ')[1]
            const code = each.split(' / ')[0]
            console.log('each181851', name);

            return <>
              <div style={{ color: 'darkgreen' }}> {`Upload ${name} ( Code: ${code}) Success !`}</div>
            </>
          })}
        </Descriptions.Item>

        <Descriptions.Item label="Skipped count:" style={{ width: 150, fontWeight: 700 }}>
          <span style={{ color: 'red', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>{largeAddResults.skippedItemCount} </span>
        </Descriptions.Item>

        <Descriptions.Item label="Skipped items:" span={2} style={{ fontWeight: 700 }}>
          {largeAddResults.skippedItemList.map(each => {
            var message;
            if(each.message == 'duplicate name!')  message =  'This item has already exist.'
            else if(each.message == 'duplicate code!')  message =  'This code has already exist.'
            else message = each.message
            
            return <>
              <div style={{ color: 'red', fontWeight: 500 }}> Upload {`${each.name} (${each.code})`} failed. {`${message}`}</div>
            </>
          })}
        </Descriptions.Item>

      </Descriptions>
    </>
  );
};
