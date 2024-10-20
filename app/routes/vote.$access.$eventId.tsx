import { DocumentChartBarIcon, GlobeEuropeAfricaIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Suspense, useEffect, useState } from 'react'
import { Await, isRouteErrorResponse, useLoaderData, useNavigate, useParams, useRouteError } from "@remix-run/react";
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationTriangleIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'
import Example from '~/components/modal';
import Password from '~/components/password';
import { LoaderFunctionArgs, defer } from '@remix-run/node';
import { Resource } from 'sst';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

function toWebsite(data: string): string {
  var website = data.split(' ')[0]
  if (!website.startsWith('http')) {
    website = 'https://' + website
  }
  return website
}

const votings = [
  "public",
  "jury",
]

const rounds = [
  "seed",
  "pre-seed",
]

function isValidVoting(event: string, access: string): boolean {
  return ((access === votings[0]) || (access === votings[1])) && ((event === rounds[0]) || (event === rounds[1]))
}

export async function loader({ params }: LoaderFunctionArgs) {
  return defer({
    registrations: fetch(Resource.GetRegistrations.url).then(e => e.json())
  })
};

export default function Vote() {
  const event = useParams().eventId as string
  const access = useParams().access as string

  const numberOfStartups = access === 'jury' ? 5 : 1

  const data = useLoaderData<typeof loader>()

  const navigate = useNavigate()

  const [alreadyVoted, setAlreadyVoted] = useState({ "seed": false, "pre-seed": false })
  const [selected, setSelected] = useState([])
  const [showSuccess, setShowSucces] = useState(false)
  const [showError, setShowError] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [clickedStartup, setClickedStartup] = useState("")

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // voting is only limited for the public
    if (access === 'public') {
      const data = localStorage.getItem("startup-nights-voting")
      if (data) {
        setAlreadyVoted({ ...alreadyVoted, ...JSON.parse(data) })
      }
    }
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const data = e.target

    setLoading(true)

    const response = await fetch('https://faas-fra1-afec6ce7.doserverless.co/api/v1/web/fn-70cb3437-eee1-474d-8ad6-387035b15671/website/sheets', {
      signal: AbortSignal.timeout(5000),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '1F4r2nCsQUIE38qOJaBzuyqHOtgVc3KshhucyOQI6zBU',
        range: 'A:I',
        data: [
          new Date().toString(),
          access,
          event,
          data.name.value,
          data.email.value,
          ...selected,
        ],
      }),
    })

    setLoading(false)
    const { error } = await response.json()
    if (error) {
      setShowError(true)
    } else {

      if (access === 'public') {
        alreadyVoted[`${event}`] = { "voted": true }
        localStorage.setItem("startup-nights-voting", JSON.stringify(alreadyVoted))
        const uri = encodeURIComponent(selected[0])
        navigate(`/success_voting/${uri}`)
      } else {
        setShowSucces(true)
        setSelected([])
      }
    }
  }

  if (!isValidVoting(event, access)) {
    return (<div className="xl:pl-72 max-w-full">
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-x-3">
            <h1 className="flex gap-x-3 text-base leading-7">
              <span className="font-semibold text-white">Vote</span>
            </h1>
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-400">Nothing to see here. Try out the link we sent you or reach out to us for help.</p>
        </div>
      </div>
    </div>)
  }

  const [unlocked, setUnlocked] = useState(false)

  if (access === 'jury' && !unlocked) {
    return (
      <Password setUnlocked={setUnlocked} check={'sn24#pitching-sessions_voting'} title={'Pitching Sessions Jury Voting'} message={'You received the password via mail. If you lost it, please reach out to us.'} />
    )
  }

  if (access !== 'jury') {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-100">
            Thank you for taking part in the voting!
          </h2>

          <p className="mt-8 text-sm text-gray-500">
            The voting is now closed and the winners will be announced shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="xl:pl-72 max-w-full">
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition show={showSuccess}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-white">Success! We received your vote.</p>
                    <p className="mt-1 text-sm text-slate-400">Thank you for voting. See you at the startup nights!</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSucces(false)
                      }}
                      className="inline-flex rounded-md bg-slate-500 text-slate-700 hover:text-slate-600 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
          <Transition show={showError}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-white">Shoot! Something went wrong.</p>
                    <p className="mt-1 text-sm text-slate-400">Please try again or get in touch with us.</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShowError(false)
                      }}
                      className="inline-flex rounded-md bg-slate-500 text-slate-700 hover:text-slate-600 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

        </div>
      </div>

      <Example open={modalOpen} setOpen={setModalOpen} startup={clickedStartup} />

      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 pb-12 lg:px-8">
          <div className='grid xl:grid-cols-2 mt-10 space-y-10 xl:space-y-0 xl:space-x-20 max-w-6xl'>

            <div className="max-w-xl">
              <div className="flex items-center gap-x-3">
                <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
                  <span className="font-semibold text-white">{access.charAt(0).toUpperCase() + access.slice(1)} Voting - {event.charAt(0).toUpperCase() + event.slice(1)} Round</span>
                </h1>
              </div>
              <p className="mt-4 text-sm leading-5 text-gray-400">How the voting works:</p>
              <ul className='text-gray-400 list-disc ml-4 text-sm mt-4 mt-4 leading-5 space-y-2'>
                <li>each startup has a card with their logo with additional information like website or similar</li>
                <li>by clicking on a logo or name, the startup is selected (note that the order is important - first startup gets the most points)</li>
                <li>when you have selected {numberOfStartups} startups, you can submit the voting by entering your name and email</li>
              </ul>
            </div>

            <div className="max-w-xl">
              <h1 className="flex gap-x-3 text-base leading-7">
                <span className="font-semibold text-white">Submission</span>
              </h1>

              <p className="mt-2 text-sm leading-5 text-gray-400">Startups selected: <span className={classNames(selected.length === numberOfStartups ? 'text-green-500' : 'text-red-500', 'font-bold')}>{selected.length}/{numberOfStartups}</span></p>

              <form onSubmit={handleSubmit} method="POST" className="space-y-4 mt-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-white hidden">
                    Name
                  </label>
                  <div className="">
                    <input
                      id="name"
                      name="name"
                      placeholder='Max Muster'
                      type="text"
                      required
                      autoComplete="name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-white hidden">
                    Email address
                  </label>
                  <div className="">
                    <input
                      id="email"
                      name="email"
                      placeholder='max@muster.ch'
                      type="email"
                      required
                      autoComplete="email"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {alreadyVoted[`${event}`]?.voted && (
                  <div>
                    <p className="mt-2 text-sm leading-5 text-red-400 italic">
                      A vote from this device is already registered. If you think this was a mistake, please get in touch with us.
                    </p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className={classNames(
                      "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                      selected.length === numberOfStartups && !alreadyVoted[`${event}`]?.voted ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-500 hover:bg-gray-400',
                    )}
                    disabled={selected.length !== numberOfStartups || alreadyVoted[`${event}`]?.voted}
                  >
                    {!loading && (
                      <span>Submit selection</span>
                    )}
                    {loading && (
                      <>
                        <span>Submitting...</span>
                        <svg className="animate-spin ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className='text-white'>Loading...</div>}>
        <Await resolve={data.registrations}>
          {(companies) => (
            <div className="px-4 sm:px-6 lg:px-8 mb-24">
              <div className='pb-12'>
                <fieldset>
                  <legend className="text-base font-semibold leading-6 text-gray-900">Startups</legend>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {companies.filter(company => company.round === event).filter(company => company.approved).map((company, companyIdx) => (
                      <div key={companyIdx} className={classNames(
                        "relative flex flex-1 flex-col rounded-2xl bg-gray-800 hover:scale-[1.01] transition",
                        (selected.indexOf(company.company) !== -1) ? "ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900" : "ring-0",
                      )}>
                        {(selected.indexOf(company.company) !== -1) && (
                          <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full text-black grid justify-items-center content-center">
                            <span className='font-bold text-sm text-white'>{selected.indexOf(company.company) + 1}</span>
                          </div>
                        )}

                        <div className='relative flex flex-1 flex-col rounded-lg p-3 xl:p-4'>
                          <label htmlFor={`company-${companyIdx}`} className="text-center select-none text-gray-200 text-sm font-semibold">
                            <div className='p-8 bg-slate-400 rounded-xl h-32 flex justify-center'>
                              <Logo company={company} />
                            </div>
                            <div className="min-w-0 flex-1 text-sm leading-6 py-4">
                              {company.company}
                            </div>
                          </label>

                          <div className={classNames('grid', access === 'jury' ? '2xl:grid-cols-2 gap-2' : '')}>
                            <div className="flex divide-x divide-gray-200 group">
                              <div className="flex w-0 flex-1">
                                <a
                                  href={toWebsite(company.website)}
                                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-lg border border-transparent py-4 text-sm font-semibold text-gray-400 group-hover:text-gray-200 bg-gray-700 group-hover:bg-gray-600"
                                  target='_blank'
                                >
                                  <GlobeEuropeAfricaIcon aria-hidden="true" className="h-5 w-5 text-gray-400 group-hover:text-gray-200" />
                                  <span className='truncate'>Website</span>
                                </a>
                              </div>
                            </div>
                            {(access === 'jury') && (company.pitching_deck) && (
                              <div className="flex divide-x divide-gray-200 group">
                                <div className="flex w-0 flex-1">
                                  <a
                                    href={company.pitching_deck}
                                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-lg border border-transparent py-4 text-sm font-semibold text-gray-400 group-hover:text-gray-200 bg-gray-700 group-hover:bg-gray-600"
                                    target='_blank'
                                  >
                                    <DocumentChartBarIcon aria-hidden="true" className="h-5 w-5 text-gray-400 group-hover:text-gray-200" />
                                    <span className='truncate'>Pitchdeck</span>
                                  </a>
                                </div>
                              </div>
                            )}
                            {(access === 'jury') && (!company.pitching_deck) && (
                              <div className="flex divide-x divide-gray-200">
                                <div className="flex w-0 flex-1">
                                  <p className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-lg border border-transparent py-4 px-4 text-sm font-semibold text-gray-400 italic bg-gray-900">
                                    <span className='truncate'>No pitchdeck provided</span>
                                  </p>
                                </div>
                              </div>
                            )}
                            {access === 'jury' && (
                              <div className="flex divide-x divide-gray-200 group">
                                <div className="flex w-0 flex-1">
                                  <button
                                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-lg border border-transparent py-4 text-sm font-semibold text-gray-400 group-hover:text-gray-200 bg-gray-700 group-hover:bg-gray-600"
                                    onClick={() => {
                                      setClickedStartup(company)
                                      setModalOpen(true)
                                    }}
                                  >
                                    <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-5 w-5 text-gray-400 group-hover:text-gray-200" />
                                    <span className='truncate hidden 3xl:flex'>More information</span>
                                    <span className='truncate 3xl:hidden'>Infos</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="hidden">
                            <input
                              id={`company-${companyIdx}`}
                              name={`company-${companyIdx}`}
                              type="checkbox"
                              checked={selected.indexOf(company.company) !== -1}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                              onChange={(e) => {
                                const idx = selected.indexOf(company.company)
                                if ((e as any).target.checked) {
                                  if (idx == -1) {
                                    selected.push(company.company)
                                  }
                                } else {
                                  if (idx > -1) {
                                    selected.splice(idx, 1)
                                  }
                                }
                                setSelected([...selected])
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div >
          )}
        </Await>
      </Suspense>
    </div >
  )
}

function Logo({ company }: any): any {
  const available = company.logo && company.logo !== ""

  if (available) {
    return (
      <img src={company.logo} alt={company.company} className='object-contain' />
    )
  }

  return (
    <PhotoIcon className='text-slate-300' />
  )
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    <div className="xl:ml-72 max-w-full text-white p-4">
      <p>Something went wrong. Please try again.</p>
    </div>
  }

  return (
    <div className="xl:ml-72 max-w-full text-white p-4">
      <p>Something went wrong. Please try again.</p>
    </div>
  )
}
