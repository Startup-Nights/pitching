import { Resource } from "sst"
import { Await, defer, json, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  return defer({
    name: params.eventId,
    registrations: (await fetch(Resource.GetRegistrations.url)).json()
  })
};

export default function Index({ }) {
  const event = useLoaderData<typeof loader>()

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
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={event.registrations}>
            {(e) => <EventTable event={e} name={event.name} />}
          </Await>
        </Suspense>
      </main>
    </div >
  )
}


function EventTable({ event, name }: any) {
  const filtered_registrations = event.filter((item: any) => item.round === name)

  return (
    <>
      {/* Activity list */}
      < div className="border-t border-white/10 pt-11" >
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
                    <div className="truncate overflow-hidden text-sm font-medium leading-6 text-white">{item.firstname} {item.lastname}</div>
                  </div>
                </td>
                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                  <div className="flex items-center">
                    <div className="truncate overflow-hidden text-sm font-medium leading-6 text-white">{item.company}</div>
                  </div>
                </td>
                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                  <div className="flex items-center">
                    <div className="truncate overflow-hidden text-sm font-medium leading-6 text-white underline">
                      <a href={item.website} target="_blank">{item.website}</a>
                    </div>
                  </div>
                </td>
                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                  <div className="flex items-center">
                    <div className="truncate overflow-hidden text-sm font-medium leading-6 text-white underline">
                      <a href={item.pitching_deck} target="_blank">Link</a>
                    </div>
                  </div>
                </td>
                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                  <div className="flex items-center">
                    <div className="truncate overflow-hidden text-sm font-medium leading-6 text-white">{item.applied_on}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div >
    </>
  )
}
