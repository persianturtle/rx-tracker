import createFastContext from "@contexts/createFastContext";
import { getCaregiverIdByURL } from "@shared/caregivers";

import type { Event, Recipient, Recurrence } from "@shared/types";

export type Store = {
  events: Array<Event>;
  caregiverId: number;
  isNavOpen: boolean;
  loggedInAs: string;
  medicationFormState: Partial<{
    startDate: string;
    recurrenceType: Pick<Recurrence, "type">;
  }>;
  recipients: Array<Recipient>;
};

const caregiverId = getCaregiverIdByURL(window.location.href);

const { Provider, useStore } = createFastContext<Store>({
  events: [],
  caregiverId,
  isNavOpen: false,
  loggedInAs: `Caregiver ${caregiverId}`,
  medicationFormState: {},
  recipients: [],
});

export default useStore;
export { Provider };
