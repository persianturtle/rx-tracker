import { Link } from "react-router";
import { css } from "@emotion/css";
import useStore from "@store";
import { getRecipientIdByURL } from "@shared/recipients";

export default function Recipient() {
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
      <h2>
        {recipient.name} <Link to="edit">(edit)</Link>
      </h2>

      <h3>Medications</h3>
    </main>
  );
}

const main = css`
  margin: 10px;
`;
