import React, { useEffect, FC } from 'react'
import { Modal, Form, Input, Button } from 'antd';
import { EditNameModelInterface } from '../data';
import { formatMessage } from 'umi';
import style from '../style.less';
import { CloseSquareTwoTone } from '@ant-design/icons';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export const EditLocation: FC<EditNameModelInterface> = (props) => {

  const { dispatch, allLocations, currentLocationId, fromPage, selectedBranchId, loadingOfCreate, currentBranchName } = props;
  const [form] = Form.useForm()
  const currentLocationInfo = allLocations[currentLocationId]
  const sourceData = {
    location: currentLocationInfo && currentLocationInfo.name || "-",
    moniker: currentLocationInfo && currentLocationInfo.moniker || "-",
    note: currentLocationInfo && currentLocationInfo.note || "-",
  }

console.log(selectedBranchId);

  useEffect(() => {

    if (fromPage === 'createNewLocation') {
      form.resetFields()
    } else {
      form.setFieldsValue(sourceData)
    }
  }, [props.visible]);


  const onSetLocationClick = () => {

    const currentValues = form.getFieldsValue()
    const changeArray = ['name', 'moniker', 'note']

    changeArray.forEach((item, index) => {
      let name;
      item === 'name' ? name = 'location' : name = item;

      dispatch({
        type: 'location/changeNames',
        payload: {
          id: currentLocationInfo!.branchId,
          index: currentLocationInfo!.id,
          name: `/${item}`,
          value: currentValues![name],
        },
      })
    })
  }

  const onPostNewLocaiton = () => {
    const currentValues = form.getFieldsValue()
    dispatch({
      type: 'location/createLocation',
      payload: {
        name: currentValues.location,
        moniker: currentValues.moniker,
        note: currentValues.note,
        branchId: selectedBranchId,
      },
    })
  }

  const Name = (parm) => {
    return formatMessage({ id: `location.nav.${parm}` })
  }

  return (
    <div>
      <Modal
        maskClosable={false}
        closeIcon={<CloseSquareTwoTone />}
        footer={null}
        title={fromPage === 'createNewLocation' ?
        `Create Locaiton for ${currentBranchName}` :
          `Edit Location for ${currentBranchName}`}
        confirmLoading={props.loading}
        visible={props.visible}
        onCancel={() => { props.onCancelButtonClick() }}
      >

        <Form
          {...layout}
          form={form}
          name="basic"
        >
          <Form.Item
            label={Name('location')}
            name="location"
            rules={[
              {
                required: true,
                message: 'This field is required !',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={Name('moniker')}
            name="moniker"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={Name('note')}
            name="note"
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit"
              className={style.button}
              loading={loadingOfCreate}
              onClick={() => {
                const currentValue = form.getFieldsValue()
                if (currentValue.location !== undefined) {
                  fromPage === 'createNewLocation' ? onPostNewLocaiton() :
                    onSetLocationClick()
                }
              }}>{fromPage === 'createNewLocation' ? 'Create' : 'Update'}
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  )
}

