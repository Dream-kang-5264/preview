import React, { useState } from 'react'
import styles from './index.less'
import { Button, Form, FormProps, Input, Tabs, TabsProps, message } from 'antd'
import { LockOutlined, MailOutlined, SafetyOutlined, UserDeleteOutlined, UserOutlined } from '@ant-design/icons'
import { userLogin, userRegister } from '@/api/login'
import { history } from 'umi';
// import { setLoginShow, setloginButtonShow } from '@/redux/module/homeStore'
import { useAppDispatch } from '@/redux/storeIndex'
import { userFilesList } from '@/api/longText'
import { flushSync } from 'react-dom'
function Index() {
    const [messageApi, contextHolder] = message.useMessage();
    // const { initialState, setInitialState } = useModel('@initialState');
    let [tabKey, setTabKey] = useState('1')
    let [butShow, setButShow] = useState(true)
    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
        email?: string;
        loginPass: string;
        loginEmail: string;
    };
    // 邮箱校验规则
    const validateEmail = (_: any, value: any) => {
        // 简单的邮箱格式校验，可以根据需求进一步扩展
        if (!value || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('请输入有效的邮箱地址!'));
    };
    // 自定义密码校验规则
    const validatePassword = (_: any, value: string | any[]) => {
        if (!value) {
            return Promise.reject('请输入密码');
        }
        if (value.length < 6 || value.length > 12) {
            return Promise.reject('密码长度必须在6到12位之间');
        }
        return Promise.resolve();
    };
    // 登录接口
    const onFinishLogin: FormProps<FieldType>['onFinish'] = (values) => {
        // userFilesList().then((res) => {
        //     console.log(res);

        // })
        // return
        // console.log(values);

       
        userLogin({ email: values.loginEmail, password: values.loginPass }).then(async (res) => {
            if (res.data.code === 200) {
                localStorage.setItem('role', res.data.data.role);
                      
                const loginTime: any = Math.floor(Date.now() / 1000);
                // dispatch(setloginButtonShow(true))
                // dispatch(setLoginShow(false))
                localStorage.setItem('tokenTime', res.data.data.expires_in)
                localStorage.setItem('token', res.data.data.token)
                localStorage.setItem('userUrl', 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser.49bc4072.png&w=64&q=75')
                localStorage.setItem('loginTime', loginTime)
                messageApi.open({
                    type: 'success',
                    content: res.data.message,
                });
                setTimeout(() => {
                    history.push('/')
                }, 500)
            }
            else if (res.data.code === -1) {
                messageApi.open({
                    type: 'error',
                    content: res.data.message,
                });
            }
            else if (res.data.code === 442) {
                messageApi.open({
                    type: 'error',
                    content: res.data.message,
                });
            }
        }).catch((error) => {
            messageApi.open({
                type: 'error',
                content: '系统异常',
            });
        })



    };
    // 注册
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        // 注册接口

        userRegister({ email: values.email, password: values.password, name: values.username }).then((res) => {

            if (res.data.code == 200) {
                setTabKey('1')
                messageApi.open({
                    type: 'success',
                    content: res.data.msg,
                });
            }
            else {
                messageApi.open({
                    type: 'error',
                    content: res.data.msg,
                });
            }

        }).catch((error) => {
            // messageApi.open({
            //     type: 'error',
            //     content: error.response.data.message,
            // });
        })


    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onFinishFailedLogin: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '邮箱登录',
            children: <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 20 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinishLogin}
                onFinishFailed={onFinishFailedLogin}
                autoComplete="off"
            >
                <Form.Item<FieldType >
                    // label="Username"
                    name="loginEmail"
                    rules={[{ required: true, message: '请输入正确的邮箱格式!' }, {
                        validator: validateEmail,
                    },]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input prefix={<MailOutlined />} size="large" placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item<FieldType>
                    // label="Password"
                    name="loginPass"
                    rules={[{ required: true, message: '密码长度不能小于6位!' }, {
                        validator: validatePassword,
                    },]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input.Password prefix={<LockOutlined />} size="large" placeholder="请输入密码" />
                </Form.Item>

                <Form.Item<FieldType>
                    // label="Password"
                    name="loginPass"
                    wrapperCol={{ span: 24 }}
                >
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        登录
                    </Button>
                </Form.Item>

                <Form.Item<FieldType>
                    // label="Password"
                    name="password"

                    wrapperCol={{ span: 24 }}
                >
                    <Button type="default" style={{ width: '100%' }} onClick={(e) => {
                        setTabKey('2'), setButShow(false); e.stopPropagation()
                    }}>
                        立即注册
                    </Button>


                </Form.Item>
            </Form>
        },
        {
            key: '2',
            label: '邮箱注册',
            children: <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 20 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType >
                    // label="Username"
                    name="username"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input prefix={<UserOutlined />} size="large" placeholder="请输入用户名！" />
                </Form.Item>
                <Form.Item<FieldType >
                    // label="Username"
                    name="email"
                    rules={[{ required: true, message: '请输入正确的邮箱格式!' }, {
                        validator: validateEmail,
                    },]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input prefix={<MailOutlined />} size="large" placeholder="请输入邮箱！" />
                </Form.Item>
                <Form.Item<FieldType>
                    // label="Password"
                    name="password"
                    rules={[{ required: true, message: '密码长度不能小于6位!' }, {
                        validator: validatePassword,
                    },]}
                    wrapperCol={{ span: 24 }}
                >
                    <Input.Password prefix={<LockOutlined />} size="large" placeholder="请输入密码" />
                </Form.Item>
                <Form.Item<FieldType>
                    // label="Password"
                    name="password"

                    wrapperCol={{ span: 24 }}
                >

                    <Button type="primary" style={{ width: '100%' }} htmlType="submit">
                        立即注册
                    </Button>
                </Form.Item>

                <Form.Item<FieldType>
                    // label="Password"
                    name="password"

                    wrapperCol={{ span: 24 }}
                >
                    <Button type="default" style={{ width: '100%' }} onClick={(e) => {
                        e.stopPropagation()
                        setTabKey('1'), setButShow(true)
                    }}>
                        前往登录</Button>


                </Form.Item>
            </Form>
        },

    ];
    const onChange = (key: string) => {
        setTabKey(key)
        // if (key === '2') setButShow(false)
        // if (key === '1') setButShow(true)
    };
    // 点击登录

    return (
        <div className={styles.login_body}>
            <div className={styles.login_from}>
                <div className={styles.login_title}>智能写作</div>
                {/* <div className={styles.login_title_tab}>
                    <span style={{ color: tab === 1 ? 'blue' : '' }} onClick={handleCode}>验证码登录</span> | <span style={{ color: tab === 2 ? 'blue' : '' }} onClick={handlePass}>账号密码登录</span>
                </div> */}
                {/* {
                    loginType
                } */}
                <Tabs defaultActiveKey={tabKey} activeKey={tabKey} items={items} onChange={onChange} />
            </div>
            {contextHolder}
        </div>
    )
}

export default Index



