import { ActionFunctionArgs, redirect, useFetcher } from "react-router";
import useStore from "@store";
import {
  getCaregiverAPIKeyById,
  getCaregiverIdByURL,
} from "@shared/caregivers";
import { addRecipient } from "@shared/services";

export default function AddRecipient() {
  const [caregiverId] = useStore((store) => store.caregiverId);
  const fetcher = useFetcher();

  return (
    <section>
      <h1>Add New Recipient</h1>

      <fetcher.Form
        method="post"
        action={`/caregiver/${caregiverId}/recipient/add`}
      >
        <input type="text" name="name" placeholder="Name" />
        <button type="submit">Add Recipient</button>
        {fetcher.state !== "idle" && <p>Saving...</p>}
      </fetcher.Form>
    </section>
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
