import styles from "./mtstyles.module.css";
const { talk, talkTitle, talkDetail, space, deleteT } = styles;

import { Link } from "react-router-dom";
import { talkApi } from "../hook/apiHelper";

export default function TalkComp({ data }) {
  const { title, attendees, id } = data;
  // const [attendanceList, setattendanceList] = useState("");

  let attendanceList = "";

  attendees.forEach((element: object) => {
    const { name } = element;
    attendanceList = attendanceList + " " + name;
  });

  const handleDelete = () => {
    talkApi({ endpoint: "talk/" + id, method: "DELETE", body: { id } });
  };

  return (
    <div className={talk}>
      <Link to={`/${id}`} className={space}>
        <h4 className={talkTitle}>{title}</h4>
        <p className={talkDetail}>{`attendees include: ${attendanceList}`}</p>
      </Link>
      <div className={space}>
        <p className={deleteT} onClick={handleDelete}>
          delete
        </p>
      </div>
    </div>
  );
}
