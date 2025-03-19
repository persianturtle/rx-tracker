import createFastContext from "@contexts/createFastContext";
import { getCaregiverIdByURL } from "@shared/caregivers";

import type { Event, Recipient } from "@shared/types";

export type Store = {
  events: Array<Event>;
  caregiverId: number;
  isNavOpen: boolean;
  loggedInAs: string;
  recipients: Array<Recipient>;
};

const caregiverId = getCaregiverIdByURL(window.location.href);

const { Provider, useStore } = createFastContext<Store>({
  events: [],
  caregiverId,
  isNavOpen: false,
  loggedInAs: `Caregiver ${caregiverId}`,
  recipients: [],
});

export default useStore;
export { Provider };
