import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "pg";

export const read = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const client = getPostgreSQLClient();
  const caregiverId = getCaregiverId(event.headers["x-api-key"]);
  const lastEventId = event.queryStringParameters?.["lastEventId"];

  if (lastEventId) {
    const query = `
    SELECT * FROM events 
    WHERE caregiver_id = $1 AND id > $2 
    ORDER BY timestamp DESC;
  `;

    await client.connect();
    const res = await client.query(query, [caregiverId, lastEventId]);
    await client.end();

    // TODO: handle errors, e.g. what if lastEventId is provided but not valid?
    // TODO: handle pagination

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: res,
      }),
    };
  } else {
    const query = `
    SELECT * FROM events 
    WHERE caregiver_id = $1 
    ORDER BY timestamp DESC;
  `;

    await client.connect();
    const res = await client.query(query, [caregiverId]);
    await client.end();

    // TODO: handle pagination

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: res,
      }),
    };
  }
};

/**
curl -X POST https://zitkwp8dqf.execute-api.us-east-1.amazonaws.com/dev/store \
     -H "x-api-key: Ld6nYabJTJ13Qil6nwJBk8qrA2hUVaN52OboRJgZ" \
     -H "Content-Type: application/json" \
     -d '{"event_type": "added_recipient", "payload": {"name": "John Doe"}}'
 */
export const store = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const client = getPostgreSQLClient();
  const caregiverId = getCaregiverId(event.headers["x-api-key"]);
  const { event_type, payload } = JSON.parse(event.body ?? "{}");

  // TODO: hanlde errors, e.g. what if caregiverId is null?

  if (!(event_type && payload)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: "Missing required fields: event_type, or payload",
      }),
    };
  }

  const query = `
    INSERT INTO events (event_type, caregiver_id, payload)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  await client.connect();
  const res = await client.query(query, [event_type, caregiverId, payload]);
  await client.end();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      data: res,
    }),
  };
};

/**
 * This is temporary.

curl -X DELETE -H "x-api-key: Ld6nYabJTJ13Qil6nwJBk8qrA2hUVaN52OboRJgZ" \
  https://zitkwp8dqf.execute-api.us-east-1.amazonaws.com/dev/reset
 */
export const reset = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const client = getPostgreSQLClient();

  const query = `
    DROP TABLE IF EXISTS events;
    CREATE TABLE events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type TEXT NOT NULL,
      caregiver_id TEXT NOT NULL,
      payload JSONB NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await client.connect();
  const res = await client.query(query);
  await client.end();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      data: res,
    }),
  };
};

function getCaregiverId(apiKey: string | undefined): string | null {
  switch (apiKey) {
    case "zAVMbyhsmj9dAJ9USwijrIdsfng9HWQ7yXYpWfb0":
      return "Caregiver 1";
    case "Ld6nYabJTJ13Qil6nwJBk8qrA2hUVaN52OboRJgZ":
      return "Caregiver 2";
    default:
      return null;
  }
}

function getPostgreSQLClient(): Client {
  return new Client({
    host: process.env["PG_HOST"],
    port: Number(process.env["PG_PORT"]),
    user: process.env["PG_USER"],
    password: process.env["PG_PASSWORD"],
    database: process.env["PG_DATABASE"],
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-api-key",
};
