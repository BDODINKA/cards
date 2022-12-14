import React, { MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react'

import { createPortal } from 'react-dom'

import style from './ModalMain.module.scss'

type PropsType = {
  children: React.ReactNode
  setOpenModal: (setOpenModal: boolean) => void
  open: boolean
}

export const ModalMain = (props: PropsType) => {
  const ref = useRef() as MutableRefObject<HTMLDivElement>
  const [container, setContainer] = useState(undefined)

  useEffect(() => {
    setContainer(document.querySelector('#modal') as SetStateAction<any>)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.style.opacity = '1'
      }
    }, 0)
  }, [props.open])

  const setActive = () => {
    ref.current.style.opacity = '0'
    setTimeout(() => {
      props.setOpenModal(false)
    }, 1000)
  }

  if (!props.open || !props.children || !container) return null

  return (
    <>
      {createPortal(
        <div
          ref={ref}
          className={props.open ? `${style.modal} ${style.modal__active}` : style.modal}
          onClick={setActive}
          id={'overlay'}
        >
          <div
            className={
              props.open
                ? `${style.modal__content_active} ${style.modal__content}`
                : style.modal__content
            }
            onClick={e => e.stopPropagation()}
          >
            {props.children}
          </div>
        </div>,
        container
      )}
    </>
  )
}
