# RxTracker

This is a small medication management application for caregivers, built in a week, as part of a take home interview assignment.

On the backend, it's using AWS Lambda, AWS API Gateway, and AWS RDS via the [serverless framework](https://www.serverless.com/).

On the frontend, it's using React, React Router (v7, data mode), and has a simple build system built on top of esbuild.

## What's Unique?

Something unique about this project is that it uses event sourcing for all state, with a simple IndexedDB read model. The benefits with this approach is that we only request the minimum data on subsequet page loads, which improve performance and lowers costs as the application scales. To learn more about event sourcing, I recommend watching one of Evan Young's talks (e.g. [this one](https://youtu.be/I3uH3iiiDqY?si=bFtrHfiEplQUi-85)).

Check the [shared/types.ts](https://github.com/persianturtle/rx-tracker/blob/main/shared/types.ts) file for a union of event types that the application supports. Here's a brief summary:

- added_recipient
- updated_recipient
- added_medication
- archived_medication
- marked_dose_as_taken
- unmarked_dose_as_taken

[Video Overview](https://drive.google.com/file/d/1NBQQjlPI-SVk8qAopPhGwY0VTp7VyOna/view?usp=sharing)

## Running the project

```sh
nvm use && cd frontend && npm i && npm start
open http://localhost:3000
```

To deploy you're own AWS stack, you can run:

```sh
nvm use && cd backend/src && serverless deploy
```

And then configure the endpoint in [endpoints.ts](https://github.com/persianturtle/rx-tracker/blob/109df4ee2c128d4460a8969ce077aaf253cf85f2/shared/endpoints.ts#L1-L2).

Otherwise, if my AWS stack is still running, you're free to use it.

## Running Tests

The testing approach I chose was to use Playwright to run user flows. To save on scope, I've added only one test. This test runs the user flow to add a recipient and mocks the network.

```sh
npm t
```

Headed mode:

```sh
npm run test:headed

# Click on the play icon to run the test
```

## Scope Cuts

1. I used API key based authentication as the user management strategy. You can change the logged in user by opening the navigation menu (by clicking on the hamburger menu icon). This cuts auth related scope (no need to handle user registration and user management), while ensuring that we are building a multi-tenant Sass application.

2. The frontend UI isn't pretty, though it is functional, and provides an accessible interface (i.e. try using keyboard only to navigate around).

3. This very well could have been a progressive web app with full offline support, and data persistence once the network connection became available. That being said, I chose to avoid doing this to be able to finish on time.

4. I'm sure that pair programming with someone would reveal some great ideas in terms of code organization, and I don't claim that the code is super well structured. However, given the short timeline, I'm okay with it.

5. There are some TODOs for things like adding error boundaries, handling more errors, etc. that I wasn't able to get to.
