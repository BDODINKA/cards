import teacher from "../../../assets/img/Table/teacher.svg";
import edit from "../../../assets/img/Table/Edit.svg";
import remove from "../../../assets/img/Table/Delete.svg";
import React from "react";

export const MyActionsButton = () => {
  return (
    <>
      <div>
        <img src={teacher} alt="teacher" />
      </div>
      <div>
        <img src={edit} alt="edit" />
      </div>
      <div>
        <img src={remove} alt="remove" />
      </div>
    </>
  );
};
