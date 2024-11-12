import React from 'react';
import { PenTool, Home, MessageSquare, FileText, Book, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-white shadow-md w-56 min-h-screen">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <PenTool className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-800">智笔智能写作系统</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded hover:bg-gray-100">
                <Home className="h-5 w-5 mr-3" />
                首页
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded hover:bg-gray-100">
                <MessageSquare className="h-5 w-5 mr-3" />
                智能助手
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded hover:bg-gray-100">
                <FileText className="h-5 w-5 mr-3" />
                公文模板
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded hover:bg-gray-100">
                <Book className="h-5 w-5 mr-3" />
                行业术语库
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded hover:bg-gray-100">
                <User className="h-5 w-5 mr-3" />
                个人中心
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;