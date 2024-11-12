import React from 'react';
import { Users, FileText, Clock } from 'lucide-react';

const Statistics: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">平台数据</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">100,000+</p>
          <p className="text-gray-600">活跃用户</p>
        </div>
        <div className="text-center">
          <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">500,000+</p>
          <p className="text-gray-600">生成文档</p>
        </div>
        <div className="text-center">
          <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">1,000,000+</p>
          <p className="text-gray-600">节省时间（小时）</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;