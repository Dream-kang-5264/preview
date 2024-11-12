import React from 'react';
import { PenTool } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <PenTool className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">智笔写作系统</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-gray-600 hover:text-blue-600">写作首页</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-600">对话窗口</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-600">分部素材</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-600">全句素材</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-600">个人素材</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;