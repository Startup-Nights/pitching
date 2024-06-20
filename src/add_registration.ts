import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";

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

  registrations.push(JSON.parse(evt.body))

  const command = new PutObjectCommand({
    Key: registrations_key,
    Bucket: Resource.PitchingSessionsBucket.name,
    Body: JSON.stringify(registrations)
  });

  try {
    const response = await client.send(command)
    console.log(response)
    return { statusCode: 200 }
  } catch (error) {
    console.log(error)
    return { statusCode: 404 }
  }
};
