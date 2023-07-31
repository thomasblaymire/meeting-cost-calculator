import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import * as csv from "csvtojson";
import differenceInMinutes from "date-fns/differenceInMinutes";
import parse from "date-fns/parse";

import "./App.css";
const employees = {
  "DiSalvatore, Michele": { role: "Lead Engineer" },
  "Guler, Hus": { role: "Product Designer" },
  "Rona Marin-Miller": { role: "Senior Manager, Product Design" },
  "Blaymire, Tom": { role: "Senior Engineer" },
  "Hilton, Andrew": { role: "Developer" },
  "Uppuluri, Udaya": { role: "Engineer" },
  "de Sa, Lucas": { role: "Engineer" },
};
const salaries = {
  "Lead Engineer": 111000,
  "Senior Engineer": 90000,
  Engineer: 65000,
  Developer: 65000,
  "Product Designer": 50000,
  "Senior Manager, Product Design": 65000,
};

const CSV_STR = `1. Summary
Meeting title	Innovation Day Brain Storming
Attended participants	7
Start time	7/20/23, 4:16:29 PM
End time	7/20/23, 5:30:11 PM
Meeting duration	1h 13m 42s
Average attendance time	59m 29s

2. Participants
Name	First Join	Last Leave	In-Meeting Duration	Email	Participant ID (UPN)	Role
DiSalvatore, Michele	7/20/23, 4:30:36 PM	7/20/23, 5:30:11 PM	59m 35s	Michele.DiSalvatore@newday.co.uk	n16706@newday.co.uk	Organiser
Guler, Hus	7/20/23, 4:30:10 PM	7/20/23, 5:30:08 PM	59m 58s	Hus.Guler@newday.co.uk	N19200@newday.co.uk	Presenter
Rona Marin-Miller	7/20/23, 4:30:17 PM	7/20/23, 5:30:09 PM	59m 52s	Rona.Marin-Miller@newday.co.uk	N19232@newday.co.uk	Presenter
Blaymire, Tom	7/20/23, 4:30:27 PM	7/20/23, 5:30:11 PM	59m 43s	Tom.Blaymire@newday.co.uk	N19407@newday.co.uk	Presenter
Hilton, Andrew	7/20/23, 4:30:29 PM	7/20/23, 5:28:44 PM	58m 14s	Andrew.Hilton@newday.co.uk	S02144@newday.co.uk	Presenter
Uppuluri, Udaya	7/20/23, 4:30:30 PM	7/20/23, 5:30:11 PM	59m 41s	Udaya.Uppuluri@newday.co.uk	N19225@newday.co.uk	Presenter
de Sa, Lucas	7/20/23, 4:30:48 PM	7/20/23, 5:30:11 PM	59m 22s	Lucas.deSa@newday.co.uk	S02096@newday.co.uk	Presenter

3. In-Meeting Activities
Name	Join Time	Leave Time	Duration	Email	Role
DiSalvatore, Michele	7/20/23, 4:30:36 PM	7/20/23, 5:30:11 PM	59m 35s	Michele.DiSalvatore@newday.co.uk	Organiser
Guler, Hus	7/20/23, 4:30:10 PM	7/20/23, 5:30:08 PM	59m 58s	Hus.Guler@newday.co.uk	Presenter
Rona Marin-Miller	7/20/23, 4:30:17 PM	7/20/23, 5:30:09 PM	59m 52s	Rona.Marin-Miller@newday.co.uk	Presenter
Blaymire, Tom	7/20/23, 4:30:27 PM	7/20/23, 5:30:11 PM	59m 43s	Tom.Blaymire@newday.co.uk	Presenter
Hilton, Andrew	7/20/23, 4:30:29 PM	7/20/23, 5:28:44 PM	58m 14s	Andrew.Hilton@newday.co.uk	Presenter
Uppuluri, Udaya	7/20/23, 4:30:30 PM	7/20/23, 5:30:11 PM	59m 41s	Udaya.Uppuluri@newday.co.uk	Presenter
de Sa, Lucas	7/20/23, 4:30:48 PM	7/20/23, 5:30:11 PM	59m 22s	Lucas.deSa@newday.co.uk	Presenter
`;

function App() {
  const [count, setCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [finalMeetingCost, setFinalMeetingCost] = useState(0);

  const parseCSV = async () => {
    const parsedCSV = await csv({
      delimiter: "\t",
    }).fromString(CSV_STR);

    let amIInParticipantsTable = false;
    let canIAddParticipants = false;
    const list = [];
    const formatDate = (field) =>
      parse(field, "MM/dd/yy, h:mm:ss a", new Date());

    parsedCSV.forEach((row) => {
      if (row[1][" Summary"].startsWith("3. In-Meeting Activities")) {
        amIInParticipantsTable = false;
      }

      if (amIInParticipantsTable && canIAddParticipants) {
        const joinTime = formatDate(row["field2"]);
        const leaveTime = formatDate(row["field3"]);
        const minutes = differenceInMinutes(leaveTime, joinTime);
        const name = row[1][" Summary"];
        list.push({
          name,
          minutes,
          role: employees[name]["role"],
        });
      }
      if (row[1][" Summary"].startsWith("2. Participants")) {
        amIInParticipantsTable = true;
      }
      if (row[1][" Summary"].startsWith("Name")) {
        canIAddParticipants = true;
      }
    });
    setParticipants(list);
  };

  useEffect(() => {
    parseCSV();
  }, []);

  useEffect(() => {
    const numberOfWorkingDays = 220;
    const numberOfWorkingHrs = 7.5;
    const numberOfWorkingMinutes =
      numberOfWorkingDays * numberOfWorkingHrs * 60;
    if (participants.length > 0) {
      let meetingCost = 0;
      participants.forEach(({ role, minutes }) => {
        meetingCost += (salaries[role] / numberOfWorkingMinutes) * minutes;
      });
      setFinalMeetingCost(meetingCost);
    }
  }, [participants]);

  console.log(
    "participants",
    participants,
    "finalMeetingCost",
    finalMeetingCost
  );

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>NewDay Meeting Cost Calcualtor</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
