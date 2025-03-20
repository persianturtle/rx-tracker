import { ActionFunctionArgs, redirect, useFetcher } from "react-router";
import { css } from "@emotion/css";
import {
  getCaregiverAPIKeyById,
  getCaregiverIdByURL,
} from "@shared/caregivers";
import { addRecipient } from "@shared/services";

export default function AddRecipient() {
  const fetcher = useFetcher();

  return (
    <main className={main}>
      <h2>Add New Recipient</h2>

      <fetcher.Form method="post" action="">
        <input type="text" name="name" placeholder="Name" required />
        <button type="submit">Add Recipient</button>
        {fetcher.state !== "idle" && <p>Saving...</p>}
      </fetcher.Form>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name === "string") {
    const caregiverId = getCaregiverIdByURL(request.url);
    const apiKey = getCaregiverAPIKeyById(String(caregiverId));

    await addRecipient({ apiKey, payload: { name } });
    return redirect(`/caregiver/${caregiverId}`);
  }

  return new Response("Invalid name", { status: 400 });
}

const main = css`
  margin: 10px;
`;
