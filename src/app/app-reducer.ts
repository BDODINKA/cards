import { SnackBarType } from '../common/components/CustomSnackBar/CustomAlertSnackBar'
import { Nullable } from '../types/Nullable'

export type AppInitStateType = typeof AppInitState

const AppInitState = {
  status: null as Nullable<SnackBarType>,
  error: null as Nullable<string>,
}

export const appReducer = (
  state: AppInitStateType = AppInitState,
  action: ActionsType
): AppInitStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status }
    case 'APP/SET-ERROR':
      return { ...state, error: action.error }
    default:
      return state
  }
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export const setAppStatusAC = (status: SnackBarType) => {
  return { type: 'APP/SET-STATUS', status } as const
}
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export const setAppErrorAC = (error: Nullable<string>) => {
  return { type: 'APP/SET-ERROR', error } as const
}

type ActionsType = SetAppStatusActionType | SetAppErrorActionType
