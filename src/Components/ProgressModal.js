import React,{useState} from "react";
import "./ProgressModal.css";

const ProgressModal=()=> {
  return (
    <div className="progress">
  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}><b>Compiling...</b></div>
</div>
  );
}

export default ProgressModal;