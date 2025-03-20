import { test, expect } from "@playwright/test";

const EVENTS_ENDPOINT =
  "https://zitkwp8dqf.execute-api.us-east-1.amazonaws.com/dev";

test("add recipient", async ({ page }) => {
  const newRecipient = {
    name: "Phillip",
    id: "0e992286-b2fa-4f3c-9a23-4edc9507b0b7",
  };

  const ADDED_RECIPIENT_EVENT_FOR_PHILLIP = [
    {
      id: newRecipient.id,
      event_type: "added_recipient",
      caregiver_id: "Caregiver 1",
      payload: {
        name: newRecipient.name,
      },
      timestamp: new Date().toISOString(),
    },
  ];

  await page.route(`${EVENTS_ENDPOINT}/read`, (route) => {
    route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [],
      }),
    });
  });

  await page.goto("http://localhost:3000/");

  await expect(
    await page.locator("h2", { hasText: "Welcome, Caregiver 1!" })
  ).toBeVisible();

  await page.getByRole("link", { name: /add new recipient/i }).click();

  await expect(
    page.locator("h2", { hasText: "Add New Recipient" })
  ).toBeVisible();

  await page.route(`${EVENTS_ENDPOINT}/store`, (route) => {
    route.fulfill({
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.fill('input[name="name"]', newRecipient.name);
  await page.click('button[type="submit"]');

  await page.route(`${EVENTS_ENDPOINT}/read`, (route) => {
    route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: ADDED_RECIPIENT_EVENT_FOR_PHILLIP,
      }),
    });
  });

  await page.route(
    `${EVENTS_ENDPOINT}/read?cachedEventTimestamp=1970-01-01T00:00:00.000Z`,
    (route) => {
      route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: ADDED_RECIPIENT_EVENT_FOR_PHILLIP,
        }),
      });
    }
  );

  await expect(
    page.getByRole("link", { name: newRecipient.name })
  ).toBeVisible();
});
