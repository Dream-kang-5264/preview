import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendingTopics: React.FC = () => {
  const topics = [
    '石油行业安全生产最新规范',
    '新能源与传统石油产业融合趋势',
    '石油勘探技术创新与应用',
    '国际油价走势分析报告',
    '石油企业数字化转型策略'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: '#FAFBFF',marginTop:'30px'}}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <TrendingUp className="h-6 w-6 text-red-500 mr-2" />
        行业热点
      </h2>
      <ul className="space-y-2">
        {topics.map((topic, index) => (
          <li key={index} className="flex items-center">
            <span className="text-blue-600 font-semibold mr-2">#{index + 1}</span>
            <a href="#" className="text-gray-700 hover:text-blue-600">{topic}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;