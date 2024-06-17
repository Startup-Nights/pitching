import { Resource } from "sst";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


export async function loader() {
  const command = new PutObjectCommand({
    Key: crypto.randomUUID(),
    Bucket: Resource.PitchingSessionsBucket.name,
  });
  const url = await getSignedUrl(new S3Client({
    region: 'us-east-1',
  }), command);

  return json({ url });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <>index</>
  );
}
