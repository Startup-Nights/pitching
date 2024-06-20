import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Resource } from "sst"

const registrations_key = 'pitching_registrations.json'

const client = new S3Client({})

const command = new GetObjectCommand({
  Bucket: Resource.PitchingSessionsBucket.name,
  Key: registrations_key,
})

const response = await client.send(command)
const data = await response.Body?.transformToString()
console.log(data)
