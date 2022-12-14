import { AxiosError } from 'axios'

import {
  CardPacks,
  cardPacksAPI,
  CardsPackAddType,
  PacksParamsType,
  ResponseCardPacksType,
} from '../../api/cardPacksAPI'
import { setAppErrorAC, setAppStatusAC } from '../../app/app-reducer'
import { AppThunk } from '../../types/HooksTypes'
import { Nullable } from '../../types/Nullable'
import { ServerError } from '../../utils/ServerErrorHandler'

import { setDeckCoverAC, setPackNameAC } from './Cards/cards-reducer'

type PacksStateType = typeof packsState

const packsState = {
  cardPacks: null as Nullable<CardPacks[]>,
  cardPacksTotalCount: null as Nullable<number>,
  params: {
    packName: null as Nullable<string>,
    min: 0,
    max: 52,
    sortPacks: null as Nullable<string>,
    page: 1,
    pageCount: 10,
    user_id: null as Nullable<string>,
    block: null as Nullable<boolean>,
  },
}

export type CardPacksActionsType =
  | ReturnType<typeof setPacksAC>
  | ReturnType<typeof setUserIdAC>
  | ReturnType<typeof filterPageAC>
  | ReturnType<typeof filterPageCountAC>
  | ReturnType<typeof filterLastUpdateAC>
  | ReturnType<typeof filterPackNameAC>
  | ReturnType<typeof filterRangeSliderAC>
  | ReturnType<typeof filterResetAC>

export const packsReducer = (
  state: PacksStateType = packsState,
  action: CardPacksActionsType
): PacksStateType => {
  switch (action.type) {
    case 'PACKS/SET-PACKS': {
      return {
        ...state,
        cardPacks: action.cardPacks.cardPacks,
        cardPacksTotalCount: action.cardPacks.cardPacksTotalCount,
      }
    }

    case 'PACKS/SET-FILTER-PACK-NAME': {
      return { ...state, params: { ...state.params, packName: action.value } }
    }

    case 'PACKS/SET-FILTER-PAGE': {
      return { ...state, params: { ...state.params, page: action.value } }
    }

    case 'PACKS/SET-FILTER-PAGE-COUNT': {
      return { ...state, params: { ...state.params, pageCount: action.value } }
    }

    case 'PACKS/SET-FILTER-RANGE-SLIDER': {
      return { ...state, params: { ...state.params, min: action.value[0], max: action.value[1] } }
    }

    case 'PACKS/SET-FILTER-LAST-UPDATE': {
      return { ...state, params: { ...state.params, sortPacks: action.value } }
    }

    case 'PACKS/SET-USER-ID': {
      return { ...state, params: { ...state.params, user_id: action.value } }
    }

    case 'PACKS/SET-RESET-FILTER': {
      return { ...state, params: { ...state.params, min: 0, max: 52 } }
    }

    default:
      return state
  }
}

export const setPacksAC = (cardPacks: ResponseCardPacksType) => {
  return { type: 'PACKS/SET-PACKS', cardPacks } as const
}

export const filterPageAC = (value: number) => {
  return { type: 'PACKS/SET-FILTER-PAGE', value } as const
}

export const filterPageCountAC = (value: number) => {
  return { type: 'PACKS/SET-FILTER-PAGE-COUNT', value } as const
}

export const filterLastUpdateAC = (value: string) => {
  return { type: 'PACKS/SET-FILTER-LAST-UPDATE', value } as const
}

export const filterPackNameAC = (value: string) => {
  return { type: 'PACKS/SET-FILTER-PACK-NAME', value } as const
}

export const filterRangeSliderAC = (value: number[]) => {
  return { type: 'PACKS/SET-FILTER-RANGE-SLIDER', value } as const
}

export const setUserIdAC = (value: Nullable<string>) => {
  return { type: 'PACKS/SET-USER-ID', value } as const
}

export const filterResetAC = () => {
  return { type: 'PACKS/SET-RESET-FILTER' } as const
}

export const getPacksTC = (): AppThunk => (dispatch, getState) => {
  dispatch(setAppStatusAC('progress'))

  const params = getState().packs.params

  cardPacksAPI
    .getPacks(params as PacksParamsType)
    .then(res => {
      if (res.data.cardPacks.length) {
        dispatch(setPacksAC(res.data))
        dispatch(setAppStatusAC(null))
      } else {
        dispatch(setPacksAC(res.data))
        dispatch(setAppStatusAC('warning'))
        dispatch(setAppErrorAC('Current Pack not found '))
      }
    })
    .catch((error: AxiosError) => {
      dispatch(setAppStatusAC('error'))
      ServerError(error.message, setAppErrorAC, dispatch)
    })
}

export const addPackTC =
  (pack: CardsPackAddType): AppThunk =>
  dispatch => {
    dispatch(setAppStatusAC('progress'))
    cardPacksAPI
      .addPack(pack)
      .then(() => {
        dispatch(getPacksTC())
        dispatch(setAppStatusAC('success'))
        dispatch(setAppErrorAC('Pack added'))
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

export const deletePackTC =
  (id: string): AppThunk =>
  dispatch => {
    dispatch(setAppStatusAC('progress'))
    cardPacksAPI
      .deletePack(id)
      .then(() => {
        dispatch(getPacksTC())
        dispatch(setAppStatusAC('success'))
        dispatch(setAppErrorAC('Delete success'))
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
  (pack: CardsPackAddType, cardId: string): AppThunk =>
  dispatch => {
    dispatch(setAppStatusAC('progress'))
    cardPacksAPI
      .updatePack({ ...pack, _id: cardId })
      .then(res => {
        dispatch(getPacksTC())
        dispatch(setPackNameAC(pack.name))
        dispatch(setDeckCoverAC(pack.deckCover))
        dispatch(setAppStatusAC('success'))
        dispatch(setAppErrorAC('Pack updated'))
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
