import React, {useState, useRef, useEffect} from 'react';
import {Modal, Form, Input} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';

const HyperLink = ({visible, onCancel, onSubmit}) => {
    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState('可选');
    const inputRef = useRef(null);

    useEffect(
        () => {
            if (visible && inputRef?.current) {
                // FIXME: 第一次成功后后续没有效果
                inputRef.current.focus();
            }
        }, [visible]
    );
    const onRequiredTypeChange = ({requiredMarkValue}) => {
        setRequiredMarkType(requiredMarkValue);
    };
    const onOk = () => {
        form.validateFields()
            .then(values => {
                onSubmit(values);
                onCancel();
                form.resetFields();
            }).catch(error => console.error(error));
    };
    return (
        <Modal
            title="添加链接"
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
            okText="确定"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{requiredMarkValue: requiredMark}}
                onValuesChange={onRequiredTypeChange}
                requiredMark={requiredMark}
            >
                <Form.Item
                    name="url"
                    initialValue=""
                    label="链接地址"
                    tooltip="必填，以 http(s):// 或 ftp:// 开头"
                    rules={[
                        {required: true, message: '没有填入链接地址'},
                        {pattern: /^(https?|ftp):\/\/\w+/, message: '以 http(s):// 或 ftp:// 开头'},
                    ]}
                >
                    <Input ref={inputRef} placeholder="必填，以 http(s):// 或 ftp:// 开头" />
                </Form.Item>
                <Form.Item
                    name="title"
                    initialValue=""
                    label="提示文本"
                    tooltip={{title: '选填，鼠标在链接上悬停时提示的文本', icon: <InfoCircleOutlined />}}
                >
                    <Input placeholder="选填，鼠标在链接上悬停时提示的文本" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default HyperLink;
