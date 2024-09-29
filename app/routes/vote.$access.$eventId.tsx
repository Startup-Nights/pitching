import { DocumentChartBarIcon, GlobeEuropeAfricaIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { useNavigate, useParams } from "@remix-run/react";
import { Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

const companies = []

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
  if (votings.indexOf(access) === -1) {
    return false
  } else if (rounds.indexOf(event) === -1) {
    return false
  } else if (event === "seed" && access == "public") {
    return false
  }

  return true
}

export default function Vote() {
  const event = useParams().eventId as string
  const access = useParams().access as string

  const navigate = useNavigate()

  const [selected, setSelected] = useState([])
  const [showSuccess, setShowSucces] = useState(false)
  const [showError, setShowError] = useState(false)

  const [loading, setLoading] = useState(false)

  if (!isValidVoting(event, access)) {
    return (<div className="xl:pl-72 max-w-full">
      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-x-3">
            <h1 className="flex gap-x-3 text-base leading-7">
              <span className="font-semibold text-white">Vote</span>
            </h1>
          </div>
          <p className="mt-2 text-xs leading-6 text-gray-400">Nothing to see here. Try out the link we sent you or reach out to us for help.</p>
        </div>
      </div>
    </div>)
  }

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
      navigate(`/success_voting/${selected[0]}`)
    }
  }

  return (
    <div className="xl:pl-72 max-w-full">
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
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
                      className="inline-flex rounded-md bg-slate-500 text-slate-700 hover:text-slate-600 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

      <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div className='max-w-2xl'>
          <div className="flex items-center gap-x-3">
            <h1 className="flex gap-x-3 text-base leading-7">
              <span className="font-semibold text-white">Vote</span>
            </h1>
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-400">How the voting works: each startup has a card with their logo and additional information like website. By clicking on the name or logo, you select the startup. Note that the order in which you select the startup is important! The first startup gets more point (is deemed more important) than the later ones. After you have selected (exactly) 5 startups, you can submit the voting.</p>
          <div className='mt-2'>
            <p className="text-xs leading-5 text-gray-400">Selected startups (<span className={classNames(selected.length === 5 ? 'text-green-400' : 'text-red-400', 'font-bold')}>{selected.length}/5</span>) :</p>
            <ol className='ml-4 list-decimal text-gray-400 text-xs'>
              {selected.length > 0 && selected.map((item, idx) => (
                <li key={`company-list-item-${idx}`}>{item}</li>
              ))}
              {Array(Math.max(5 - selected.length, 0)).fill(0).map((item, idx) => (
                <li className='' key={`company-list-item-${idx}`}></li>
              ))}
            </ol>
          </div>
          <div className='mt-4'>
            <h1 className="flex gap-x-3 text-base leading-7">
              <span className="font-semibold text-white">Submission</span>
            </h1>
            <form onSubmit={handleSubmit} method="POST" className="space-y-4 mt-2">
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
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={classNames(
                    "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                    selected.length === 5 ? 'bg-purple-500 hover:bg-purple-400' : 'bg-gray-500 hover:bg-gray-400',
                  )}
                  disabled={selected.length !== 5}
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

      <div className="px-4 sm:px-6 lg:px-8 mb-24">
        <div className='pb-12'>
          <fieldset>
            <legend className="text-base font-semibold leading-6 text-gray-900">Startups</legend>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {companies.filter(company => company.round === event).map((company, companyIdx) => (
                <div key={companyIdx} className={classNames(
                  "relative flex flex-1 flex-col rounded-lg bg-gray-800 rounded-lg",
                  (selected.indexOf(company.company) !== -1) ? "ring-2 ring-purple-500 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900" : "ring-0",
                )}>
                  {(selected.indexOf(company.company) !== -1) && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full text-black grid justify-items-center content-center">
                      <span className='font-bold text-sm text-white'>{selected.indexOf(company.company) + 1}</span>
                    </div>
                  )}

                  <div className='relative flex flex-1 flex-col rounded-lg divide-y-2 divide-gray-600'>
                    <label htmlFor={`company-${companyIdx}`} className="text-center select-none text-gray-200 text-sm font-semibold">
                      <div className="min-w-0 flex-1 text-sm leading-6 py-4">
                        {company.company}
                      </div>
                    </label>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="flex w-0 flex-1">
                        <a
                          href={toWebsite(company.website)}
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-400"
                          target='_blank'
                        >
                          <GlobeEuropeAfricaIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                          Website
                        </a>
                      </div>
                    </div>
                    {(company.pitching_deck) && (access === 'jury') && (
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="flex w-0 flex-1">
                          <a
                            href={company.pitching_deck}
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-400"
                            target='_blank'
                          >
                            <DocumentChartBarIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                            Pitchdeck
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="ml-3 flex h-6 items-center hidden">
                      <input
                        id={`company-${companyIdx}`}
                        name={`company-${companyIdx}`}
                        type="checkbox"
                        checked={selected.indexOf(company.company) !== -1}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        onChange={(e) => {
                          console.log(company.company + ': is set: ' + (e as any).target.checked)
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
                          console.log(selected)
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
    </div >
  )
}
