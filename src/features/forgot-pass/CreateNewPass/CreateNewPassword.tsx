import React from 'react'

import { Navigate, useParams } from 'react-router-dom'

import { RootStateType } from '../../../app/store'
import { PATH } from '../../../common/routes/const-routes'
import { useAppSelector } from '../../../utils/hooks/customHooks'

import style from './CreateNewPassword.module.css'
import CreateNewPasswordForm from './CreateNewPasswordForm'

const selectStatus = (state: RootStateType) => state.app.status

const CreateNewPassword = () => {
  const { token } = useParams()
  const status = useAppSelector(selectStatus)

  if (status === 'success') return <Navigate to={PATH.LOGIN_PAGE} />

  return (
    <div className={style.container}>
      <CreateNewPasswordForm status={status} token={token} />
    </div>
  )
}

export default CreateNewPassword
