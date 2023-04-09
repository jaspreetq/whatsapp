import React from "react";
import { rightArrow } from "../Utillities/icons";

function ButtonGroupForm(isNewGroupBtnClicked, setIsNewGroupBtnClicked) {
  return (
    <div>
      <button
        onClick={() => {
          if (isNewGroupBtnClicked) {
            console.log("isNewGroupBtnClicked ", isNewGroupBtnClicked);
          } else setIsNewGroupBtnClicked(true);
        }}
      >
        {rightArrow}
      </button>
    </div>
  );
}

export default ButtonGroupForm;
