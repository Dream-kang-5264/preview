// import React from 'react';
// import { Bookmark, Star, Settings, HelpCircle } from 'lucide-react';
// import { history } from "umi";
// const QuickAccess: React.FC = () => {
//   const quickLinks = [
//     { icon: Bookmark, text: '我的收藏' },
//     { icon: Star, text: '使用教程' },
//     { icon: Settings, text: '账户设置' },
//     { icon: HelpCircle, text: '帮助中心' },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6" style={{ backgroundColor: '#FAFBFF', marginTop: '30px' }}>
//       <h2 className="text-xl font-semibold mb-4">快速访问</h2>
//       <div className="grid grid-cols-2 gap-4 ">
//         {quickLinks.map((link, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300 cursor-pointer"
//             onClick={() => {
//               if (link.text === '账户设置') {
//                 history.push('/IndividualCenter')
//               }
//             }}
//           >
//             <link.icon className="h-6 w-6 text-blue-600 mb-2" />
//             <span className="text-sm text-gray-700">{link.text}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuickAccess;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, HelpCircle } from 'lucide-react';

const QuickAccess: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: Settings,
      text: '账户设置',
      path: '/IndividualCenter',
      description: '管理个人信息、安全设置和偏好',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      icon: HelpCircle,
      text: '帮助中心',
      path: '/HelpCenter',
      description: '获取使用指南和在线支持',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6" style={{ backgroundColor: '#FAFBFF', marginTop: '30px' }}>
      <h2 className="text-xl font-semibold mb-4">快速访问</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 cursor-pointer">
        {quickLinks.map((link, index) => (
          <div
            key={index}
            onClick={() => navigate(link.path)}
            // className={`group relative overflow-hidden ${link.bgColor} ${link.hoverColor} transition-all duration-300 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            className={`group relative overflow-hidden ${link.bgColor} ${link.hoverColor} transition-all duration-300 rounded-lg p-5 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 `}
          >
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <link.icon className="h-8 w-8" />
                <span className="ml-3 text-lg font-semibold">{link.text}</span>
              </div>
              <p className="text-sm text-white/90">{link.description}</p>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full transform rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;