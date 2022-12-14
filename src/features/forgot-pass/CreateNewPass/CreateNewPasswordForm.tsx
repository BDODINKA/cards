import React, { useState } from 'react'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { ReactComponent as Eyes } from '../../../assets/svg/eyes.svg'
import { ReactComponent as HiddenEyes } from '../../../assets/svg/eyes_close.svg'
import { SnackBarType } from '../../../common/components/CustomSnackBar/CustomAlertSnackBar'
import { SuperButton } from '../../../common/components/SuperButton/SuperButton'
import { SuperInput } from '../../../common/components/SuperInputText/SuperInput'
import { Nullable } from '../../../types/Nullable'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { SendNewPasswordFormTC } from '../forgot-password.reducer'

import style from './CreateNewPassword.module.scss'

type PropsType = {
  status: Nullable<SnackBarType>
  token?: string
}

const CreateNewPasswordForm = (props: PropsType) => {
  const dispatch = useAppDispatch()
  const [showPass, setShowPass] = useState<boolean>(false)
  const { token, status } = props

  const typeInput = showPass ? 'text' : 'password'

  const showPassClick = (value: boolean) => {
    setShowPass(value)
  }

  return (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={Yup.object({
        password: Yup.string()
          .required('No password provided.')
          .min(7, 'Password is too short - should be 7 chars minimum.')
          .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
          .max(16, 'Password is too long - should be 16 chars maximum.'),
      })}
      onSubmit={values => {
        dispatch(SendNewPasswordFormTC({ password: values.password, resetPasswordToken: token }))
      }}
    >
      {formik => (
        <form onSubmit={formik.handleSubmit} className={style.card}>
          <h2 className={style.title}>Create new password</h2>
          <div className={style.input_block}>
            <SuperInput
              type={typeInput}
              placeholder={'Password'}
              {...formik.getFieldProps('password')}
              error={formik.touched && formik.errors.password}
              disabled={status === 'progress'}
              className={style.input}
              spanClassName={style.spanError}
            />
            {!showPass ? (
              <Eyes onClick={() => showPassClick(!showPass)} className={style.eyes} />
            ) : (
              <HiddenEyes onClick={() => showPassClick(!showPass)} className={style.eyes} />
            )}
          </div>

          <p className={style.description}>
            Create new password and we will send you further instructions to email
          </p>
          <SuperButton
            type={'submit'}
            disabled={status === 'progress'}
            className={style.btn}
            title={'Create new password'}
          />
        </form>
      )}
    </Formik>
  )
}

export default CreateNewPasswordForm
