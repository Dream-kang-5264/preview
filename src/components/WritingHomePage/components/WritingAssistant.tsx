import React, { useState } from 'react';
import { Send } from 'lucide-react';

const WritingAssistant: React.FC = () => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission logic here
    console.log('Submitted:', input);
    setInput('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: '#FAFBFF'}}>
      <h2 className="text-xl font-semibold mb-4">写长文神器</h2>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="今天需要我做些什么？shift+enter换行"
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default WritingAssistant;