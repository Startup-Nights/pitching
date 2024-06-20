import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Resource } from "sst"
import { json, useLoaderData } from "@remix-run/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const loader = async ({ params }: any) => {
  const registrations_key = 'pitching_registrations.json'
  const client = new S3Client({
    region: 'us-east-1',
  })
  const command = new GetObjectCommand({
    Bucket: Resource.PitchingSessionsBucket.name,
    Key: registrations_key,
  })

  const response = await client.send(command)
  const data = await response.Body?.transformToString()

  let registrations: Registration[] = []

  if (data) {
    registrations = JSON.parse(data)
  }

  return json({
    name: params.eventId,
    registrations: registrations
  })
};

export default function Index({ }) {
  const event = useLoaderData<typeof loader>()

  const filtered_registrations = event.registrations.filter((item) => item.round === event.name)
  const approved_registrations = event.registrations.filter((item) => item.approved)

  const stats = [
    { name: 'Number of applications', value: filtered_registrations.length, unit: '' },
    { name: 'Approval rate', value: (approved_registrations.length / Math.max(event.registrations.length, 1) * 100), unit: '%' },
  ]

  return (
    <div className="xl:pl-72">
      <main>
        <header>
          {/* Heading */}
          <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-x-3">
                <h1 className="flex gap-x-3 text-base leading-7">
                  <span className="font-semibold text-white">{event.name}</span>
                </h1>
              </div>
              <p className="mt-2 text-xs leading-6 text-gray-400">Startups and founders which signed for the {event.name} round</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, statIdx) => (
              <div
                key={stat.name}
                className={classNames(
                  statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                  'border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8',
                )}
              >
                <p className="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
                <p className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
                  {stat.unit ? <span className="text-sm text-gray-400">{stat.unit}</span> : null}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* Activity list */}
        <div className="border-t border-white/10 pt-11">
          <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">List of applications</h2>
          <table className="mt-6 w-full whitespace-nowrap text-left">
            <colgroup>
              <col className="lg:w-2/12" />
              <col className="lg:w-2/12" />
              <col className="lg:w-2/12" />
              <col className="lg:w-2/12" />
              <col className="lg:w-2/12" />
            </colgroup>
            <thead className="border-b border-white/10 text-sm leading-6 text-white">
              <tr>
                <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                  Name
                </th>
                <th scope="col" className="py-2 pl-0 pr-8 font-semibold sm:pl-6 lg:pl-8">
                  Company
                </th>
                <th scope="col" className="py-2 pl-0 pr-4 font-semibold sm:pl-6 lg:pl-8">
                  Website
                </th>
                <th scope="col" className="py-2 pl-0 pr-8 font-semibold sm:pl-6 lg:pl-8">
                  Pitching Deck
                </th>
                <th scope="col" className="py-2 pl-0 pr-4 font-semibold sm:pl-6 lg:pl-8">
                  Applied On
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered_registrations.map((item, i) => (
                <tr key={i}>
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center">
                      <div className="truncate text-sm font-medium leading-6 text-white">{item.firstname} {item.lastname}</div>
                    </div>
                  </td>
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center">
                      <div className="truncate text-sm font-medium leading-6 text-white">{item.company}</div>
                    </div>
                  </td>
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center">
                      <div className="truncate text-sm font-medium leading-6 text-white underline">
                        <a href={item.website} target="_blank">{item.website}</a>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center">
                      <div className="truncate text-sm font-medium leading-6 text-white underline">
                        <a href={item.pitching_deck} target="_blank">{item.pitching_deck}</a>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                    <div className="flex items-center">
                      <div className="truncate text-sm font-medium leading-6 text-white">{item.applied_on}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
