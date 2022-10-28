import { AxiosError } from 'axios'
import { Dispatch } from 'redux'

import { cardPacksAPI, CardPacksResponceType, PacksParamsType } from '../../api/cardPacksAPI'
import { setAppErrorAC, setAppStatusAC } from '../../app/app-reducer'
import { RootStateType } from '../../app/store'
import { AppThunk } from '../../types/HooksTypes'
import { ServerError } from '../../utils/ServerErrorHandler'

type InitialStateType = typeof initialState
const initialState = {} as CardPacksResponceType

export type CardPacksActionsType =
  | ReturnType<typeof setPacksAC>
  | ReturnType<typeof addPackAC>
  | ReturnType<typeof deletePackAC>
  | ReturnType<typeof updatePackAC>
  | ReturnType<typeof filterPackAC>

export const cardPacksReducer = (
  state = initialState,
  action: CardPacksActionsType
): InitialStateType => {
  switch (action.type) {
    case 'CRUD/SET-PACKS': {
      return { ...action.cardPacks }
    }
    /* case 'CRUD/ADD-PACKS': {
      return { ...state, cardPacks: [action.packs.cardPacks, ...state.cardPacks] }
    }*/
    case 'CARD-PACKS/FILTER': {
      return { ...action.packsCard }
    }
    default:
      return state
  }
}

export const setPacksAC = (cardPacks: CardPacksResponceType) => {
  return { type: 'CRUD/SET-PACKS', cardPacks } as const
}
export const addPackAC = (packs: CardPacksResponceType) => {
  return { type: 'CRUD/ADD-PACKS', packs } as const
}
export const deletePackAC = (id: string) => {
  return { type: 'CRUD/DELETE-PACKS', id } as const
}
export const updatePackAC = (packsCard: CardPacksResponceType) => {
  return { type: 'CRUD/UPDATE-PACKS', packsCard } as const
}

export const filterPackAC = (packsCard: CardPacksResponceType) => {
  return { type: 'CARD-PACKS/FILTER', packsCard } as const
}

export const getPacksTC = (): AppThunk => dispatch => {
  cardPacksAPI.getPacks().then(res => {
    dispatch(setPacksAC(res.data))
  })
}

export const addPackTC =
  (packName: string, deckCover: string, isPrivate: boolean): AppThunk =>
  dispatch => {
    dispatch(setAppStatusAC('progress'))
    cardPacksAPI
      .addPack(packName, deckCover, isPrivate)
      .then(res => {
        dispatch(getPacksTC())
        dispatch(setAppStatusAC('success'))
        console.log(res)
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
  }

export const deletePackTC = (): AppThunk => dispatch => {
  dispatch(setAppStatusAC('progress'))
  cardPacksAPI
    .deletePack()
    .then(res => {
      dispatch(getPacksTC())
      dispatch(setAppStatusAC('success'))
      console.log(res)
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
}

export const updatePackTC =
  (cardsPack: CardPacksResponceType): AppThunk =>
  dispatch => {
    cardPacksAPI.updatePack(cardsPack).then(res => {
      console.log(res)
    })
  }

export const filterPackTC =
  (filter?: PacksParamsType): AppThunk =>
  (dispatch, getState: () => RootStateType) => {
    const filters: PacksParamsType = {
      packName: filter && filter.packName,
      min: (filter && filter.min) || getState().cardPacks.minCardsCount,
      max: (filter && filter.max) || getState().cardPacks.maxCardsCount,
      sortPacks: filter && filter.sortPacks,
      page: (filter && filter.page) || getState().cardPacks.page,
      pageCount: (filter && filter.pageCount) || getState().cardPacks.pageCount,
      user_id: filter && filter.user_id,
      block: filter && filter.block,
    }

    // console.log(filters.pageCount)
    console.log(getState().cardPacks.pageCount)
    dispatch(setAppStatusAC('progress'))
    cardPacksAPI
      .filterPacks(filters)
      .then(res => {
        if (res.data.cardPacks.length) {
          console.log(res.data)
          dispatch(filterPackAC(res.data))
          dispatch(setAppStatusAC('success'))
        } else {
          dispatch(setAppStatusAC('warning'))
          dispatch(setAppErrorAC('Current Pack not found '))
        }
      })
      .catch((error: AxiosError) => {
        dispatch(setAppStatusAC('error'))
        ServerError(error.message, setAppErrorAC, dispatch)
      })
  }
