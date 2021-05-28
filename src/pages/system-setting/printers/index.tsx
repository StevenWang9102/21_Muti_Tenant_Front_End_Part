import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Input, Form, Button, Radio, Row, Col, Popconfirm, message } from 'antd';
import 'antd/dist/antd.css';

const FormItem = Form.Item;


interface PropsInterface {

}

interface LocalPropsInterface {
  allUserInformation?: any[];
  oneUserInformation?: any[];
  warningMessage?: object;
  OneBranchInfo?: any[];
  allBranchNames: any[];
  allRoles: any[];
  visible: boolean;
  loadingEditUser: boolean;
  loadingOneUser: boolean;
  visibleOfNewUser: boolean;
}

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const PRINTER_PORTR = 'PRINTER_PORTR'
const PRINTER_ADDRESS = 'PRINTER_ADDRESS'
const IS_PRINTER_APPLIED = 'IS_PRINTER_APPLIED'

const EFTPOS_MODEL = 'EFTPOS_MODEL'
const IS_EFTPOS_APPLIED = 'IS_EFTPOS_APPLIED'
const PRINTER_TIMES = 'PRINTER_TIMES'

const UserManagement: React.FC<PropsInterface> = (props) => {
  const [form] = Form.useForm();
  const [printerAddress, setPrinterAddress] = useState('')
  const [eftposAddress, setEftPosAddress] = useState('')

  useEffect(() => {
    const address = localStorage.getItem(PRINTER_ADDRESS) || `localhost`
    const myPort = localStorage.getItem(PRINTER_PORTR) || `5000`
    const isPrinterApplied = localStorage.getItem(IS_PRINTER_APPLIED) || `YES`
    const model = localStorage.getItem(EFTPOS_MODEL) ||`ingenico`
    const isEftposApplied = localStorage.getItem(IS_EFTPOS_APPLIED) ||`YES`
    const times = localStorage.getItem(PRINTER_TIMES) || `1`

    const printer_address = `http://${address}:${myPort}/print/64code`
    const eftpos_address = `http://${address}:${myPort}/api/eftpos/${model}`

    setPrinterAddress(printer_address)
    setEftPosAddress(eftpos_address)

    // 显示，给默认值
    form.setFieldsValue({
      address: address,
      port: myPort,
      isPrinterApplied: isPrinterApplied,
      isEftPosApplied: isEftposApplied,
      model: model,
      times: times,
    })

    // 储存，给默认值
    localStorage.setItem(PRINTER_ADDRESS, address)
    localStorage.setItem(PRINTER_PORTR, myPort)
    localStorage.setItem(IS_PRINTER_APPLIED, isPrinterApplied)
    localStorage.setItem(EFTPOS_MODEL, model)
    localStorage.setItem(IS_EFTPOS_APPLIED, isEftposApplied)
    localStorage.setItem(PRINTER_TIMES, times)
  }, [])


  const onComfirmClicked = () => {
    const errors = form.getFieldsError()
    console.log('onComfirmClicked,err', errors);
    const values = form.getFieldsValue()
    console.log('onComfirmClicked,values', values);


    const printer_address = `http://${values.address}:${values.port}/print/64code`
    const eftpos_address = `http://${values.address}:${values.port}/api/eftpos/${values.model}`

    // 显示设置
    setPrinterAddress(printer_address)
    setEftPosAddress(eftpos_address)

    // 显示，给默认值
    form.setFieldsValue({
      address: values.address,
      port: values.port,
      isPrinterApplied: values.isPrinterApplied,
      isEftPosApplied: values.isEftPosApplied,
      model: values.model,
      times: values.times,
    })

    // 储存设置
    localStorage.setItem(PRINTER_ADDRESS, `${values.address}`)
    localStorage.setItem(PRINTER_PORTR, `${values.port}`)
    localStorage.setItem(IS_PRINTER_APPLIED, `${values.isPrinterApplied}`)
    localStorage.setItem(EFTPOS_MODEL, `${values.model}`)
    localStorage.setItem(IS_EFTPOS_APPLIED, `${values.isEftPosApplied}`)
    localStorage.setItem(PRINTER_TIMES, `${values.times}`)

    message.success('Success')
  }

  const onResetClicked = () => {
    // 设置储存
    localStorage.setItem(PRINTER_ADDRESS, 'localhost')
    localStorage.setItem(PRINTER_PORTR, '5000')
    localStorage.setItem(IS_PRINTER_APPLIED, 'YES')
    localStorage.setItem(EFTPOS_MODEL, `ingenico`)
    localStorage.setItem(IS_EFTPOS_APPLIED, 'YES')
    localStorage.setItem(PRINTER_TIMES, `1`)

    // 设置显示
    const printer_address = `http://localhost:5000/print/64code`
    const eftpos_address = `http://localhost:5000/api/eftpos/ingenico`

    setPrinterAddress(printer_address)
    setEftPosAddress(eftpos_address)

    // 显示，给默认值
    form.setFieldsValue({
      address: 'localhost',
      port: '5000',
      isPrinterApplied: 'YES',
      model: 'ingenico',
      isEftPosApplied: 'YES',
      times: '1',
    })
  }

  return (
    <section style={{ backgroundColor: 'white', padding: '40px 80px' }}>
      <h1 style={{fontSize: 24, marginLeft: 50, marginBottom: 20}}>Printer Settings</h1>

      <Form
        hideRequiredMark
        style={{ marginTop: 8 }}
        form={form}
        name="basic"
      >
        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="IP Address"
          name="address"
          rules={[
            {
              required: true,
              message: 'Please input address!',
            },
          ]}
        >
          <Input />
        </FormItem>

        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="Port"
          name="port"
          rules={[
            {
              required: true,
              message: 'Please input a port!',
            },
          ]}
        >
          <Input />
        </FormItem>

        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="Current Printer API"
        >
          <div style={{color: 'lightgray'}}> {printerAddress} </div>
        </FormItem>


        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="Do you want to use IP printer?"
          name="isPrinterApplied"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group
            value={localStorage.getItem(IS_PRINTER_APPLIED)}
          >
            <Radio style={radioStyle} value="YES">
              Yes <span style={{color: 'lightgrey'}}>(IP Printer)</span>
              </Radio>
            <Radio style={radioStyle} value="NO">
              No <span style={{color: 'lightgrey'}}>(Local Printer)</span>
              </Radio>
          </Radio.Group>
        </FormItem>

        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="Print times "
          name="times"
          rules={[
            {
              required: true,
              message: 'Please input a number!',
            },
          ]}
        >
          <Input />
        </FormItem>


{/* ----------------------------------- EFTPOS ------------------------------------- */}
<h1 style={{fontSize: 24, marginLeft: 50, marginBottom: 20}}>Eftpos Settings</h1>

        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="POS Model"
          name="model"
          rules={[
            {
              required: true,
              message: 'Please input a model!',
            },
          ]}
        >
          <Input />
        </FormItem>


        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="Current Eftpos API"
        >
          <div style={{color: 'lightgray'}}> {eftposAddress} </div>
        </FormItem>


        <FormItem
          labelCol={{ span: 7 }} wrapperCol={{ span: 7 }}
          label="Do you want to use IP POS?"
          name="isEftPosApplied"
          rules={[{ required: true } ]}
        >
          <Radio.Group
            value={localStorage.getItem(IS_EFTPOS_APPLIED)}
          >
            <Radio style={radioStyle} value="YES">
              Yes <span style={{color: 'lightgrey'}}>(IP POS)</span>
              </Radio>
            <Radio style={radioStyle} value="NO">
              No <span style={{color: 'lightgrey'}}>(Local POS)</span>
              </Radio>
          </Radio.Group>
        </FormItem>

        <Row>
          <Col offset={7} span={12}>
            <Button
              type='primary'
              onClick={() => onComfirmClicked()}
            >Comfirm
              </Button>

            <Popconfirm
              title="Are you sure to reset ？"
              onConfirm={() => {
                onResetClicked()
              }}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button
                style={{ marginLeft: 15 }}
              >Reset
              </Button>
            </Popconfirm>

          </Col>
        </Row>

      </Form>
    </section>
  );
};

const mapStateToProps = ({
  menberManagement,
  loading,
}: {
  menberManagement: LocalPropsInterface;
  loading: {
    effects: {
      [key: string]: boolean;
    };
  };
}) => ({
  menberManagement,
});

export default connect(mapStateToProps)(UserManagement);
