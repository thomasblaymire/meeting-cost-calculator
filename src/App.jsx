import { useEffect, useState } from "react";
import CSV from "csvtojson";
import differenceInMinutes from "date-fns/differenceInMinutes";
import parse from "date-fns/parse";
import "./App.css";
import Result from "./components/Result";

const employees = {
  "DiSalvatore, Michele": { role: "Lead Engineer" },
  "Guler, Hus": { role: "Product Designer" },
  "Rona Marin-Miller": { role: "Senior Manager, Product Design" },
  "Blaymire, Tom": { role: "Senior Engineer" },
  "Hilton, Andrew": { role: "Developer" },
  "Uppuluri, Udaya": { role: "Engineer" },
  "de Sa, Lucas": { role: "Engineer" },
};

let meetingTitle = "";
let meetingDuration = "";
let meetingStartTime = "";
function App() {
  const [participants, setParticipants] = useState([]);
  const [csvString, setCsvString] = useState("");

  const parseCSV = async () => {
    const parsedCSV = await CSV({
      delimiter: "\t",
    }).fromString(csvString);

    let amIInParticipantsTable = false;
    let canIAddParticipants = false;
    const list = [];
    const formatDate = (field) =>
      parse(field, "MM/dd/yy, h:mm:ss a", new Date());

    parsedCSV.forEach((row) => {
      if (row[1][" Summary"].startsWith("3. In-Meeting Activities")) {
        amIInParticipantsTable = false;
      }
      if (row[1][" Summary"].startsWith("Meeting title")) {
        meetingTitle = row["field2"];
      }
      if (row[1][" Summary"].startsWith("Meeting duration")) {
        meetingDuration = row["field2"];
      }
      if (row[1][" Summary"].startsWith("Start time")) {
        meetingStartTime = row["field2"];
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
  }, [csvString]);

  const [file, setFile] = useState();

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        setCsvString(event.target.result);
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <>
      {participants.length > 0 ? (
        <Result
          participants={participants}
          meetingTitle={meetingTitle}
          meetingDuration={meetingDuration}
          meetingStartTime={meetingStartTime}
          onClose={() => setCsvString("")}
        />
      ) : (
        <form onSubmit={handleOnSubmit}>
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
          />

          <button type="submit">UPLOAD REPORT</button>
        </form>
      )}
    </>
  );
}

export default App;
