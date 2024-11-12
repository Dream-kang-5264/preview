

import React, { useEffect, useState } from 'react'
import NewDocument from './components/NewDocument'
import MyDocuments from './components/MyDocuments'
import { Col, Row } from 'antd'
import FeatureCard from './components/FeatureCard'
import { FileText, PenLine, Repeat, Zap,Search } from 'lucide-react'
import DocumentTypes from './components/DocumentTypes'
import EditingTools from './components/EditingTools'
import TrendingTopics from './components/TrendingTopics'
import QuickAccess from './components/QuickAccess'
import styles from './index.less'
import { useAppDispatch } from '@/redux/storeIndex';

function index({ }: any) {

    const [selectedDocType, setSelectedDocType] = useState('年度报告');
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // 当文档变为可见时刷新页面
                localStorage.removeItem('templetsEdit')
                // localStorage.removeItem('templetTitle')
                localStorage.removeItem('templetChildren')
            }
        };

        // 添加事件监听器
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 清理函数 - 当组件卸载时移除事件监听器
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    return (
        <Row gutter={16} >
            <Col span={18}>
                <NewDocument />
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                    <FeatureCard
                        icon={PenLine}
                        title="长文撰写"
                        description="一键生成专业长文"

                    />
                    <FeatureCard
                        icon={Repeat}
                        title="重构文辞"
                        description="重塑语言的魅力"
                    />
                    <FeatureCard
                        icon={FileText}
                        title="快速创作"
                        description="提供丰富的AI工具"

                    />
                    <FeatureCard
                        icon={Zap}
                        title="范文仿写"
                        description="上传范文，轻松创作"
                    />
                    <FeatureCard
                        icon={Search}
                        title="AI搜索"
                        description="人工智能，一键搜索"
                    />
                </div>
                <DocumentTypes
                    selectedType={selectedDocType}
                    onSelectType={setSelectedDocType}
                />
                {/* <EditingTools /> */}
                <TrendingTopics />
            </Col>
            <Col span={6}>
                <MyDocuments />

                <QuickAccess />
            </Col>
        </Row>
    )
}

export default index
