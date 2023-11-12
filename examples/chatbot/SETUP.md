### Note

To effectively run the example, you need to create OpenAI and Pinecone accounts,
and still the example would be of limited use, as 1) you don't have any actions defined for the bot, and 2) the 
actions functionality is beyond the scope of this repo. Any part of state machines related to actions
was just left as is, as to extract it would take additional time.

In any way, the example may serve as just another, yet somewhat more complex, example of StateChains usage.

### Setup

1) copy the contents of the `chatbot` directory to the root of your cloned project
2) create a Pinecone index
3) modify `PINECONE_INDEX_URL: 'ENTER_INDEX_URL'` fragment in serverless.ts file by
entering the url of your index
4) create a set of parameters in Systems Manager Parameter Store. The Google API parameters
were originally used to have the chatbot perform event creation in Google Calendar.
`/pinecone/apikey` - assign Pinecone api key
`/openai/apikey` - assign OpenAI
`/googleapis/calendar/client_id` - assign some mock value
`/googleapis/calendar/client_secret` - assign some mock value
`/googleapis/calendar/refreshtoken` - assign some mock value
5) That's it, you can now deploy it with `sls deploy`, run locally with `npm run sm:test:unit` etc.
