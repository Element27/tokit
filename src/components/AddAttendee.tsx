import { useState } from "react";

import styles from "./mtstyles.module.css";
import { talkApi } from "../hook/apiHelper";

const { button, namelist, scroll } = styles;
export default function AddAttendee({ data, talkid }) {
  const [att, setAll] = useState([]);

  const handleCheck = (e) => {
    // const { value, checked } = e.target;

    if (e.target.checked) {
      const going = [...att, data.filter(({ id }) => id === e.target.value)];
      // console.log(going);
      setAll(going);
      // console.log(att);
    } else {
      const rem = att.filter(({ id }) => id !== e.target.value);
      // console.log(rem);
      setAll(rem);
      // console.log(att);
    }
  };
  console.log(att);

  const handleSubmit = () => {
    // console.log(data);
    att.forEach((element) => {
      console.log(element);
      const { id, name, emailAddress } = element;

      talkApi({
        method: "PUT",
        endpoint: "talk/" + talkid + "/attendee",
        body: {
          id,
          name,
          emailAddress,
        },
      }).then((res) => {
        console.log(res);
      });
    });
  };

  return (
    <div className={namelist}>
      <div className={scroll}>
        {data.length > 0 ? (
          data.map((one) => (
            <div key={one.id}>
              <input
                type="checkbox"
                value={one.id}
                onChange={(e) => handleCheck(e)}
              />
              <label>{one.name}</label>
            </div>
          ))
        ) : (
          <h3>No attendee to show</h3>
        )}
      </div>

      <button onClick={handleSubmit} className={button}>
        Add
      </button>
    </div>
  );
}
