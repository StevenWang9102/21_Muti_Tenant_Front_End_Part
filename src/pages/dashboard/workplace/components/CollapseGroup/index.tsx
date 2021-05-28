import { Collapse, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';

const { Panel } = Collapse;
const { Option } = Select;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const genExtra = () => (
  <SettingOutlined
    onClick={event => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }}
  />
);

export default class CollapseComponent extends React.Component {
  state = {
    expandIconPosition: 'right',
  };



  onPositionChange = expandIconPosition => {
    this.setState({ expandIconPosition });
  };

  render() {
    const { expandIconPosition } = this.state;


    return (
      <>
        <Collapse
          defaultActiveKey={['1']}
          onChange={callback}
          expandIconPosition={expandIconPosition}
        >
          <Panel header="Q1: How to create a company?" key="1" >
            <p>First, you need to create a company application form.</p>
            <p>Second, contact menuhub admin and wait for response.</p>
            <p>If your application is approved, you can use this new account now.</p>
            <p>Finally, you can add branched, employees, items and other page.</p>
          </Panel>

          <Panel header="Q2: What is 'bundle'?" key="2" >
            <p>Bundle is a bunch of items that sales as combo.</p>
          </Panel>

          <Panel header="Q3: What is 'location'?" key="3" >
            <p>You can name a specified place like a table as a location.</p>
          </Panel>

        </Collapse>
        {/* <br /> */}

        {/* <span>Expand Icon Position: </span>
        <Select
          value={expandIconPosition}
          style={{ margin: '0 8px' }}
          onChange={this.onPositionChange}
        >
          <Option value="left">left</Option>
          <Option value="right">right</Option>
        </Select> */}
      </>
    );
  }
}

// ReactDOM.render(<Demo />, mountNode);