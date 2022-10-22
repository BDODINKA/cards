import { AxiosError } from 'axios'

import { authAPI, LoginFieldsType } from '../../api/authAPI'
import { SnackBarType } from '../../common/components/CustomSnackBar/CustomAlertSnackBar'
import { AppThunk } from '../../types/HooksTypes'
import { Nullable } from '../../types/Nullable'
import { setProfileAC } from '../profile/profile.reducer'

const AUTH_LOGIN = 'AUTH/LOGIN'
const SET_ERROR = 'AUTH/SET_ERROR'
const SET_STATUS = 'AUTH/SET-STATUS'

const initState = {
  isLoggedIn: false,
  error: null as Nullable<string>,
  status: null as Nullable<SnackBarType>,
}

export type LoginActionType =
  | ReturnType<typeof loginAC>
  | ReturnType<typeof setErrorAC>
  | ReturnType<typeof setStatusAC>

type InitialStateType = typeof initState

export const loginAC = (isLoggedIn: boolean) => ({ type: AUTH_LOGIN, isLoggedIn } as const)
export const setErrorAC = (error: string | null) => ({ type: SET_ERROR, error } as const)
export const setStatusAC = (status: Nullable<SnackBarType>) =>
  ({ type: SET_STATUS, status } as const)

export const loginReducer = (
  state: InitialStateType = initState,
  action: LoginActionType
): InitialStateType => {
  switch (action.type) {
    case AUTH_LOGIN:
      return { ...state, isLoggedIn: action.isLoggedIn }
    case SET_ERROR:
      return { ...state, error: action.error }
    case SET_STATUS: {
      return { ...state, status: action.status }
    }
    default:
      return state
  }
}

export const loginTC =
  (data: LoginFieldsType): AppThunk =>
  dispatch => {
    dispatch(setStatusAC('progress'))
    authAPI
      .login(data)
      .then(res => {
        dispatch(setStatusAC('success'))
        dispatch(loginAC(true))
        dispatch(setProfileAC(res.data))
      })
      .catch((err: AxiosError) => {
        const error = err.response ? (err.response.data as { error: string }).error : err.message

        dispatch(setErrorAC(error))
        dispatch(setStatusAC('error'))
      })
  }