
import React from 'react'

// 引入内容区的组件
import ConTent from '@/components/Homes/ConTent/page'
// 引入搜索框
import Search from '@/components/Homes/ConTent/Search/page'
// 引入长文神器组件
import LongTent from '@/components/Homes/ConTent/LongText/page'

function page({ setContent }: any) {
  return (
    <div style={{ width: '100%', background: '#fff', borderRadius: '1vw', }}>
      <ConTent ></ConTent>
      <Search setContent={setContent}></Search>
      <LongTent setContent={setContent}></LongTent>
    </div>
  )
}
export default page




