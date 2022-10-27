import React, { useEffect } from "react";

import "./App.css";
import { LinearProgress } from "@mui/material";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  CheckEmailPage,
  FriendsCardsPage,
  LoginPage,
  MyPackPage,
  NewPassPage,
  NotPage,
  PackCardsPage,
  ProfilePage,
  RegistrationPage,
  RestorePassPage,
} from "../common/routes/const-routes";
import CheckEmail from "../features/forgot-pass/CheckEmail/CheckEmail";
import CreateNewPassword from "../features/forgot-pass/CreateNewPass/CreateNewPassword";
import { ForgotPass } from "../features/forgot-pass/ForgotPass/ForgotPass";
import Header from "../features/header/Header";
import Login from "../features/login/Login";
import PageNotFound from "../features/page-404/PageNotFound";
import { Profile } from "../features/profile/Profile";
import { authMeTC } from "../features/profile/profile.reducer";
import SignUp from "../features/sign-up/SignUp";
import { useAppDispatch, useAppSelector } from "../utils/hooks/customHooks";

import { RootStateType } from "./store";
import { PackCard } from "../features/packCards/PackCard/PackCard";
import FriendsPack from "../features/packCards/FriendsPack/FriendsPack";
import { MyPack } from "../features/packCards/MyPack/MyPack";

const selectProfile = (state: RootStateType) => state.profile.profile;
const selectStatus = (state: RootStateType) => state.app.status;

function App() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    if (profile === null) {
      dispatch(authMeTC());
    }
  }, []);

  return (
    <>
      <HashRouter>
        <Header />
        {status === "progress" && <LinearProgress sx={{ width: "100%" }} />}
        <Routes>
          <Route path={"*"} element={<Navigate to={NotPage} />} />
          <Route path={"/"} element={<Navigate to={LoginPage} />} />
          <Route path={LoginPage} element={<Login />} />
          <Route path={RegistrationPage} element={<SignUp />} />
          <Route path={ProfilePage} element={<Profile />} />
          <Route path={NotPage} element={<PageNotFound />} />
          <Route path={CheckEmailPage} element={<CheckEmail />} />
          <Route path={RestorePassPage} element={<ForgotPass />} />
          <Route path={NewPassPage} element={<CreateNewPassword />} />
          <Route path={PackCardsPage} element={<PackCard />} />
          <Route path={FriendsCardsPage} element={<FriendsPack />} />
          <Route path={MyPackPage} element={<MyPack />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
