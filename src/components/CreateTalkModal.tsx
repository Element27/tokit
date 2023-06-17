import { talkApi } from "../hook/apiHelper";
import styles from "./mtstyles.module.css";
import { useState, useEffect } from "react";

export default function CreateTalkModal({ setModal }) {
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

  // const attendees = ["adrian", "Meridith"];

  const [page, setpage] = useState(1);
  const [talk, setTalk] = useState("");
  const [talkError, setTalkError] = useState(false);
  const [goer, setGoer] = useState("");
  const [attError, setattError] = useState(false);
  const [attendeesList, setAttendeesList] = useState([]);

  // fetch list of attendees

  useEffect(() => {
    talkApi({ method: "GET", endpoint: "attendee" }).then((res) => {
      setAttendeesList(res);
    });
  }, []);

  const handleSubmit = () => {
    if (talk.length < 3) {
      setTalkError(true);
      return;
    }
    if (goer.trim() === "") {
      setattError(true);
      return;
    }

    const body = {
      title: talk,
      attendee: goer,
    };

    console.log(body);

    talkApi({ method: "POST", endpoint: "talk", body }).then((res) => {
      console.log(res);
    });
  };

  const handleClose = () => {
    setModal(false);
    setpage(1);
  };
  return (
    <div className={mainmodal}>
      {page === 1 && (
        <div className={modalBox}>
          <>
            <div className={top}>
              <h3>Create Topic</h3>
              <p className={close} onClick={handleClose}>
                X
              </p>
            </div>
            <input
              className={input}
              placeholder="enter topic"
              value={talk}
              onChange={(e) => setTalk(e.target.value)}
            />
            {talkError && (
              <p className={error}>
                title cannot be empty/less than 3 characters
              </p>
            )}

            <button
              onClick={() => setpage(2)}
              className={talk.length < 3 ? disabled : button}
              disabled={talk.length < 3}
            >
              Add Attendees
            </button>
          </>
        </div>
      )}
      {page === 2 && (
        <div className={modalBox}>
          <>
            <div className={top}>
              <h3>Add Attendees</h3>
              <p className={close} onClick={handleClose}>
                X
              </p>
            </div>
            <div className={namelist}>
              <div className={scroll}>
                {attendeesList.length > 0 ? (
                  attendeesList.map((one) => (
                    <div key={one.id}>
                      <input
                        type="radio"
                        name="attendee"
                        value={one.name}
                        onChange={(e) => setGoer(e.target.value)}
                      />
                      <label>{one.name}</label>
                    </div>
                  ))
                ) : (
                  <h3>Consider adding attendee below</h3>
                )}
              </div>
              {attError && <p className={error}>add atleast one person</p>}
            </div>

            <button
              onClick={handleSubmit}
              className={attError ? disabled : button}
              disabled={attError}
            >
              Create
            </button>
          </>
        </div>
      )}
    </div>
  );
}

/*
               <div className={addManually}>
                <input className={input} placeholder="add new attendee" />
                <button className={button}>add</button>
              </div>
 */
