'use client'
import { useRef, useState } from 'react'
import { t } from 'i18next'
import copy from 'copy-to-clipboard'
import s from './index.less'
import Tooltip from './Tooltip'
import { message } from 'antd'

// import { randomString } from '@/utils'

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
export function randomString(length: number) {
    let result = ''
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }
type ICopyBtnProps = {
  value: string
  className?: string
  isPlain?: boolean
}

const CopyBtn = ({
  value,
  className,
  isPlain,
}: ICopyBtnProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const selector = useRef(`copy-tooltip-${randomString(4)}`)

  return (
    <div className={`${className}`}>
      <Tooltip
        selector={selector.current}
        content={(isCopied ? t('appApi.copied') : t('appApi.copy')) as string}
        className='z-10'
      >
        <div
          className={'box-border p-0.3 flex items-center justify-center rounded-md bg-white cursor-pointer'}
          style={!isPlain
            ? {
              boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
            }
            : {background:'#d1c9cb'}
        
          }
          onClick={() => {
            copy(value)
            setIsCopied(true)
            message.success('复制成功')
          }}
        >
          <div className={`w-6 h-6 rounded-md hover:bg-gray-50  ${s.copyIcon} ${isCopied ? s.copied : ''}`}></div>
        </div>
      </Tooltip>
    </div>
  )
}

export default CopyBtn
