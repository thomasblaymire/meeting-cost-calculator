import { useEffect, useState } from "react";
import { Cost } from "./Cost";

const salaries = {
  "Lead Engineer": 111000,
  "Senior Engineer": 90000,
  Engineer: 65000,
  Developer: 65000,
  "Product Designer": 50000,
  "Senior Manager, Product Design": 65000,
};

const Result = ({
  participants,
  meetingTitle,
  meetingDuration,
  meetingStartTime,
  onClose,
}) => {
  const [finalMeetingCost, setFinalMeetingCost] = useState(0);
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

      const formatter = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      });

      setFinalMeetingCost(formatter.format(meetingCost));
    }
  }, [participants]);

  return (
    <div>
      <h1>Meeting cost calculator</h1>
      <h2>{meetingTitle}</h2>
      <h3>{meetingStartTime}</h3>
      <h4>Number of Attendees</h4>
      <h2>
        <Cost value={participants.length} />
      </h2>
      <h4>Meeting Duration</h4>
      <h2>
        <Cost value={meetingDuration} />
      </h2>
      <h4>Meeting Cost</h4>
      <h2>
        <Cost value={finalMeetingCost} />
      </h2>
      <button onClick={onClose}>close</button>
    </div>
  );
};

export default Result;
