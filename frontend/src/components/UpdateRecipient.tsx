import { ActionFunctionArgs, redirect, useFetcher } from "react-router";
import { css } from "@emotion/css";
import useStore from "@store";
import {
  getCaregiverAPIKeyById,
  getCaregiverIdByURL,
} from "@shared/caregivers";
import { getRecipientIdByURL } from "@shared/recipients";
import { updateRecipient } from "@shared/services";

export default function UpdateRecipient() {
  const fetcher = useFetcher();
  const [recipients] = useStore((store) => store.recipients);

  const recipient = recipients.find(
    (recipient) => recipient.id === getRecipientIdByURL(window.location.href)
  );

  return (
    <main className={main}>
      <h2>Edit Recipient</h2>

      <fetcher.Form method="post" action="">
        <input
          type="text"
          name="name"
          placeholder="Name"
          defaultValue={recipient?.name}
        />
        <button type="submit">Edit Recipient</button>
        {fetcher.state !== "idle" && <p>Saving...</p>}
      </fetcher.Form>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const id = getRecipientIdByURL(window.location.href);
  const formData = await request.formData();
  const name = formData.get("name");

  if (id && typeof name === "string") {
    const caregiverId = getCaregiverIdByURL(request.url);
    const apiKey = getCaregiverAPIKeyById(String(caregiverId));

    await updateRecipient({
      apiKey,
      payload: { id, name },
    });
    return redirect(`/caregiver/${caregiverId}`);
  }

  return new Response("Invalid name or recipient ID", { status: 400 });
}

const main = css`
  margin: 10px;
`;
