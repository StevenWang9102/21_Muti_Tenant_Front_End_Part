import {
  Card,
  Col,
  Input,
  Row,
  Select,
  Button,
  Radio,
  Result,
  Steps,
  Modal,
} from 'antd';
import React, { } from 'react';
import { Form } from '@ant-design/compatible';
import { LoadingOutlined} from '@ant-design/icons';

const { Step } = Steps;



export const RenderMPMModal = ({
  handleOrderLTSubmit,
  state,
  styles,
  closeMPMModal,
}) => {

    const { MPMVisible, MPMRequest, MPMMessageDisplayed } = state;

    let current = 0;
    type IStatusMapType = 'finish' | 'process' | 'wait' | 'error';
    let step1Status: IStatusMapType = 'finish';
    let step1Icon = null;
    let step2Status: IStatusMapType = 'finish';
    let step2Icon = null;
    let step3Status: IStatusMapType = 'finish';
    let step3Icon = null;
    let MPMModalFooter = {
      footer: [
        <Button type="danger" onClick={handleOrderLTSubmit}>
          Close
        </Button>,
      ],
    };
    const stepStyle = {
      marginBottom: 25,
      boxShadow: '0px -1px 0 0 #e8e8e8 inset',
    };

    const setPerStepIcon = (step: number, status: IStatusMapType) => {
      switch (status) {
        case 'process':
          step1Icon = step === 1 ? <LoadingOutlined /> : null;
          step2Icon = step === 2 ? <LoadingOutlined /> : null;
          step3Icon = step === 3 ? <LoadingOutlined /> : null;
          break;
      }
    };

    const setPerStepStatus = (
      step1: IStatusMapType,
      step2: IStatusMapType,
      step3: IStatusMapType,
    ) => {
      step1Status = step1;
      setPerStepIcon(1, step1);
      step2Status = step2;
      setPerStepIcon(2, step2);
      step3Status = step3;
      setPerStepIcon(3, step3);
    };

    const setProcessingMessage = (current, res) => {
      let title = res.message;
      if (current == 1 && title == 'search successful' && res.status_description == 'TRADE_CLOSED')
        title = `Payment Closed`;
      else if (
        current == 1 &&
        title == 'search successful' &&
        res.status_description != 'TRADE_CLOSED'
      )
        title = `The customer chose ${res.channel} and is paying...`;
      else if (current == 2) title = `Payment Successful`;
      if (res.status == 'true') return <Result status="success" title={title} />;
      else return <Result title={title} />;
    };

    switch (MPMRequest) {
      case 'posPay':
        current = 0;
        MPMMessageDisplayed.status == 'true'
          ? setPerStepStatus('finish', 'wait', 'wait')
          : setPerStepStatus('error', 'wait', 'wait');
        MPMModalFooter =
          MPMMessageDisplayed.status == 'true'
            ? { footer: null }
            : {
              footer: [
                <Button type="primary" onClick={closeMPMModal}>
                  Close
                  </Button>,
              ],
            };
        break;
      case 'getTransactionDetails':
        MPMMessageDisplayed.status == 'true' ? (current = 2) : (current = 1);
        MPMMessageDisplayed.status == 'true'
          ? setPerStepStatus('finish', 'finish', 'finish')
          : MPMMessageDisplayed.status_description == 'TRADE_CLOSED'
            ? setPerStepStatus('finish', 'error', 'wait')
            : setPerStepStatus('finish', 'process', 'wait');
        MPMModalFooter =
          MPMMessageDisplayed.status == 'true' ||
            MPMMessageDisplayed.status_description == 'TRADE_CLOSED' ||
            MPMMessageDisplayed.status_description == undefined
            ? {
              footer: [
                <Button type="primary" onClick={closeMPMModal}>
                  Close
                  </Button>,
              ],
            }
            : { footer: null };
        break;
      default:
        break;
    }

    // console.log('this.props.', currentPOSData);


    return (
      <Modal
        title={`Digital Pay`}
        className={styles.standardListForm}
        width={800}
        closable={false}
        destroyOnClose
        visible={MPMVisible}
        {...MPMModalFooter}
      >
        <Steps type="navigation" size="small" current={current} style={stepStyle}>
          <Step
            title="Send to MyPOSMate"
            icon={step1Icon}
            status={step1Status}
            description="Send payment request to MyPOSMate."
          />
          <Step
            title="Paying"
            icon={step2Icon}
            status={step2Status}
            description="Choose payment method and make payment."
          />
          <Step
            title="Payment Successful"
            icon={step3Icon}
            status={step3Status}
            description="Please click the close button to complete the sale."
          />
        </Steps>
        {setProcessingMessage(current, MPMMessageDisplayed)}
      </Modal>
    );
}