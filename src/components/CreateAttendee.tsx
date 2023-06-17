import React, { useState } from "react";

import styles from "./mtstyles.module.css";
import { talkApi } from "../hook/apiHelper";
const {
  mainmodal,
  button,
  modalBox,
  input,
  close,
  AllTalksHeader,
  scroll,
  disabled,
  top,
  namelist,
  addManually,
  error,
} = styles;

export default function CreateAttendee({ setAttModal }) {
  const [name, setAttName] = useState("");
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setAttModal(false);
  };

  const handleSubmit = () => {
    console.log({ email, name });

    talkApi({
      method: "POST",
      endpoint: "attendee",
      body: { email, name },
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className={mainmodal}>
      <div className={modalBox}>
        <>
          <div className={top}>
            <h3>Add New Attendee</h3>
            <p className={close} onClick={handleClose}>
              X
            </p>
          </div>
          <input
            className={input}
            placeholder="attendee name"
            type="text"
            value={name}
            onChange={(e) => setAttName(e.target.value)}
          />

          <input
            className={input}
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className={name === "" || email === "" ? disabled : button}
            disabled={name === "" || email === ""}
          >
            Add Attendee
          </button>
        </>
      </div>
    </div>
  );
}
