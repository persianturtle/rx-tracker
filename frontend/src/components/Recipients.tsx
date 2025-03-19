import { Link, useLoaderData } from "react-router";
import { css } from "@emotion/css";
import useStore from "@store";
import useCQRSWithIndexedDB from "@hooks/useIndexedDBReadModel";

import type { Event } from "@shared/types";

export default function Recipients() {
  const [recipients] = useStore((store) => store.recipients);
  const [loggedInAs] = useStore((store) => store.loggedInAs);
  const [caregiverId] = useStore((store) => store.caregiverId);
  const {
    data: [latestEvent],
  } = useLoaderData<{ data: Array<Event> }>();
  useCQRSWithIndexedDB(latestEvent);

  // TODO: error boundaries
  // TODO: 404 page

  return (
    <main className={main}>
      <h1>Welcome, {loggedInAs}!</h1>
      <h2>Your Recipients</h2>
      <ul>
        {recipients.map((recipient) => (
          <li key={recipient.id}>
            <Link to={`/caregiver/${caregiverId}/recipient/${recipient.id}`}>
              {recipient.name}
            </Link>
          </li>
        ))}
        <li>
          <Link to={`/caregiver/${caregiverId}/recipient/add`}>
            Add New Recipient
          </Link>
        </li>
      </ul>
    </main>
  );
}

const main = css`
  margin: 10px;
`;
