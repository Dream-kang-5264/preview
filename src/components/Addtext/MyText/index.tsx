import React from 'react'
import uesrImg from '../../../../public/user.png'

function Index(props: any) {
  let { MyText } = props

  return (
    <div style={{ display: 'flex', paddingTop: '10px' }}>
       <img width={53} height={10} src={uesrImg} alt="" style={{ borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#fff' }} />
      {/* <img style={{ width: '2.5rem', height: '2rem', borderRadius: '50%' }} src="https://himg.bdimg.com/sys/portraitn/item/public.1.f683e17.hgUVWvob8qL8hdTJ7BDgaQ" alt="" /> */}
      <div style={{ padding: '1vw', background: '#F7F8FA', marginLeft: '1rem', borderRadius: '.7rem',fontSize:'2vh' }}>
        {MyText.content ? MyText.content : MyText}
      </div>

    </div>
  )
}

export default Index
