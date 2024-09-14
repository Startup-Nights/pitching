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

  registrations.push(JSON.parse(evt.body))

  const command = new PutObjectCommand({
    Key: registrations_key,
    Bucket: Resource.PitchingSessionsBucket.name,
    Body: JSON.stringify(registrations)
  });

  try {
    const response = await client.send(command)
  } catch (error) {
    return { statusCode: 404 }
  }

  // TODO: add and format the response according to desis info
  const email_response = 'some message'

  const response = await fetch('https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-70cb3437-eee1-474d-8ad6-387035b15671/website/gmail', {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          recipient: req.body.contact.email,
          title: 'Startup Nights 2024 Pitching Application',
          content: email_response,
      }),
  })
  
  const { error } = await response.json()
  if (error) {
      webhook.send({
          text: `FAILURE: sending booth pitchint signup mail: ${error.message || error.toString()} (<@U032DKKUCLX>)`,
      }).catch(errorSlack => {
          return res.status(500).json({ error: errorSlack.message || errorSlack.toString() + ' --- ' + error.message || error.toString() });
      });
  
      return res.status(500).json({ error: error.message || error.toString() });
  }

    return { statusCode: 200 }
};
