
import { PageContainer } from '@ant-design/pro-components';

import React, { useEffect, useState } from 'react';
import { history } from 'umi'
import { setComponentsType, sethistoryType, setisAddHistory } from '@/redux/module/LongStore';
import { useAppDispatch } from '@/redux/storeIndex';

import { Search, Book, Plus, Edit, Trash2 } from 'lucide-react';
import OilIndustry from '@/components/IndustryTerms/OilIndustry';
const IndustryTerms: React.FC = () => {
    let dispatch = useAppDispatch()
    useEffect(() => {
        if (history.location.pathname !== '/Addtext') {
            dispatch(setComponentsType([]))
            dispatch(sethistoryType([]))
        }
        dispatch(setisAddHistory(false))
    }, [history])
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [selectedItem, setSelectedItem] = useState<string | null>('石油行业术语库');
    let [contentShow, setContentShow] = useState<any>()
    let MaterialData: any = ['石油行业术语库', ]
    useEffect(() => {
        switch (selectedItem) {
            case '石油行业术语库':
                setContentShow(<OilIndustry />)
                break;
            case '公共素材':
                // setContentShow(<CommonMaterial />)
                break;
            case '金句素材':
                // setContentShow(<GoldenMaterial />)
                break;
            case '外部素材':
                // setContentShow(<ExternalMaterial />)
                break;
            default:
                break;
        }
    }, [selectedItem])

    const categories = ['全部', '勘探', '开发', '炼化', '销售', '管理'];

    const terms = [
        { id: 1, term: '储量', definition: '指在给定时间内，根据地质和工程资料分析，可以从已知油气藏中开采出的石油或天然气的估算量。', category: '勘探' },
        { id: 2, term: '采收率', definition: '指从油气藏中实际开采出的油气量与原始地质储量之比。', category: '开发' },
        { id: 3, term: '裂解', definition: '指在高温下使有机化合物分子断裂成为较小分子的过程。', category: '炼化' },
        { id: 4, term: '原油', definition: '指从地下油藏采出的液态石油，主要由碳氢化合物组成。', category: '销售' },
        { id: 5, term: 'HSE', definition: '健康(Health)、安全(Safety)和环境(Environment)管理体系的简称。', category: '管理' },
    ];

    const filteredTerms = terms.filter(term =>
        (selectedCategory === '全部' || term.category === selectedCategory) &&
        (term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return (
        <PageContainer
            header={{
                title: (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {MaterialData.map((item: string) => (
                            <div
                                key={item}
                                // strong={selectedItem === item}
                                style={{
                                    cursor: 'pointer',
                                    color: selectedItem === item ? '#1677FF' : undefined,
                                    borderBottom: selectedItem === item ? '2px solid #1677FF' : undefined,
                                }}
                                onClick={() => { setSelectedItem(item) }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                ),
            }}
        >
            {contentShow}
            <>

                {/* <h1 className="text-3xl font-bold mb-8">石油行业术语库</h1>

            <div className="mb-6 flex justify-between items-center">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="搜索术语..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    添加新术语
                </button>
            </div>

            <div className="mb-6 flex space-x-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full ${category === selectedCategory
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">术语</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">定义</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTerms.map((term) => (
                            <tr key={term.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{term.term}</td>
                                <td className="px-6 py-4 text-gray-500">{term.definition}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{term.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
            </>
        </PageContainer>
    );
};

export default IndustryTerms
