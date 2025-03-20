import { ActionFunctionArgs, redirect, useFetcher } from "react-router";
import { css } from "@emotion/css";
import useStore from "@store";
import {
  getCaregiverAPIKeyById,
  getCaregiverIdByURL,
} from "@shared/caregivers";
import { getRecipientIdByURL } from "@shared/recipients";
import { addMedication } from "@shared/services";
import { Medication } from "@shared/types";

export default function AddMedication() {
  const fetcher = useFetcher();
  const [medicationFormState, setStore] = useStore(
    (store) => store.medicationFormState
  );
  const [recipients] = useStore((store) => store.recipients);

  const recipient = recipients.find(
    (recipient) => recipient.id === getRecipientIdByURL(window.location.href)
  );

  if (!recipient) {
    return (
      <main className={main}>
        <h2>Recipient not found</h2>
      </main>
    );
  }

  return (
    <main className={main}>
      <h2>Add New Medication for {recipient.name}</h2>

      <fetcher.Form method="post" action="">
        <fieldset className={fieldset}>
          <legend>Medication Name</legend>
          <input
            type="text"
            name="medicationName"
            placeholder="Medication Name"
            required
          />
        </fieldset>
        <fieldset className={fieldset}>
          <legend>Dosage</legend>
          <input
            type="number"
            name="dosageAmount"
            placeholder="Dosage Amount"
            min="0"
            required
          />
          <select name="dosageUnit" required>
            <option value="" disabled selected>
              Select Unit
            </option>
            <option value="mg">mg</option>
            <option value="g">g</option>
            <option value="mcg">mcg</option>
            <option value="IU">IU</option>
            <option value="mL">mL</option>
            <option value="drop(s)">drops</option>
            <option value="tablet(s)">tablets</option>
          </select>
        </fieldset>
        <fieldset className={fieldset}>
          <legend>Date Range</legend>
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              min={new Date().toISOString().split("T")[0]}
              required
              onInput={(event) => {
                setStore({
                  medicationFormState: {
                    ...medicationFormState,
                    startDate: (event.target as HTMLInputElement).value,
                  },
                });
              }}
            />
          </label>
          <br />
          <label>
            End Date (optional):
            <input
              type="date"
              name="endDate"
              min={medicationFormState?.startDate}
            />
          </label>
        </fieldset>

        <fieldset className={fieldset}>
          <legend>Schedule</legend>
          <label>
            <input
              type="radio"
              name="recurrenceType"
              value="every-n-days"
              required
              onChange={() => {
                setStore({
                  medicationFormState: {
                    ...medicationFormState,
                    recurrenceType: { type: "every-n-days" },
                  },
                });
              }}
            />
            Every N Days
          </label>
          <label>
            <input
              type="radio"
              name="recurrenceType"
              value="every-nth-day-of-month"
              required
              onChange={() => {
                setStore({
                  medicationFormState: {
                    ...medicationFormState,
                    recurrenceType: { type: "every-nth-day-of-month" },
                  },
                });
              }}
            />
            Every Nth Day of Month
          </label>

          <br />

          <label>
            The value of N:
            <input
              type="number"
              name="n"
              max={
                medicationFormState.recurrenceType?.type ===
                "every-nth-day-of-month"
                  ? 28
                  : 366
              }
            />
          </label>

          <br />

          <label>
            Time:
            <input type="time" name="time" required />
          </label>
        </fieldset>

        <button type="submit">Add Medication</button>
        {fetcher.state !== "idle" && <p>Saving...</p>}
      </fetcher.Form>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData.entries());
  const {
    medicationName,
    dosageAmount,
    dosageUnit,
    startDate,
    endDate,
    recurrenceType,
    n,
    time,
  } = formDataObject;

  if (
    typeof medicationName === "string" &&
    typeof dosageAmount === "string" &&
    typeof dosageUnit === "string" &&
    typeof startDate === "string" &&
    typeof endDate === "string" &&
    typeof recurrenceType === "string" &&
    typeof n === "string" &&
    typeof time === "string"
  ) {
    const caregiverId = getCaregiverIdByURL(request.url);
    const apiKey = getCaregiverAPIKeyById(String(caregiverId));
    const recipientId = getRecipientIdByURL(request.url);

    if (typeof recipientId !== "string") {
      return new Response("Invalid recipient", { status: 400 });
    }

    const recurrence =
      recurrenceType === "every-n-days"
        ? {
            type: "every-n-days" as const,
            n: Number(n),
            time: time,
          }
        : {
            type: "every-nth-day-of-month" as const,
            dayOfMonth: Number(n),
            time: time,
          };

    await addMedication({
      apiKey,
      payload: {
        recipient_id: recipientId,
        medication: {
          name: medicationName,
          dosage: {
            amount: Number(dosageAmount),
            unit: dosageUnit as Medication["dosage"]["unit"],
          },
          schedule: {
            startDate,
            endDate,
            recurrence,
          },
        },
      },
    });

    return redirect(`/caregiver/${caregiverId}/recipient/${recipientId}`);
  }

  return new Response("Invalid name", { status: 400 });
}

const main = css`
  margin: 10px;
`;

const fieldset = css`
  margin-bottom: 10px;
`;
