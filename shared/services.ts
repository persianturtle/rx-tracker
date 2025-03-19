import { EVENTS_ENDPOINT } from "./endpoints";
import type { Event } from "./types";

/**
 * Fetch the latest event for a caregiver. Use this to determine if
 * we need to fetch all events after a given timestamp.
 */
export function fetchLatestEventForCaregiver({
  apiKey,
  signal,
}: {
  apiKey: string;
  signal: AbortSignal;
}): Promise<Response> {
  return fetch(`${EVENTS_ENDPOINT}/read`, {
    headers: {
      "x-api-key": apiKey,
    },
    signal,
  });
}

/**
 * Fetch all events for a caregiver after a given timestamp.
 */
export function fetchAllEventsForCaregiverAfterTimestamp({
  apiKey,
  cachedEventTimestamp,
  options,
}: {
  apiKey: string;
  cachedEventTimestamp?: string;
  options?: { signal: AbortSignal };
}): Promise<Array<Event>> {
  return fetch(
    `${EVENTS_ENDPOINT}/read${
      cachedEventTimestamp
        ? `?cachedEventTimestamp=${cachedEventTimestamp}`
        : ""
    }`,
    {
      headers: {
        "x-api-key": apiKey,
      },
      ...options,
    }
  )
    .then((response) => response.json())
    .then(({ data }) => {
      // For some reason, the API includes the latest cached event when
      // we are trying to get the events strictly after the latest
      // cached event.
      return data.filter(
        (event: Event) => event.timestamp !== cachedEventTimestamp
      );
    });
}

/**
 * Add a new recipient.
 */
export function addRecipient({
  apiKey,
  payload,
}: {
  apiKey: string;
  payload: Extract<Event, { event_type: "added_recipient" }>["payload"];
}): Promise<Response> {
  const body: Partial<Extract<Event, { event_type: "added_recipient" }>> = {
    event_type: "added_recipient",
    payload,
  };

  return fetch(`${EVENTS_ENDPOINT}/store`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

/**
 * Update a recipient.
 */
export function updateRecipient({
  apiKey,
  payload,
}: {
  apiKey: string;
  payload: Extract<Event, { event_type: "updated_recipient" }>["payload"];
}): Promise<Response> {
  const body: Partial<Extract<Event, { event_type: "updated_recipient" }>> = {
    event_type: "updated_recipient",
    payload,
  };

  return fetch(`${EVENTS_ENDPOINT}/store`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
