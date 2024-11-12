import React from 'react';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
const NewDocument: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8" style={{ backgroundColor: '#FAFBFF' }}>
      <h2 className="text-xl font-semibold mb-4">新建文档</h2>
      <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center" style={{ backgroundColor: '#1677FF'}} onClick={() => {
        const id = uuidv4();
        window.open(`/LongTexts/${id}`, '_blank');
      }} >
        <Plus className="h-5 w-5 mr-2" />
        创建新文档
      </button>
    </div>
  );
};

export default NewDocument;