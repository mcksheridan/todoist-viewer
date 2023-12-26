# Starter Build

## Setting up
1. After cloning the project, run `cp .env.sample .env` to create an environment variable file.
2. Copy an [API token](https://developer.todoist.com/rest/v2/?shell#authorization) from Todoist to use as the `TODOIST_API` token.
3. To find an ID for a project, you can run a [cURL command](https://developer.todoist.com/rest/v2/?shell#get-all-projects) for getting information on your ToDoist projects, where `TODOIST_API` has been replaced with an actual API key:
```
curl -X GET \
https://api.todoist.com/rest/v2/projects \
-H "Authorization: Bearer TODOIST_API"
```
4. Add the ID for the desired project to the environment variable files as the `PROJECT_ID`.
5. Install dependencies and run `npm start` to begin the project on [localhost](https://localhost:8080).
