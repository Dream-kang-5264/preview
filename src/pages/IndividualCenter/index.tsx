import { editUserInfo, getUserInfo } from '@/api/userCenter';
import { PageContainer } from '@ant-design/pro-components'
import { Button, Form, FormProps, Input, Modal, message } from 'antd';
import { User, CircleUserRound, Mail, Phone, Building, Calendar, Edit, Key, Bell, BarChart2, FileText, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type FieldType = {
    name?: string;
    password?: string;
    remember?: string;
    phone?: string;
    email?: string;
    company?: string;
    role?: string;
};
function index() {
    const [activeTab, setActiveTab] = useState('profile');
    let [userInfo, setUserInfo] = useState({ name: '', email: '' })
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        getUserInfos()
    }, [])
    const usageStats = {
        documentsCreated: 156,
        wordsGenerated: 78500,
        timeSaved: 260,
    };
    let getUserInfos = () => {
        getUserInfo({}).then((res) => {
            if (res.status === 200) {
                console.log(res.data.records[0])
                setUserInfo((prev: any) => ({
                    ...prev,
                    name: res.data.records[0].name,
                    email: res.data.records[0].email,
                    company: res.data.records[0].department,
                    joinDate: res.data.records[0].created_at,
                    role: res.data.records[0].role
                }))
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        // console.log('Success:', values);
        editUserInfo({ ...values }).then((res) => {

            if (res.status === 200) {
                message.success('修改成功')
                setIsModalOpen(false);
                getUserInfos()
            }
        }).catch((err) => {
            console.log(err)
        });
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const renderProfile = () => (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">个人信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">姓名</p>
                        <p className="font-medium">{userInfo.name}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">邮箱</p>
                        <p className="font-medium">{userInfo.email}</p>
                    </div>
                </div>
                {/* <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">电话</p>
                        <p className="font-medium">{userInfo.phone}</p>
                    </div>
                </div> */}
                <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">部门</p>
                        <p className="font-medium">{userInfo.company}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">加入日期</p>
                        <p className="font-medium">{userInfo.joinDate}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <CircleUserRound className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">身份</p>
                        <p className="font-medium">{userInfo.role}</p>
                    </div>
                </div>
            </div>
            <button className="mt-6 flex items-center text-blue-600 hover:text-blue-800" onClick={() => {
                setIsModalOpen(true);
            }}>
                <Edit className="h-4 w-4 mr-2" />
                编辑个人信息
            </button>
        </div>
    );

    const renderSettings = () => (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">账户设置</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">修改密码</h3>
                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <Key className="h-4 w-4 mr-2" />
                        更改密码
                    </button>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">通知设置</h3>
                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <Bell className="h-4 w-4 mr-2" />
                        管理通知偏好
                    </button>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">隐私设置</h3>
                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <User className="h-4 w-4 mr-2" />
                        调整隐私选项
                    </button>
                </div>
            </div>
        </div>
    );

    const renderUsageStats = () => (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">使用统计</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">{usageStats.documentsCreated}</span>
                    </div>
                    <p className="text-sm text-gray-600">创建的文档数</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart2 className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{usageStats.wordsGenerated}</span>
                    </div>
                    <p className="text-sm text-gray-600">生成的字数</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="h-8 w-8 text-purple-600" />
                        <span className="text-2xl font-bold text-purple-600">{usageStats.timeSaved}</span>
                    </div>
                    <p className="text-sm text-gray-600">节省的时间（小时）</p>
                </div>
            </div>
        </div>
    );
    return (
        <PageContainer
        >
            <div className="container mx-auto px-4 ">
                {/* <h1 className="text-3xl font-bold mb-8">个人中心</h1> */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {['profile', 'settings', 'usage'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab === 'profile' && '个人信息'}
                                    {tab === 'settings' && '账户设置'}
                                    {tab === 'usage' && '使用统计'}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                <div className="mt-6">
                    {activeTab === 'profile' && renderProfile()}
                    {activeTab === 'settings' && renderSettings()}
                    {activeTab === 'usage' && renderUsageStats()}
                </div>


                <Modal title="修改个人信息" open={isModalOpen} footer={false} onOk={handleOk} onCancel={handleCancel}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        style={{ maxWidth: 600 }}
                        initialValues={userInfo}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="姓名"
                            name="name"
                            rules={[{ required: true, message: '请输入姓名！' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="email"
                            name="email"
                            rules={[{ required: true, message: '请输入邮箱！' }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        {/* <Form.Item<FieldType>
                            label="手机号"
                            name="phone"
                            rules={[{ required: true, message: '请输入手机号！' }]}
                        >
                            <Input disabled />
                        </Form.Item> */}
                        <Form.Item<FieldType>
                            label="部门"
                            name="company"
                            rules={[{ required: true, message: '请输入部门！' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="身份"
                            name="role"
                            rules={[{ required: true, message: '请输入身份！' }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </PageContainer>
    )
}

export default index