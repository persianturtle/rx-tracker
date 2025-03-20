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
      payload: {
        medication: Pick<Medication, "name" | "dosage"> & {
          schedule: Schedule;
        };
      } & {
        recipient_id: Recipient["id"];
      };
      timestamp: Timestamp;
    }
  | {
      id: EventId;
      event_type: "archived_medication";
      caregiver_id: CaregiverId;
      payload: {
        medication_id: Medication["id"];
        recipient_id: Recipient["id"];
      };
      timestamp: Timestamp;
    }
  | {
      id: EventId;
      event_type: "marked_dose_as_taken";
      caregiver_id: CaregiverId;
      payload: {
        medication_id: Medication["id"];
        recipient_id: Recipient["id"];
        dose_date: string;
      };
      timestamp: Timestamp;
    }
  | {
      id: EventId;
      event_type: "unmarked_dose_as_taken";
      caregiver_id: CaregiverId;
      payload: {
        medication_id: Medication["id"];
        recipient_id: Recipient["id"];
        dose_date: string;
      };
      timestamp: Timestamp;
    };

type EventId = string;
type CaregiverId = string;
type Timestamp = string;

export type Recipient = {
  id: string;
  name: string;
  medications?: Array<Medication>;
  timestamp: Timestamp;
};

export type Medication = {
  id: string;
  name: string;
  dosage: {
    amount: number;
    unit: "mg" | "g" | "mcg" | "IU" | "mL" | "drops" | "tablets";
  };
  schedule: Schedule;
  log: Record<string, boolean>;
  isArchived: boolean;
  timestamp: Timestamp;
};

export type Schedule = {
  startDate: string;
  endDate?: string;
  recurrence: Recurrence;
};

export type Recurrence =
  | {
      type: "every-n-days";
      n: number;
      time: Time;
    }
  | {
      type: "every-nth-day-of-month";
      dayOfMonth: number;
      time: Time;
    };

type Time = string;
