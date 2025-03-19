export type Event =
  | {
      id: EventId;
      event_type: "added_recipient";
      caregiver_id: CaregiverId;
      payload: Pick<Recipient, "name">;
      timestamp: Timestamp;
    }
  | {
      id: EventId;
      event_type: "updated_recipient";
      caregiver_id: CaregiverId;
      payload: Pick<Recipient, "id" | "name">;
      timestamp: Timestamp;
    }
  | {
      id: EventId;
      event_type: "added_medication";
      caregiver_id: CaregiverId;
      payload: Pick<Medication, "name" | "schedule">;
      timestamp: Timestamp;
    }
  | {
      id: EventId;
      event_type: "archived_medication";
      caregiver_id: CaregiverId;
      payload: Pick<Medication, "id">;
      timestamp: Timestamp;
    };

type EventId = string;
type CaregiverId = string;
type Timestamp = string;

export type Recipient = {
  id: string;
  name: string;
  medications: Array<Medication>;
  timestamp: Timestamp;
};

export type Medication = {
  id: string;
  name: string;
  schedule: Schedule;
  isArchived: boolean;
  timestamp: Timestamp;
};

export type Schedule = {
  id: string;
  name: string;
  dosage:
    | {
        type: "amount";
        amount: number;
        unit: "mg" | "g" | "mcg" | "IU" | "mL" | "drops" | "tablets";
      }
    | { type: "as-needed"; maxPerDay?: number };
  startDate: string;
  endDate?: string;
  recurrence?: {
    frequency:
      | {
          type: "every-n-days";
          n: number;
          timesOfDay: Array<Time>;
        }
      | {
          type: "every-nth-day-of-month";
          dayOfMonth: number;
          timesOfDay: Array<Time>;
        };
  };
  timestamp: Timestamp;
};

type Time = `${Hour}:${"00" | "15" | "30" | "45"} ${"AM" | "PM"}`;
type Hour =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";
