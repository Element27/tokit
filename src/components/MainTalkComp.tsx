import { useState, useEffect } from "react";
import TalkComp from "./TalkComp";
import CreateTalkModal from "./CreateTalkModal";
import CreateAttendee from "./CreateAttendee";
import styles from "./mtstyles.module.css";
import { talkApi } from "../hook/apiHelper";
// import {useFetch} from '../hook/useAxios/'

function MainTalk() {
  // `https://conference-api.onrender.com/${endpoint}`
  const { container, header, logo, button, AllTalks, AllTalksHeader } = styles;

  const [modal, setModal] = useState(false);
  const [attmodal, setAttModal] = useState(true);
  const [talks, setTalks] = useState([]);

  // const [data, loading] = useAxios();

  useEffect(() => {
    talkApi({ method: "GET", endpoint: "talk" }).then((res) => {
      // console.log(res);
      setTalks(res);
    });
  }, []);

  return (
    <div className={container}>
      {modal && <CreateTalkModal setModal={setModal} />}
      {attmodal && <CreateAttendee setAttModal={setAttModal} />}

      <div className={header}>
        <h1 className={logo}> Tokit </h1>
        <div>
          <button className={button} onClick={() => setAttModal(true)}>
            Add New Attendee
          </button>
          <button className={button} onClick={() => setModal(true)}>
            Create Talk
          </button>
        </div>
      </div>

      <div className={AllTalks}>
        <h3 className={AllTalksHeader}>All Talks</h3>

        {talks ? (
          talks.map((talk) => <TalkComp key={talk.id} data={talk} />)
        ) : (
          <p>No talks to show yet... Consider adding a topic</p>
        )}
      </div>
    </div>
  );
}

export default MainTalk;
