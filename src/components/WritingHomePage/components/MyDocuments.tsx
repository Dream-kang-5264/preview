import React, { useEffect, useState } from 'react';
import { File, ChevronRight } from 'lucide-react';
import { userFilesList } from '@/api/longText';
import styles from './index.less'
import { CopyOutlined } from '@ant-design/icons';
import { history } from 'umi';
const MyDocuments: React.FC = () => {

  let [fileList, setFileList] = useState([])
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 当文档变为可见时刷新页面
        getFileList()
      }
    };

    // 添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数 - 当组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 获取附件列表
  let getFileList = () => {
    userFilesList().then((res) => {
      if (res.data.status.code === 200) setFileList(res.data.data.splice(0, 5))

    }).catch((err) => {
      console.log(err)
    })
  }
  useEffect(() => {
    getFileList()

  }, [])
  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: '#FAFBFF' }}>
      <h2 className="text-xl font-semibold mb-4">我的文档</h2>
      <ul className="space-y-3">
        {fileList.map((doc, index) => (
          <li key={index} className="flex items-center justify-between overflow-hidden">
            <div className="flex items-center flex-grow overflow-hidden">
              <CopyOutlined style={{ fontSize: '15px', color: '#1677FF', marginRight: '10px' }} />
              <span className={`text-gray-800 ${styles.fileTitle} truncate`}>{doc.title}</span>
            </div>
            <span className="text-sm text-gray-400 whitespace-nowrap  ">{doc.created_at.split(" ")[0]}</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center" style={{ backgroundColor: '#1677FF' }}
        onClick={() => {
          history.push('/File')
        }}
      >
        查看全部文档
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default MyDocuments;