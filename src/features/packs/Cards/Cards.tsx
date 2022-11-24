import React, { useEffect, useState } from 'react'

import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { AddAndUpdateCardType } from '../../../api/cardAPI'
import ArrowBackTo from '../../../common/components/ArrowBackTo/ArrowBackTo'
import { ModalCard } from '../../../common/components/modal/ModalCard/ModalCard'
import { ModalMain } from '../../../common/components/modal/ModalMain'
import { Pagination } from '../../../common/components/pagination/pagination'
import Search from '../../../common/components/Search/Search'
import { PATH } from '../../../common/routes/const-routes'
import {
  selectorCardPacks,
  selectorCards,
  selectorCardsParams,
  selectorCardsTotalCount,
  selectorIsLogin,
  selectorMaxGrade,
  selectorMinGrade,
  selectorPackDeckCover,
  selectorPackName,
  selectorPackUserId,
  selectorProfileId,
} from '../../../common/selectors/selectors'
import { useAppDispatch, useAppSelector } from '../../../utils/hooks/customHooks'
import { TitleBlockTable } from '../TitleBlockTable/TitleBlockTable'
import style from '../TitleBlockTable/TitleBlockTable.module.css'

import dots from './../../../assets/img/Table/dots.svg'
import {
  addCardTC,
  changeRatingCardTC,
  deleteCardTC,
  getCardsTC,
  updateCardTC,
} from './cards-reducer'
import { CardsTable } from './Cards-Table'
import s from './Cards.module.css'

export const Cards = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const params = useParams<'id'>()
  const cards = useAppSelector(selectorCards)
  const packUserId = useAppSelector(selectorPackUserId)
  const packName = useAppSelector(selectorPackName)
  const minGrade = useAppSelector(selectorMinGrade)
  const maxGrade = useAppSelector(selectorMaxGrade)
  const cardsTotalCount = useAppSelector(selectorCardsTotalCount)
  const profileId = useAppSelector(selectorProfileId)
  const cardsParams = useAppSelector(selectorCardsParams)
  const isLogin = useAppSelector(selectorIsLogin)
  const packDeckCover = useAppSelector(selectorPackDeckCover)

  const [modalActive, setModalActive] = useState<boolean>(false)

  useEffect(() => {
    dispatch(getCardsTC(params.id))
  }, [dispatch])

  const deleteCard = (_id: string, packId: string) => {
    dispatch(deleteCardTC(_id, packId))
  }

  const editCard = (updateCard: AddAndUpdateCardType) => {
    dispatch(updateCardTC(updateCard))
  }

  const setModalActiveHandler = () => {
    setModalActive(true)
  }

  const addNewCard = (card: AddAndUpdateCardType, cardsPack_id: string) => {
    dispatch(addCardTC({ ...card, cardsPack_id }))
  }

  const changeRating = (cardId: string, value: number) => {
    dispatch(changeRatingCardTC({ card_id: cardId, grade: value }))
  }
  const navigateLearnPage = (cardId: string) => {
    sessionStorage.setItem('url', `${PATH.LEARN_PAGE}/${cardId}`)
    sessionStorage.setItem('packId', `${params.id}`)
    navigate(`${PATH.LEARN_PAGE}/${params.id}/${cardId}`)
  }

  if (!isLogin) return <Navigate to={PATH.LOGIN_PAGE} />

  return (
    <div className={style.packs_list_container}>
      <div className={style.table_container}>
        {cards && cards.length ? (
          <>
            <ArrowBackTo />
            <TitleBlockTable
              titlePack={packName as string}
              titleButton={packUserId === profileId ? 'Add new card' : 'Learn to pack'}
              image={<img className={s.dots} src={dots} alt="dots" />}
              deckCoverImg={packDeckCover!}
              //onClick={setModalActiveHandler}
              onClick={() => {
                packUserId === profileId ? setModalActiveHandler() : navigateLearnPage(cards[0]._id)
              }}
              style={style}
            />
            <Search onSearchChange={() => {}} value={''} className={s.search} />
            <CardsTable
              cards={cards}
              userId={profileId}
              minGrade={minGrade}
              maxGrade={maxGrade}
              profileId={profileId}
              deleteHandler={(_id, packId) => deleteCard(_id, packId)}
              editCardHandler={updateCard => editCard(updateCard)}
              changeRating={(cardId, value) => changeRating(cardId, value)}
              navigateLearnPage={cardId => navigateLearnPage(cardId)}
            />
            <Pagination
              pageCount={cardsParams.pageCount}
              currentPage={cardsParams.page}
              totalCount={cardsTotalCount as number}
              setPage={() => () => {}}
              setPageCount={() => () => {}}
              maxPages={cardsParams.max}
            />
          </>
        ) : (
          <>
            <ArrowBackTo />
            <TitleBlockTable
              titlePack={packName as string}
              titleButton={packUserId === profileId ? 'Add new card' : 'Learn to pack'}
              image={<img className={s.dots} src={dots} alt="dots" />}
              onClick={() => {
                packUserId === profileId && setModalActiveHandler()
              }}
              style={style}
            />
          </>
        )}
      </div>
      {modalActive && (
        <ModalMain open={modalActive} setActive={setModalActive}>
          <ModalCard
            question={''}
            answer={''}
            setActive={setModalActive}
            title={'Add New Card'}
            onSubmit={card => addNewCard(card, params.id!)}
          />
        </ModalMain>
      )}
    </div>
  )
}
