import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { talkApi } from "../hook/apiHelper";
import styles from "./TD.module.css";
import moment from "moment";
import AddAttendee from "./AddAttendee";

moment("20111031", "YYYYMMDD").fromNow();
const {
  title,
  chat,
  chats,
  flex,
  sender,
  time,
  chatbody,
  list,
  containr,
  titlehead,
  chattop,
  listItem,
  person,
  button,
} = styles;
export default function TalkDetails() {
  const { talkId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [getTitle, setTitle] = useState("");
  const [allAttendees, setallAttendees] = useState([]);
  const [add, setdd] = useState(false);

  useEffect(() => {
    talkApi({ method: "GET", endpoint: "talk/" + talkId })
      .then((res) => {
        console.log(res);
        const { id, attendees, chats, title } = res;
        // const { attId: _id, email, name } = attendees;
        // const { chatid: _id, sender, message, dateCreated } = chats;

        setTitle(title);
        setAttendees(attendees);
        setAllChats(chats);
      })
      .then(() => {
        talkApi({ method: "GET", endpoint: "attendee" }).then((res) => {
          setallAttendees(res);
        });
      });
  }, []);

  // chats
  const displayChats =
    allChats.length > 0 ? (
      allChats.map((item) => {
        const { _id, sender, message, dateCreated } = item;
        const { name } = sender;

        return (
          <div className={chat} key={_id}>
            <div className={chattop}>
              <h4 className={sender}>{name}</h4>
              <p className={time}>{moment(dateCreated).fromNow()}</p>
            </div>
            <div className={chatbody}>
              <p>{message}</p>
            </div>
          </div>
        );
      })
    ) : (
      <p>No chats for this talk</p>
    );

  const attendeesList =
    attendees.length > 0 ? (
      attendees.map((item) => {
        const { email, name } = item;

        return (
          <div className={person}>
            <h4>{name}</h4>
            <p>{email}</p>
          </div>
        );
      })
    ) : (
      <p>You have not added anyone</p>
    );

  return (
    <div className={containr}>
      <div className={titlehead}>
        <h4 className={title}> {getTitle} </h4>{" "}
      </div>

      <div className={flex}>
        <div className={chats}>
          <h4>Chats</h4>

          {displayChats}
        </div>

        <div className={list}>
          <h4>list of all attendees</h4>
          <div className={listItem}>{attendeesList}</div>
          {add ? (
            <button className={button} onClick={() => setdd(false)}>
              close
            </button>
          ) : (
            <button className={button} onClick={() => setdd(true)}>
              Add Attendee
            </button>
          )}
          {add && <AddAttendee data={allAttendees} talkid={talkId} />}
        </div>
      </div>
    </div>
  );
}
