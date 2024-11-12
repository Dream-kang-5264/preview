import React from 'react';
import { AlertCircle } from 'lucide-react';

const TopBanner: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white py-3" style={{ backgroundColor: '#FAFBFF'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm font-medium">新功能上线：AI辅助石油行业专业术语优化，提升公文质量！</p>
        </div>
        <button className="text-sm font-medium underline">了解更多</button>
      </div>
    </div>
  );
};

export default TopBanner;