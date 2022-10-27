import React from "react";
import style from "./NamePack.module.css";
import s from "./../PackCard/PackCard.module.css";
import SuperButton from "../../../common/components/superButton/SuperButton";

const NamePack = () => {
  return (
    <div className={style.name_pack_container}>
      <div className={style.content_container}>
        <div className={style.title}>Name Pack</div>
        <div className={style.button_add_new_card}>
          <div className={style.sentence}>
            This is pack empty. Click add new card to fill this pack
          </div>
          <SuperButton title="Add new card" className={s.btn_add_new_pack} />
        </div>
      </div>
    </div>
  );
};

export default NamePack;