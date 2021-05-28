import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getBrancnId } from '../functions/getBrancnId'


export const CascadingMenu = (props) => {

  const [myMenu, setMyMenu] = useState<any>(<div></div>)
  const {allBranchInformation, branchName, setBranchName, requestBranchUserInformation, setCurrentBranchId } = props

  useEffect(() => {
    // 当Branch数据返回时，重新渲染Menu.
    const newBranchNameList = ['All Branch']
    if (allBranchInformation !== []) {
      allBranchInformation.forEach(element => {
        !element.isInactive && newBranchNameList.push(element.shortName)
      });
      const menu = (
        <section>
          {newBranchNameList.sort().map((branch) => {
            return (
              <div onClick={() => {
                if(branch === "All Branch"){
                  setCurrentBranchId()
                  requestBranchUserInformation('All Branch')
                } else {
                  const branchId = getBrancnId(allBranchInformation, branch)
                  setCurrentBranchId(branchId)
                  requestBranchUserInformation(branchId)
                }
                setBranchName(branch) // 设置当前Branch Name
              }}>
                <Menu style={{ height: 30}}>
                  <Menu.Item style={{ height: 30, color: "black", backgroundColor: "white" }}>{branch}</Menu.Item>
                </Menu>
              </div>
            )
          })}
        </section>
      );
      setMyMenu(menu)
    }
  }, [allBranchInformation])

  const myStyle = {
    margin: "50px 20px 20px 20px",
    width: '210px',
    color: "#1890ff",
    fontWeight: 400,
    border: "1px solid #1890ff"
  }

  const overlayStyle = {
    color: "red",
    width: 100,
    height: allBranchInformation.length === 0? "0px": "300px",
    overflow: allBranchInformation.length > 30? "auto" : null,
  }

  return (
    <Dropdown overlay={myMenu} overlayStyle={overlayStyle}>
      <Button
        style={myStyle}
        className="ant-dropdown-link"
        onClick={e => {e.preventDefault()}}>
        {branchName || "Select a Branch"} <DownOutlined />
      </Button>
    </Dropdown>
  )
}