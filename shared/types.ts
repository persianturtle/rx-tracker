export type Event =
  | {
      id: string;
      event_type: "added_recipient";
      caregiver_id: string;
      payload: { name: string };
      timestamp: string;
    }
  | {
      id: string;
      event_type: "updated_recipient";
      caregiver_id: string;
      payload: { name: string };
      timestamp: string;
    };

export type Recipient = {
  id: string;
  name: string;
  timestamp: string;
};

export type Medication = {};
