import { Link, useRevalidator } from "react-router";
import { css } from "@emotion/css";
import useStore from "@store";
import { getRecipientIdByURL } from "@shared/recipients";
import { getMedicationSchedule } from "@shared/medication";
import {
  markDoseAsTaken,
  unmarkDoseAsTaken,
  archiveMedication,
} from "@shared/services";
import { getCaregiverAPIKeyById } from "@shared/caregivers";

export default function Recipient() {
  const revalidator = useRevalidator();
  const [recipients] = useStore((store) => store.recipients);
  const recipient = recipients.find(
    (recipient) => recipient.id === getRecipientIdByURL(window.location.href)
  );
  const [caregiverId] = useStore((store) => store.caregiverId);
  const apiKey = getCaregiverAPIKeyById(String(caregiverId));

  if (!recipient) {
    return (
      <main className={main}>
        <h2>Recipient not found</h2>
      </main>
    );
  }

  const schedules = recipient.medications?.map((medication) => ({
    medication,
    schedule: getMedicationSchedule({ schedule: medication.schedule }),
  }));

  return (
    <main className={main}>
      <h2>
        {recipient.name} <Link to="edit">(edit)</Link>
      </h2>

      <h3>Medications</h3>

      <ul>
        {recipient.medications?.map((medication) => (
          <li key={medication.id}>
            {medication.name}

            {medication.isArchived ? (
              <span
                className={css`
                  padding-left: 5px;
                `}
              >
                (Archived)
              </span>
            ) : (
              <button
                className={css`
                  appearance: none;
                  background: none;
                  border: none;
                  color: blue;
                  cursor: pointer;
                  font-size: 1rem;
                  padding: 0;
                  text-decoration: underline;
                  margin-left: 5px;
                `}
                onClick={() => {
                  archiveMedication({
                    apiKey,
                    payload: {
                      medication_id: medication.id,
                      recipient_id: recipient.id,
                    },
                  }).then(() => {
                    revalidator.revalidate();
                  });
                }}
              >
                (archive)
              </button>
            )}
          </li>
        ))}

        <li
          className={css`
            margin-top: 10px;
            font-size: 1.2rem;
          `}
        >
          <Link to={`medication/add`}>Add New Medication</Link>
        </li>
      </ul>

      <h3>Schedule</h3>

      {schedules?.map(({ medication, schedule }) => (
        <table
          className={css`
            margin-top: 10px;
            background-color: #f9f9f9;
            padding: 15px;
            user-select: none;

            > tbody > tr {
              display: flex;
              align-items: center;
              height: 40px;
            }
          `}
        >
          <thead>
            <tr>
              <th>
                {medication.name}{" "}
                {schedule.length === 0 || medication.isArchived
                  ? "(Archived)"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {(medication.isArchived ? [] : schedule).map((date) => (
              <tr key={date.toString()}>
                <td>
                  <label
                    className={css`
                      cursor: pointer;
                    `}
                  >
                    <input
                      type="checkbox"
                      className={css`
                        scale: 1.5;
                        transform: translate(-5px, 1px);
                      `}
                      checked={Boolean(medication.log[date.toString()])}
                      onChange={(event) => {
                        if (event.target.checked) {
                          markDoseAsTaken({
                            apiKey,
                            payload: {
                              medication_id: medication.id,
                              recipient_id: recipient.id,
                              dose_date: date.toString(),
                            },
                          }).then(() => {
                            revalidator.revalidate();
                          });
                        } else {
                          unmarkDoseAsTaken({
                            apiKey,
                            payload: {
                              medication_id: medication.id,
                              recipient_id: recipient.id,
                              dose_date: date.toString(),
                            },
                          }).then(() => {
                            revalidator.revalidate();
                          });
                        }
                      }}
                    />
                    <span
                      className={css`
                        padding-right: 50px;
                      `}
                    >
                      {medication.dosage.amount} {medication.dosage.unit}
                    </span>
                  </label>
                  {date.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </main>
  );
}

const main = css`
  margin: 10px;
`;
