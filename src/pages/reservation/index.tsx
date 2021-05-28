import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Radio, Row, Col } from 'antd';
import Calendar from './sections/Calander/Calender';
import { BranchSettingInterface } from './data';
import ListView from './sections/ListView/ListView'
import ReservationList from './sections/ReservationList'

interface BranchSettingProps {
  dispatch: Dispatch;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  loadingOfSwitch?: boolean;
  warningMessage?: object;
  loadingOfAction?: boolean;
  loadingOfCreateNewBranch?: boolean;
  branchManagement?: BranchSettingInterface;
}

const ReservationManagement: React.FC<BranchSettingProps> = (props) => {

  const [currentPage, setCurrentPage] = useState("Calendar");
  const [visibleCreate, setVisibleCreate] = useState(false);

  const radioStyle = {
    fontWeight: '600',
    width: "300px",
    textAlign: 'center'
  }

  return (
    <section style={{
      minHeight: 800,
      backgroundColor: "white",
      border: '2px solid white'
    }}
    >

      <Row>
        <Col span={20} offset={5}
        >
          <Radio.Group
            size='middle'
            defaultValue="Calendar"
            style={{ margin: 20}}
            buttonStyle="solid"
            onChange={(event) => {
              console.log('onChange411', event.target.value);
              setCurrentPage(event.target.value)
            }}
          >
            <Radio.Button value="Calendar" style={radioStyle}>Calendar</Radio.Button>
            <Radio.Button value="List View" style={radioStyle}>List View</Radio.Button>
            {/* <Radio.Button value="Form List" style={radioStyle}>Form List</Radio.Button> */}
          </Radio.Group>
        </Col>
      </Row>

      { currentPage == 'Calendar' &&
        <Calendar
          visibleCreate={visibleCreate}
          setVisibleCreate={setVisibleCreate}
        />}

      { currentPage == 'List View' &&
        <ListView
          visibleCreate={visibleCreate}
          setVisibleCreate={setVisibleCreate}
        />}

      { currentPage == 'Form List' &&
        <ReservationList
          visibleCreate={visibleCreate}
          setVisibleCreate={setVisibleCreate}
        />}

    </section>
  );
};

export default connect(
  ({
    branchManagement,
    loading,
  }: {
    branchManagement: BranchSettingInterface;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    branchManagement,
    submitting: loading.effects['branchManagement/getAllBranchName'],
    submittingOfChangeAllNames: loading.effects['branchManagement/changeAllCompanyNames'],
    submittingOfChangeAllRoles: loading.effects['branchManagement/changeAllRoles'],
  }),
)(ReservationManagement);
