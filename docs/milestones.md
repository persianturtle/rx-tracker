# Milestones

1. Set up API key authentication as our user management strategy. This cuts auth related scope (no need to handle user registration and user management), while ensuring that we are building a multi-tenant Sass application.

2. Build a bare bones frontend that can create and read events stored in RDS (PostgreSQL). We'll use an event sourced architecture here, and will used IndexedDB as our read model. This approach minimizes the data fetched on page load, allows the UI to show cached data immediately on page load, and reduces server load as the data per user grows over time.

To reduce scope, we won't make this a progressive web app, though, this application would likely be a good candidate, especially with the ability to make changes while offline, and have those changes sync when connected to the network.

3. Research user experience solutions for this type of application. What UI are users already comfortable with? Ideally, we'd work with a designer here, but I'll try to create a pleasant UX that is maintanable, potentially using a design system.
