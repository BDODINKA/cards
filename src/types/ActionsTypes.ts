import { AppActionsType } from '../app/app-reducer'
import { ForgotActionsType } from '../features/forgot-pass/forgot-password.reducer'
import { LoginActionType } from '../features/login/login-reducer'
import { CardActionsType } from '../features/packs/Cards/cards-reducer'
import { LearnActionsType } from '../features/packs/Learn/learn-reducer'
import { CardPacksActionsType } from '../features/packs/Packs-reducer'
import { ProfileActionType } from '../features/profile/profileReducer'
import { SignUpActionsType } from '../features/sign-up/signUpReducer'

export type ActionsType =
  | LoginActionType
  | ProfileActionType
  | SignUpActionsType
  | ForgotActionsType
  | AppActionsType
  | CardPacksActionsType
  | CardActionsType
  | LearnActionsType
