import React from "react";
import { leftArrow } from "../../Utillities/icons";

function Header({ title, goBack }) {
  return (
    <div className="w-100 AddParticipantsHeader">
      <button style={{ border: "none" }} onClick={goBack}>
        {leftArrow}
      </button>
      <span className="mr-0">{title}</span>
    </div>
  );
}

export default Header;
