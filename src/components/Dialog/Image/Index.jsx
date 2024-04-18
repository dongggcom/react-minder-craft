import React, {useState} from 'react';
import {Modal, Form, Input, Tabs, Button, Upload} from 'antd';
import {InfoCircleOutlined, UploadOutlined} from '@ant-design/icons';

const {TabPane} = Tabs;

const Image = ({visible, onCancel, onSubmit}) => {
    const [tab, setTab] = useState('upload');
    const [linkForm] = Form.useForm();
    const [uploadForm] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState('可选');

    const normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const onRequiredTypeChange = ({requiredMarkValue}) => {
        setRequiredMarkType(requiredMarkValue);
    };
    const reset = () => {
        onCancel();
        uploadForm.resetFields();
        linkForm.resetFields();
    };
    const onOk = () => {
        if (tab === 'upload') {
            uploadForm.validateFields()
                .then(values => {
                    onSubmit(values);
                    reset();
                }).catch(error => console.error(error));
        } else if (tab === 'link') {
            linkForm.validateFields()
                .then(values => {
                    onSubmit(values);
                    reset();
                }).catch(error => console.error(error));
        }
    };
    return (
        <Modal
            visible={visible}
            onCancel={() => {
                setTab('upload');
                onCancel();
            }}
            onOk={onOk}
            okText="确定"
            cancelText="取消"
        >
            <Tabs activeKey={tab} onChange={setTab}>
                <TabPane tab="图片搜索" key="search">
                    <Form layout="inline">
                        <Form.Item label="关键字">
                            <Input type="text" placeholder="请输入搜索的关键字" />
                        </Form.Item>
                        <Form.Item>
                            <Button>百度一下</Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="外链图片" key="link">
                    <Form
                        form={linkForm}
                        layout="vertical"
                        initialValues={{requiredMarkValue: requiredMark}}
                        onValuesChange={onRequiredTypeChange}
                        requiredMark={requiredMark}
                    >
                        <Form.Item
                            name="url"
                            initialValue=""
                            label="链接地址"
                            tooltip="必填，以 http(s):// 开头"
                            rules={[
                                {required: true, message: '没有填入链接地址'},
                                {pattern: /^(https?):\/\/\w+/, message: '以 http(s):// 开头'},
                            ]}
                        >
                            <Input placeholder="必填，以 http(s):// 开头" />
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
                </TabPane>
                <TabPane tab="上传图片" key="upload">
                    <Form
                        form={uploadForm}
                        layout="vertical"
                        initialValues={{requiredMarkValue: requiredMark}}
                        onValuesChange={onRequiredTypeChange}
                        requiredMark={requiredMark}
                    >
                        <Form.Item
                            name="upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                name="logo"
                                action="/upload.do"
                                listType="picture"
                                accept="image/*"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>选择文件...</Button>
                            </Upload>
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
                </TabPane>
            </Tabs>

        </Modal>
    );
};

export default Image;
