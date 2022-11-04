import React, { useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { Pagination } from '../../common/components/pagination/pagination'
import { InitValueRangeSlider } from '../../common/constants/packsCard'
import { maxPaginationPage } from '../../common/constants/pagination'
import { PATH } from '../../common/routes/const-routes'
import {
  selectorCardPacks,
  selectorIsLogin,
  selectorPackParams,
  selectorProfileId,
  selectorPacksTotalCount,
} from '../../common/selectors/selectors'
import { useAppDispatch, useAppSelector } from '../../utils/hooks/customHooks'
import { ModalMain } from '../modal/ModalMain'
import { ModalPack } from '../modal/ModalPack/ModalPack'

import {
  addPackTC,
  deletePackTC,
  filterLastUpdateAC,
  filterPageAC,
  filterPageCountAC,
  getPacksTC,
  updatePackTC,
} from './cardPacks-reducer'
import style from './CardPacks.module.css'
import { Filtration } from './Filtration/Filtration'
import { setPackCardsIdAC } from './MyPack/my-pack-reducer'
import { TablePackCard } from './Table/TablePackCard'
import { TitleAndButtonPack } from './TitleAndButtonPack'

export const CardPacks = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cardPacks = useAppSelector(selectorCardPacks)
  const totalCount = useAppSelector(selectorPacksTotalCount)
  const profileId = useAppSelector(selectorProfileId)
  const isLogin = useAppSelector(selectorIsLogin)
  const params = useAppSelector(selectorPackParams)

  const [modalActive, setModalActive] = useState<boolean>(false)

  useEffect(() => {
    if (!isLogin) {
      navigate(PATH.LOGIN_PAGE)
    } else {
      sessionStorage.setItem('url', location.pathname)
      dispatch(getPacksTC())
    }
  }, [isLogin, params])

  const setPage = (value: number) => {
    dispatch(filterPageAC(value))
  }

  const setPageCount = (value: number) => {
    dispatch(filterPageCountAC(value))
  }

  const setLastUpdate = (value: boolean) => {
    const update = value ? '0updated' : '1updated'

    dispatch(filterLastUpdateAC(update))
  }

  const deleteMyPack = (id: string) => {
    dispatch(deletePackTC(id))
  }

  const setModalActiveHandler = () => {
    setModalActive(true)
  }

  const changeFieldName = (text: string, deckCover: string, privates: boolean, cardId: string) => {
    dispatch(updatePackTC(text, deckCover, privates, cardId))
  }

  const addNewPack = (text: string, deckCover: string, privates: boolean) => {
    dispatch(addPackTC(text, deckCover, privates))
  }

  const navigateToCards = (cardId: string) => {
    dispatch(setPackCardsIdAC(cardId))
    sessionStorage.setItem('url', `${PATH.MY_PACK_PAGE}/${cardId}`)
    navigate(`${PATH.MY_PACK_PAGE}/${cardId}`)
  }

  return (
    <div className={style.main}>
      <div className={style.container}>
        <div className={style.table_container}>
          <TitleAndButtonPack
            titlePack="Packs list"
            titleButton="Add new pack"
            onClick={setModalActiveHandler}
          />

          <Filtration
            user_id={profileId}
            initialValueSlider={InitValueRangeSlider}
            paramsId={params.user_id}
          />
          <TablePackCard
            cards={cardPacks}
            userId={profileId}
            sort={setLastUpdate}
            deleteHandler={id => deleteMyPack(id)}
            navigateToCards={cardId => navigateToCards(cardId)}
            changeFieldName={(text, deckCover, privates, cardId) =>
              changeFieldName(text, deckCover, privates, cardId)
            }
          />
          <Pagination
            pageCount={params.pageCount}
            currentPage={params.page}
            setPage={value => setPage(value)}
            setPageCount={value => setPageCount(value)}
            totalCount={totalCount as number}
            maxPages={maxPaginationPage}
          />
        </div>
        <ModalMain active={modalActive} setActive={setModalActive}>
          <ModalPack
            setActive={setModalActive}
            title={'Add New Pack'}
            onSubmit={(text, deckCover, privates) => addNewPack(text, deckCover, privates)}
            text={''}
          />
        </ModalMain>
      </div>
    </div>
  )
}
