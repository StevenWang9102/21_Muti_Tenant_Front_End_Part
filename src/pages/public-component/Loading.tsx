import { Spin, Alert } from 'antd';


export const Loading = (props) => {
    <Spin spinning={props.loading} tip="Loading...">
        <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
        />
    </Spin>
}