import React, { useEffect, useState } from 'react'

import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { CardsPackAddType } from '../../api/cardPacksAPI'
import { ModalMain } from '../../common/components/Modal/ModalMain'
import { ModalsAll } from '../../common/components/Modal/ModalsAll'
import { Pagination } from '../../common/components/Pagination/Pagination'
import { InitValueRangeSlider } from '../../common/constants/packs'
import { maxPaginationPage } from '../../common/constants/pagination'
import { PATH } from '../../common/routes/const-routes'
import {
  selectorCardPacks,
  selectorIsLogin,
  selectorPackParams,
  selectorProfileId,
  selectorPacksTotalCount,
} from '../../common/selectors/selectors'
import { useAppDispatch } from '../../utils/hooks/useAppDispatch'
import { useAppSelector } from '../../utils/hooks/useAppSelector'

import { setPackCardsIdAC } from './Cards/cards-reducer'
import { Filtration } from './Filtration/Filtration'
import {
  addPackTC,
  deletePackTC,
  filterLastUpdateAC,
  filterPageAC,
  filterPageCountAC,
  getPacksTC,
  updatePackTC,
} from './Packs-reducer'
import { TableHeadPacks } from './Table/TableHeadPacks'
import { TitleBlockTable } from './TitleBlockTable/TitleBlockTable'

export const Packs = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const cardPacks = useAppSelector(selectorCardPacks)
  const totalCount = useAppSelector(selectorPacksTotalCount)
  const profileId = useAppSelector(selectorProfileId)
  const isLogin = useAppSelector(selectorIsLogin)
  const params = useAppSelector(selectorPackParams)

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [modalName, setModalName] = useState<'modalCard' | 'modalDelete' | 'modalPack' | ''>('')

  useEffect(() => {
    sessionStorage.setItem('url', location.pathname)
    dispatch(getPacksTC())
  }, [params])

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

  const setOpenModalHandler = () => {
    setOpenModal(true)
    setModalName('modalPack')
  }

  const changeFieldName = (pack: CardsPackAddType, cardId: string) => {
    dispatch(updatePackTC(pack, cardId))
  }

  const addNewPack = (pack: CardsPackAddType) => {
    dispatch(addPackTC(pack))
  }

  const navigateToCards = (packId: string) => {
    dispatch(setPackCardsIdAC(packId))
    sessionStorage.setItem('url', `${PATH.MY_PACK_PAGE}/${packId}`)
    navigate(`${PATH.MY_PACK_PAGE}/${packId}`)
  }

  if (!isLogin) return <Navigate to={PATH.LOGIN_PAGE} />

  return (
    <main>
      <TitleBlockTable
        titlePack="Packs list"
        titleButton="Add new pack"
        onClick={setOpenModalHandler}
      />
      <Filtration
        user_id={profileId}
        initialValueSlider={InitValueRangeSlider}
        paramsId={params.user_id}
      />
      <TableHeadPacks
        packs={cardPacks}
        userId={profileId}
        sort={setLastUpdate}
        deleteHandler={id => deleteMyPack(id)}
        navigateToCards={cardId => navigateToCards(cardId)}
        changeFieldName={(pack, cardId) => changeFieldName(pack, cardId)}
      />

      <Pagination
        pageCount={params.pageCount}
        currentPage={params.page}
        setPage={value => setPage(value)}
        setPageCount={value => setPageCount(value)}
        totalCount={totalCount as number}
        maxPages={maxPaginationPage}
      />
      {modalName !== '' && (
        <ModalMain open={openModal} setOpenModal={setOpenModal}>
          <ModalsAll
            title={{ pack: 'Add New Pack' }}
            setOpenModal={setOpenModal}
            onSubmitPack={pack => addNewPack(pack)}
            text={''}
            deckCover={''}
            nameModal={modalName}
          />
        </ModalMain>
      )}
    </main>
  )
}
