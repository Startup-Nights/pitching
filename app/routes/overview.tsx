import { LoaderFunctionArgs, defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";
import Votes from "~/components/votes";
import Password from "~/components/password";
import { Resource } from "sst";


export async function loader({ params }: LoaderFunctionArgs) {
  return defer({
    votes: fetch('https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-70cb3437-eee1-474d-8ad6-387035b15671/website/sheets', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '1F4r2nCsQUIE38qOJaBzuyqHOtgVc3KshhucyOQI6zBU',
        range: 'A:I',
      }),
    }).then(e => e.json()),
    registrations: fetch(Resource.GetRegistrations.url).then(e => e.json())
  })
};

export default function Overview() {
  const [unlocked, setUnlocked] = useState(false)
  const data = useLoaderData<typeof loader>()

  if (!unlocked) {
    return (
      <Password setUnlocked={setUnlocked} check={'sn24#pitching-sessions_overview'} title={'Overview'} message={'In case you forgot your password, check with your IT department.'} />
    )
  }

  return (
    <>
      <div className="">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={data.votes}>
            {(v: any) => (
              <Await resolve={data.registrations}>
                {(r: any) => (
                  <Votes votes={v.data} registrations={r} />
                )}
              </Await>
            )}
          </Await>
        </Suspense>
      </div>
    </>
  )
}
