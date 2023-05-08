import React from "react";
import { rightArrow } from "../Utillities/icons";

function ButtonGroupForm(isNewGroupBtnClicked, setIsNewGroupBtnClicked) {
  return (
    <div style={{"padding-left":"50%"}}>
      <button className="arrow"
        onClick={() => {
          !isNewGroupBtnClicked && setIsNewGroupBtnClicked(true);
        }}
      >
        {rightArrow}
      </button>
    </div>
  );
}

export default ButtonGroupForm;
