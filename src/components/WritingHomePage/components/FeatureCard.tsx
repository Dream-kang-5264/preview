import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useAppDispatch } from '@/redux/storeIndex';
import { setDecordId, setLongtitle, setComponentsType, sethistoryDecordId, sethistoryType, setoutlineLevel, setisAddHistory } from '@/redux/module/LongStore'
import { setthemeShow, setDefaulText, setLoginShow, setIndex } from "@/redux/module/homeStore";
import { message } from 'antd'
import { history } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { getCreateRecord } from '@/api/outline';
import { sethomeToolShow } from '@/redux/module/firstDraftStore';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;

}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  let dispatch = useAppDispatch()

  let handleFeatureCardClick = async () => {
    switch (title) {
      case '长文撰写':
        dispatch(setDefaulText(true))
        dispatch(setLongtitle(1))
        dispatch(setComponentsType([]))
        dispatch(sethistoryType([]))
        dispatch(setoutlineLevel('3'))
        dispatch(setthemeShow(false))
        dispatch(sethistoryDecordId(''))
        dispatch(setisAddHistory(false))
        const loginTime = Number(localStorage.getItem('loginTime'));
        const tokenTime = Number(localStorage.getItem('tokenTime'));
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenTime < currentTime - loginTime) {

          message.error('登录超时，请重新登录');
          dispatch(setLoginShow(true));
          history.push('/login')
          return
        }

        let { data } = await getCreateRecord()
        dispatch(setDecordId(data.chatId))
        history.push('/Addtext')
        dispatch(setIndex(1))
        setTimeout(() => {
          dispatch(setDefaulText(false))
        }, 1000)

        break;
      case '重构文辞':
        dispatch(setisAddHistory(false))
        dispatch(setDefaulText(true))
        dispatch(setComponentsType([]))
        dispatch(setthemeShow(false))
        dispatch(sethistoryType([]))
        dispatch(setoutlineLevel('3'))
        dispatch(sethistoryDecordId(''))
        dispatch(setLongtitle(2))
        let res = await getCreateRecord()
        dispatch(setDecordId(res.data.chatId))
        history.push('/Addtext')
        // setContent(<Addtext></Addtext>)
        dispatch(setIndex(1))
        setTimeout(() => {
          dispatch(setDefaulText(false))
        }, 1000)
        break;
      case '范文仿写':
        dispatch(setisAddHistory(false))
        dispatch(setDefaulText(true))
        dispatch(setComponentsType([]))
        dispatch(setthemeShow(false))
        dispatch(sethistoryType([]))
        dispatch(setoutlineLevel('3'))
        dispatch(sethistoryDecordId(''))
        dispatch(setLongtitle(3))
        let ress = await getCreateRecord()
        dispatch(setDecordId(ress.data.chatId))
        history.push('/Addtext')
        // setContent(<Addtext></Addtext>)
        dispatch(setIndex(1))
        setTimeout(() => {
          dispatch(setDefaulText(false))
        }, 1000)
        break;
      case '快速创作':
        // dispatch(sethomeToolShow(true))
        const id = uuidv4();
        window.open(`/LongTexts/${id}`, '_blank');
        localStorage.setItem('open', true);
        break;
      case 'AI搜索':
        window.open(`/Aisearch`, '_blank');
        break
      default:
        break;
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center" style={{ backgroundColor: '#FAFBFF', cursor: 'pointer' }}
      onClick={handleFeatureCardClick}
    >
      <Icon className="h-12 w-12 text-blue-600 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;

function useSate(arg0: boolean): [any, any] {
  throw new Error('Function not implemented.');
}
