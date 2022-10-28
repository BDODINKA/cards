import { AxiosError } from 'axios'

import { signUpAPI, SignUpUserType } from '../../api/signUpAPI'
import { setAppErrorAC, setAppStatusAC } from '../../app/app-reducer'
import { AppThunk } from '../../types/HooksTypes'
import { ServerError } from '../../utils/ServerErrorHandler'

const initialState = {
  isSignUp: false,
}

export type SignUpType = typeof initialState

export const signUpReducer = (
  state: SignUpType = initialState,
  action: SignUpActionsType
): SignUpType => {
  switch (action.type) {
    case 'sign-up/SET-IS-SIGN-UP':
      return { ...state, isSignUp: action.isSignUp }
    default:
      return state
  }
}

export type SignUpActionsType = ReturnType<typeof setIsSignUpAC>

export const setIsSignUpAC = (isSignUp: boolean) => {
  return { type: 'sign-up/SET-IS-SIGN-UP', isSignUp } as const
}

export const signUpTC =
  (data: SignUpUserType): AppThunk =>
  dispatch => {
    dispatch(setAppStatusAC('progress'))
    signUpAPI
      .signUp(data)
      .then(() => {
        dispatch(setIsSignUpAC(true))
        dispatch(setAppStatusAC('success'))
      })
      .catch((reason: AxiosError<{ error: string }>) => {
        if (reason.response?.data.error) {
          ServerError<string>(reason.response.data.error, setAppErrorAC, dispatch)
          dispatch(setAppStatusAC('error'))
        } else {
          ServerError<string>(reason.message, setAppErrorAC, dispatch)
          dispatch(setAppStatusAC('error'))
        }
      })

    /*.catch((e: AxiosError) => {
        const error = e.response ? (e.response.data as { error: string }).error : e.message

        dispatch(setAppErrorAC(error))
        dispatch(setAppStatusAC('success'))
      })*/
  }
