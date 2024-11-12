import React from 'react';
import { AlignLeft, Bold, Italic, List, Table, Image, FileText, Search, RotateCcw, Zap, Book, CheckSquare, BarChart } from 'lucide-react';

const EditingTools: React.FC = () => {
  const toolGroups = [
    {
      title: "基础编辑",
      tools: [
        { icon: AlignLeft, name: '格式' },
        { icon: Bold, name: '字体' },
        { icon: Italic, name: '斜体' },
        { icon: List, name: '列表' },
        { icon: Table, name: '表格' },
        { icon: Image, name: '图片' },
      ]
    },
    {
      title: "智能辅助",
      tools: [
        { icon: Zap, name: 'AI助手' },
        { icon: Book, name: '术语库' },
        { icon: CheckSquare, name: '格式检查' },
        { icon: Search, name: '智能搜索' },
      ]
    },
    {
      title: "高级功能",
      tools: [
        { icon: FileText, name: '全文分析' },
        { icon: RotateCcw, name: '版本历史' },
        { icon: BarChart, name: '数据可视化' },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: '#FAFBFF',marginTop:'30px'}}>
      <h2 className="text-xl font-semibold mb-4">编辑工具</h2>
      <div className="space-y-6">
        {toolGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-lg font-medium mb-3 text-gray-700">{group.title}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {group.tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition duration-300 cursor-pointer">
                  <tool.icon className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-sm text-gray-700 text-center">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditingTools;