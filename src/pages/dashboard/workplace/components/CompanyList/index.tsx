import { List, Avatar } from 'antd';
import React, { Component } from 'react';
import dateFormat from "dateformat";


export const CompanyList = ({allCandidates}) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={allCandidates.filter(each=> each.isApproved)}
      renderItem={(item:any) => {
        console.log('renderItem,item', item.userMiddleName);
        const ownerName = 
        item.userMiddleName? `Owner: ${item.userFirstName} ${item.userMiddleName} ${item.userLastName}`
        :`Owner: ${item.userFirstName} ${item.userLastName}`
        
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={require('../Image/company.jpg')} />}
              title={<a>{item.tradingName}</a>}
              description={<>
                <p style={{ marginBottom : 0}}>{ownerName}</p>
                <p style={{ marginBottom : 0}}>{`Created at: ${dateFormat(item.createdTime, "dd mmm yyyy, HH:MM")}`}</p>
                <p style={{ marginBottom : 0}}>{`Address: ${item.street} ${item.suburb} ${item.city} ${item.country}`}</p>
              </>}
            />
          </List.Item>
        )
      }}
    />
  )
}

// startAndEndDay.start = dateFormat(${item.createdTime, "yyyy-mm-dd")
