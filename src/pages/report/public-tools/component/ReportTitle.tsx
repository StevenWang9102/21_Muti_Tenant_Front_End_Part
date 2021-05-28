import React, { FC } from 'react';
import 'antd/dist/antd.css';

interface ReportTitleInterface {
  fromPage: string,
  displayTime: any,
  currentBranchName: string,
  searchType: string,
  currentItemName?: string,
  currentCategoryName?: any,
}

export const ReportTitle = (props: ReportTitleInterface) => {

  const { displayTime, currentBranchName, currentItemName, searchType, fromPage } = props;
  const { currentCategoryName } = props

  let title = '';
  if(fromPage==='ItemDailyReport'){
    if (currentBranchName === 'AllBranch') {
      title = `${currentItemName? `${currentItemName} - `: ''} ${currentItemName === 'AllBranch'?'': ''} All Branch`;
    }  
    else title = `${currentItemName} - ${currentBranchName}`;
  } 
  
  else if(fromPage==='CategoryBranchReport'){
    title =  currentCategoryName || ''
  }

  else if(fromPage==='ItemBranchReport'){
    title =  currentItemName || ''
  }

  else {
    if (currentBranchName === 'AllBranch') title = 'All Branch';
    else title = `${currentBranchName}`;
  }

  const mystyle = { float: 'right', fontSize: 13, display: 'inlineBlock', color: 'gray' }
  const gate = (searchType === 'Only_Date_Search' && fromPage === 'MonthlyReport')

  return (
    <section style={{margin: '10px 0 10px 0'}}>
      <h3 style={{ margin: '0', marginLeft: 40, backgroundColor: 'white', fontSize: '25px' }}>
        {title}
        {displayTime.start === undefined || displayTime.end === undefined || gate? null : (
          <div style={mystyle}>
              <div>
                {`From  ${displayTime.start}  To  ${displayTime.end}`}
              </div>
          </div>
        )}
      </h3>
    </section>
  );
};
