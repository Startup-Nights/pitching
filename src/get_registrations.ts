import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";

export const handler: APIGatewayProxyHandlerV2 = async (evt) => {
  const registrations_key = 'pitching_registrations.json'
  const client = new S3Client({
    region: 'us-east-1',
  })
  const command = new GetObjectCommand({
    Bucket: Resource.PitchingSessionsBucket.name,
    Key: registrations_key,
  })

  try {
    const response = await client.send(command)
    const data = await response.Body?.transformToString()

    const registrations = data ? JSON.parse(data) : []

    return {
      statusCode: 200,
      body: JSON.stringify(registrations)
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify([])
    }
  }
};
