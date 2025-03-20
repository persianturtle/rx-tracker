import { useEffect, useRef } from "react";
import { openDB } from "idb";
import { fetchAllEventsForCaregiverAfterTimestamp } from "@shared/services";
import { getCaregiverAPIKeyById } from "@shared/caregivers";
import useStore from "@store";

import type { Event, Recipient } from "@shared/types";

/**
 * The IndexedDB version corresponds to the latest event's timestamp.
 * This allows us to compare the latest event with the cached event
 * to see if there are any new events to fetch.
 *
 * We'll then fetch all events after the cached event's timestamp.
 */
export default function useCQRSWithIndexedDB(latestEvent?: Event) {
  const versionRef = useRef(1);
  const [loggedInAs, setStore] = useStore((store) => store.loggedInAs);
  const [caregiverId] = useStore((store) => store.caregiverId);
  const [recipients] = useStore((store) => store.recipients);

  useEffect(() => {
    if (!latestEvent) return;
    if (latestEvent.caregiver_id !== loggedInAs) return;

    (async () => {
      const dbName = `rxtracker-${loggedInAs.toLowerCase()}`;
      const versionNumber = convertEventTimestampStringToNumber(
        latestEvent.timestamp
      );

      const db = await openDB<Event>(dbName, versionNumber, {
        upgrade(db, oldVersion) {
          versionRef.current = oldVersion;
          if (!db.objectStoreNames.contains("recipients")) {
            const store = db.createObjectStore("recipients", {
              keyPath: "id",
              autoIncrement: false,
            });
            store.createIndex("timestamp", "timestamp", { unique: false });
          }
        },
      });

      if (versionRef.current !== 1) {
        const events: Array<Event> =
          await fetchAllEventsForCaregiverAfterTimestamp({
            apiKey: getCaregiverAPIKeyById(String(caregiverId)),
            cachedEventTimestamp: convertEventTimestampNumberToString(
              versionRef.current
            ),
          });

        const tx = db.transaction("recipients", "readwrite");
        const store = tx.objectStore("recipients");

        for (const event of events) {
          switch (event.event_type) {
            case "added_recipient":
              await store.add({
                id: event.id,
                name: event.payload.name,
                timestamp: event.timestamp,
              });
              break;

            case "updated_recipient":
              await store.put({
                id: event.payload.id,
                name: event.payload.name,
                timestamp: event.timestamp,
              });
              break;

            case "added_medication": {
              const recipient_id = event.payload.recipient_id;
              // I'm not sure why TypeScript doesn't recognize that
              // recipient_id is guaranteed to be a string
              if (typeof recipient_id === "string") {
                const recipient: Recipient = await store.get(recipient_id);
                await store.put({
                  ...recipient,
                  id: event.payload.recipient_id,
                  medications: (recipient.medications ?? []).concat({
                    id: event.id,
                    name: event.payload.medication.name,
                    dosage: event.payload.medication.dosage,
                    schedule: event.payload.medication.schedule,
                    log: {},
                    isArchived: false,
                    timestamp: event.timestamp,
                  }),
                });
              }
              break;
            }

            case "archived_medication": {
              const recipient_id = event.payload.recipient_id;
              // I'm not sure why TypeScript doesn't recognize that
              // recipient_id is guaranteed to be a string
              if (typeof recipient_id === "string") {
                const recipient: Recipient = await store.get(recipient_id);
                await store.put({
                  ...recipient,
                  id: event.payload.recipient_id,
                  medications: recipient.medications?.map((medication) =>
                    medication.id === event.payload.medication_id
                      ? { ...medication, isArchived: true }
                      : medication
                  ),
                });
              }
              break;
            }

            case "marked_dose_as_taken": {
              const recipient_id = event.payload.recipient_id;
              // I'm not sure why TypeScript doesn't recognize that
              // recipient_id is guaranteed to be a string
              if (typeof recipient_id === "string") {
                const recipient: Recipient = await store.get(recipient_id);
                await store.put({
                  ...recipient,
                  id: event.payload.recipient_id,
                  medications: recipient.medications?.map((medication) =>
                    medication.id === event.payload.medication_id
                      ? {
                          ...medication,
                          log: {
                            ...medication.log,
                            [event.payload.dose_date]: true,
                          },
                        }
                      : medication
                  ),
                });
              }
              break;
            }

            case "unmarked_dose_as_taken": {
              const recipient_id = event.payload.recipient_id;
              // I'm not sure why TypeScript doesn't recognize that
              // recipient_id is guaranteed to be a string
              if (typeof recipient_id === "string") {
                const recipient: Recipient = await store.get(recipient_id);
                await store.put({
                  ...recipient,
                  id: event.payload.recipient_id,
                  medications: recipient.medications?.map((medication) =>
                    medication.id === event.payload.medication_id
                      ? {
                          ...medication,
                          log: {
                            ...medication.log,
                            [event.payload.dose_date]: false,
                          },
                        }
                      : medication
                  ),
                });
              }
              break;
            }
          }
        }

        await tx.done;
      }

      setStore({
        recipients: (await db.getAll("recipients")).sort(
          (a, b) =>
            convertEventTimestampStringToNumber(b.timestamp) -
            convertEventTimestampStringToNumber(a.timestamp)
        ),
      });

      db.close();
      versionRef.current = 1;
    })();
  }, [latestEvent?.timestamp, loggedInAs]);

  return { recipients };
}

function convertEventTimestampStringToNumber(timestamp: string) {
  return new Date(timestamp).getTime();
}

function convertEventTimestampNumberToString(timestamp: number) {
  return new Date(timestamp).toISOString();
}
