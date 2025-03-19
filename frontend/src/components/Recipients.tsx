import { Link } from "react-router";
import { css } from "@emotion/css";
import useStore from "@store";

export default function Recipients() {
  const [recipients] = useStore((store) => store.recipients);
  const [loggedInAs] = useStore((store) => store.loggedInAs);

  // TODO: error boundaries
  // TODO: 404 page

  return (
    <main className={main}>
      <h2>Welcome, {loggedInAs}!</h2>
      <h3>Your Recipients</h3>
      <ul>
        {recipients.map((recipient) => (
          <li key={recipient.id}>
            <Link to={`recipient/${recipient.id}`}>{recipient.name}</Link>
          </li>
        ))}
        <li
          className={css`
            margin-top: 10px;
            font-size: 1.2rem;
          `}
        >
          <Link to={`recipient/add`}>Add New Recipient</Link>
        </li>
      </ul>
    </main>
  );
}

const main = css`
  margin: 10px;
`;
