import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { IncomingWebhook } from '@slack/webhook';

const url = Resource.SlackWebhookUrl.value
const webhook = new IncomingWebhook(url);

export const handler: APIGatewayProxyHandlerV2 = async (evt) => {
  const registrations_key = 'pitching_registrations.json'

  const client = new S3Client({
    region: 'us-east-1',
  })

  const get_cmd = new GetObjectCommand({
    Bucket: Resource.PitchingSessionsBucket.name,
    Key: registrations_key,
  })

  let registrations: Registration[] = []

  try {
    const response = await client.send(get_cmd)
    const data = await response.Body?.transformToString()
    registrations = data ? JSON.parse(data) : []
  } catch (error) {
    return { statusCode: 404 }
  }

  webhook.send({
    text: `Data Backup - Pitching Signup
${evt.body}`,
  }).catch(error => {
    return { statusCode: 500 }
  });

  if (evt.body === undefined) {
    return { statusCode: 500 }
  }

  registrations.push(JSON.parse(evt.body as string))

  const command = new PutObjectCommand({
    Key: registrations_key,
    Bucket: Resource.PitchingSessionsBucket.name,
    Body: JSON.stringify(registrations)
  });

  try {
    const response = await client.send(command)

    {
      // send the email
      const response = await fetch('https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-70cb3437-eee1-474d-8ad6-387035b15671/website/gmail', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: JSON.parse(evt.body).email,
          title: 'Thank You for Applying: Next Steps for the Pitching Competition',
          content: `Dear Founder,

Thank you for applying to our upcoming pitching competition! We’re thrilled to have you in the running and can’t wait to see your innovative ideas in action.

What Happens Next?

- Application Window: Open until 10th October 2024.
- Jury Voting Period: Our expert jury will review all applications and select the most promising startups over approximately two weeks.
- Selection Announcement: By 22nd October 2024, we will inform you if your startup has been selected to pitch.

Another Exciting Opportunity for You!
If you're seeking capital and valuable investor connections, we'd like to highlight another opportunity: Winti Ventures Pitch Event
Date: 30th October 2024
Location: Winterthur
Opportunity: Selected startups will have the chance to pitch their ideas to an exclusive group of angel investors and VCs.

Applications & Further Information: (https://winti-ventures.ch/)

This could be a fantastic chance to secure additional exposure and investment for your venture!

Thank you once again for your application. Stay tuned for updates, and best of luck in the competition!

Best regards,
Sarah & Désirée`,
        }),
      })

      const { error } = await response.json()
      if (error) {
        webhook.send({
          text: `FAILURE: sending booth signup mail: ${error.message || error.toString()} (<@U032DKKUCLX>)`,
        }).catch(errorSlack => {
          return { statusCode: 500 }
        });

        return { statusCode: 500 }
      }
    }

    return { statusCode: 200 }
  } catch (error) {
    return { statusCode: 404 }
  }
};
