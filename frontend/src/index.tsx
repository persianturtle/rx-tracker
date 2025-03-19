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
import Schedule from "@components/Schedules";
import AddRecipient, {
  action as AddRecipientAction,
} from "@components/AddRecipient";

let router = createBrowserRouter([
  { path: "/", element: <Navigate to="/caregiver/1" replace /> },
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/caregiver/:caregiverId",
        Component: Recipients,
        loader,
        children: [],
      },
      {
        path: "/caregiver/:caregiverId/recipient/:recipientId",
        Component: Schedule,
        loader,
        children: [],
      },
      {
        path: "/caregiver/:caregiverId/recipient/add",
        Component: AddRecipient,
        loader,
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
