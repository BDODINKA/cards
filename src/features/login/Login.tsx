import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Wrapper } from '../../common/components/Wrapper/Wrapper'
import { PATH } from '../../common/routes/const-routes'
import { selectorIsLogin } from '../../common/selectors/selectors'
import { useAppSelector } from '../../utils/hooks/useAppSelector'

import style from './login.module.scss'
import { SignInForm } from './SignInForm'

export const Login = () => {
  const isLoggedIn = useAppSelector(selectorIsLogin)
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      const url = sessionStorage.getItem('url')

      navigate(url ? url : PATH.PACK_CARDS_PAGE)
    }
  }, [isLoggedIn])

  return (
    <Wrapper className={style.login__container}>
      <SignInForm />
    </Wrapper>
  )
}
