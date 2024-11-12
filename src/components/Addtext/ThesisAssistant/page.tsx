import React, { useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
import { setThematiCount, setthemeShow } from '@/redux/module/homeStore'
import { setComponentsType, setoutlineLevel } from '@/redux/module/LongStore';
import { Radio, RadioChangeEvent } from 'antd';
import chatAI from '../../../../public/2.svg'
function Index() {
    let dispatch = useAppDispatch()
    let { ThematiCount } = useAppSelector(state => state.homeReducer)
    let { componentsType, } = useAppSelector(state => state.longReducer)
    let components = JSON.parse(JSON.stringify(componentsType))
    const [value, setValue] = useState(3);
    const inputSpanRef = useRef(null)
    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);

        dispatch(setoutlineLevel(String(e.target.value)));
    };
    return (
        <div style={{ display: 'flex', paddingTop: '1rem', }}>
            <img width={53} height={10} src={chatAI} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#fff' }} />
            <div style={{ width: '30vw', background: '#F7F8FA', marginLeft: '1rem', padding: '.8rem', borderRadius: '1rem' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: '600' }}>长文助手</h1>
                <p>开始创作吧！输入主题和层级，享受为您定制的长文生成体验。</p>
                <div style={{ display: 'flex', marginTop: '.5rem', cursor: 'pointer' }} onClick={() => {
                    let componentType = {
                        type: 'themeType',
                        key: Math.floor(Math.random() * 99999999) + 1
                    }
                    components.push(componentType)
                    // console.log(components);
                    components.forEach((item, index) => {
                        if (item.type === 'themeType') {
                            components.splice(index, 1)
                        }
                    })
                    dispatch(setComponentsType(components))
                    dispatch(setthemeShow(true), dispatch(setThematiCount(ThematiCount + 1)))
                }
                }>
                    {/* <span  ref={inputSpanRef} style={{ display: 'flex', background: '#F3F3F3', padding: '0.2rem .5rem', marginRight: '.5rem', borderRadius: '.5rem' }}><input type="radio" name='一样' id='option' />输入主题生成</span>
                    <span style={{ display: 'flex', background: '#F3F3F3', padding: '0.2rem .5rem', borderRadius: '.5rem' }}><input type="radio" name='一样' />参考范文写作</span> */}

                    <Radio>输入主题生成</Radio>

                </div>
                <Radio.Group onChange={onChange} value={value} style={{marginTop: '10px'}}>
                    <Radio value={2}>
                        二级目录
                    </Radio>
                    <Radio value={3} >
                        三级目录
                    </Radio>
                </Radio.Group>
            </div>
        </div>
    )
}

export default Index
// import React, { useRef, useState } from 'react';
// import { useAppSelector, useAppDispatch } from '@/redux/storeIndex';
// import { setThematiCount, setthemeShow } from '@/redux/module/homeStore';
// import { setComponentsType, setoutlineLevel } from '@/redux/module/LongStore';

// import chatAI from '../../../../public/2.svg';
// import { Radio, RadioChangeEvent } from 'antd';

// function Index() {
//     const dispatch = useAppDispatch();
//     const { ThematiCount } = useAppSelector(state => state.homeReducer);
//     const { componentsType } = useAppSelector(state => state.longReducer);
//     const [selectedOption, setSelectedOption] = useState(''); // State to manage selected option
//     const [radioCheck, setradioCheck] = useState(true)
//     const [radioChecks, setradioChecks] = useState(false)
//     // 大纲层级
//     const handleRadioChange = (event: any) => {
//         // console.log(event.target.value);
//         setradioCheck(true)
//         dispatch(setoutlineLevel(event.target.value));
//     };
//     const handleRadioChanges = (event: any) => {
//         setradioChecks(true)
//         dispatch(setoutlineLevel(event.target.value));
//     }
//     const [value, setValue] = useState('2');

//     const onChange = (e: RadioChangeEvent) => {
//         console.log('radio checked', e.target.value);
//         setValue(e.target.value);

//         dispatch(setoutlineLevel(String(e.target.value)));
//     };
//     const handleOptionChange = (type: any) => {
//         setSelectedOption(type);
//         let componentType = {
//             type: type,
//             key: Math.floor(Math.random() * 99999999) + 1
//         };
//         console.log(componentsType);

//         let textTips = JSON.parse(JSON.stringify(componentsType));
//         textTips.push(componentType)
//         // const updatedComponents = [...componentsType, componentType];
//         dispatch(setComponentsType(textTips));
//         dispatch(setthemeShow(true));
//         dispatch(setThematiCount(ThematiCount + 1));
//     };

//     return (
//         <div style={{ display: 'flex', paddingTop: '10px' }}>
//             <img src={chatAI} alt="Chat AI" width={53} height={53} style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#F7F8FA' }} />
//             <div style={{ width: '30vw', background: '#F7F8FA', marginLeft: '1rem', padding: '.8rem', borderRadius: '1rem', fontSize: '1vw' }}>
//                 <h1 style={{ fontSize: '1.2vw', fontWeight: '600' }}>论文助手</h1>
//                 <p>小橙子可以化身为你的论文助手哦，请选择以下方式</p>
//                 <div style={{ display: 'flex', marginTop: '.5rem', cursor: 'pointer', }}>
//                     <div onClick={() => handleOptionChange('themeType')} style={{ display: 'flex', borderRadius: '.5rem', }}>
//                         {/* <input type="radio" name='option' checked={selectedOption === 'themeType'} readOnly />  */}
//                         <Radio>输入主题生成</Radio>
//                         {/* <span style={{ marginRight: '.3vh' }}> 输入主题生成 </span> */}
//                     </div>


//                     {/* <span onClick={() => handleOptionChange('essayType')} style={{ display: 'flex', background: '#F3F3F3', padding: '0.2rem .5rem', borderRadius: '.5rem' }}>
//                         <input type="radio" name='option' checked={selectedOption === 'essayType'} readOnly />参考范文写作
//                     </span> */}
//                 </div>
//                 <div style={{ display: 'flex', paddingTop: '1vh' }}>

//                     <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//                         {/* <div style={{ paddingRight: '1vh', borderRadius: '1vh' }} >
//                             <span style={{ margin: '0 .5vw' }}>二级目录</span>
//                             <input type="radio" name='options' checked value={'2'} onChange={handleRadioChange} />
//                         </div>

//                         <div style={{  marginLeft: '1vw', paddingRight: '1vh', display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: '1vh' }}>
//                             <span style={{ margin: '0 .5vw' }}>三级目录</span>
//                             <input type="radio" name='options' value={'3'} onChange={handleRadioChange} />
//                         </div> */}
//                         <Radio.Group onChange={onChange} value={value}>
//                             <Radio value={2}>
//                                 二级目录
//                             </Radio>
//                             <Radio value={3}>
//                                 三级目录
//                             </Radio>
//                         </Radio.Group>



//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Index;
