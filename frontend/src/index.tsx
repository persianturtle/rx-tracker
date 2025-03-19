import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  Navigate,
  RouterProvider,
} from "react-router";
import { Provider } from "@store";
import { getCaregiverAPIKeyById } from "@shared/caregivers";
import { fetchLatestEventForCaregiver } from "@shared/services";
import App from "@components/App";
import Recipients from "@components/Recipients";
import Recipient from "@components/Recipient";
import AddRecipient, {
  action as AddRecipientAction,
} from "@components/AddRecipient";
import UpdateRecipient, {
  action as UpdateRecipientAction,
} from "@components/UpdateRecipient";

let router = createBrowserRouter([
  { path: "/", element: <Navigate to="/caregiver/1" replace /> },
  {
    path: "/",
    Component: App,
    loader,
    HydrateFallback: () => null,
    children: [
      {
        path: "/caregiver/:caregiverId",
        Component: Recipients,
        children: [],
      },
      {
        path: "/caregiver/:caregiverId/recipient/:recipientId",
        Component: Recipient,
        children: [],
      },
      {
        path: "/caregiver/:caregiverId/recipient/:recipientId/edit",
        Component: UpdateRecipient,
        action: UpdateRecipientAction,
        children: [],
      },
      {
        path: "/caregiver/:caregiverId/recipient/add",
        Component: AddRecipient,
        action: AddRecipientAction,
        children: [],
      },
    ],
  },
]);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>
  );
}

async function loader({ request, params }: LoaderFunctionArgs) {
  return fetchLatestEventForCaregiver({
    apiKey: getCaregiverAPIKeyById(params["caregiverId"]),
    signal: request.signal,
  });
}
