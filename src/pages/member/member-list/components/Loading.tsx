import { Spin, Alert } from 'antd';


export const Loading = (props) => {
    const myStyle = {
        position: "absolute",
        top: "20%",
        zIndex: 1,
        height: 100,
        width: "100%"
    }

    return (
        <Spin
            size="large"
            style={myStyle}
            spinning={props.loading} tip="Loading..." delay={1500}>
            {/* <Alert
                message="Alert message title"
                description="Further details about the context of this alert."
                type="info"
            /> */}
        </Spin>
    )
}