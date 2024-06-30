import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DocumentChartBarIcon } from '@heroicons/react/24/solid'
import { json, useLoaderData, useNavigate } from '@remix-run/react'
import { Resource } from 'sst';
import * as crypto from "crypto";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { useState } from 'react';

export async function loader() {
  const client = new S3Client({
    region: 'us-east-1',
  })

  const command = new PutObjectCommand({
    Key: crypto.randomUUID(),
    Bucket: Resource.PitchingSessionsBucket.name,
  });
  const url_pitchdeck = await getSignedUrl(client, command);

  const url_registration_add = Resource.AddRegistration.url

  return json({
    url_pitchdeck: url_pitchdeck,
    url_registration_add: url_registration_add
  });
}

export default function Signup() {
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const on_submit = async (e: any) => {
    setLoading(true)
    e.preventDefault();
    const form_data = e.target as HTMLFormElement
    const file = form_data.pitchdeck.files?.[0]!;

    let pitchdeck = undefined

    if (file) {
      pitchdeck = await fetch(data.url_pitchdeck, {
        body: file,
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="${file.name}"`,
        },
      })
    }

    await fetch(data.url_registration_add, {
      body: JSON.stringify({
        company: form_data.company.value,
        website: form_data.website.value,
        pitching_deck: pitchdeck?.url.split("?")[0],
        problem_description: form_data.problem_description.value,
        problem_solution: form_data.problem_solution.value,
        problem_approach: form_data.problem_approach.value,
        userbase: form_data.userbase.value,
        revenue: form_data.revenue.value,
        advantage: form_data.advantage.value,
        money_usage: form_data.money_usage.value,
        firstname: form_data.first_name.value,
        lastname: form_data.last_name.value,
        email: form_data.email.value,
        linkedin: form_data.linkedin.value,
        country: form_data.country.value,
        round: form_data.round.value,
        funding: form_data.funding.value,
        pitching: form_data.pitching.value,
        applied_on: new Date().toDateString(),
        approved: false
      }),
      method: "PUT",
    })
      .then(() => navigate('/success'))
      .catch(err => {
        console.log(`failed to put registration: ${err}`)
      });
    setLoading(false)
  }

  return (
    <div className="xl:pl-72 max-w-6xl">
      <div className="px-4 sm:px-6 lg:px-8 mb-24">
        <div className='my-12 border-b border-white/10 pb-12'>
          <h2 className="text-3xl font-semibold leading-7 text-white">Sign up for the pitching competition</h2>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Share with the jury what makes your company unique and give a glimpse into your vision.
          </p>
        </div>

        <form onSubmit={async (e) => on_submit(e)}>
          <div className="space-y-12">

            <div className="border-b border-white/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">Personal Information</h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-white">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      required
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-white">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      required
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-white">
                    Linkedin
                  </label>
                  <div className="mt-2">
                    <input
                      id="linkedin"
                      required
                      name="linkedin"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                    Country
                  </label>
                  <div className="mt-2">
                    <input
                      id="country"
                      required
                      name="country"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="border-b border-white/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">Company information</h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="company" className="block text-sm font-medium leading-6 text-white">
                    Company Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      required
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="website" className="block text-sm font-medium leading-6 text-white">
                    Website
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="website"
                      id="website"
                      required
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-white">
                    Pitchdeck (optional)
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                    <div className="text-center">
                      <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-400">
                        <label
                          htmlFor="pitchdeck"
                          className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                        >
                          <span>{fileName != '' ? fileName : 'Select file to upload'}</span>
                          <input id="pitchdeck" name="pitchdeck" type="file" className="sr-only" onChange={(e) => setFileName(e.target.files ? e.target.files[0].name : '')} />
                        </label>
                        {fileName == '' && (<p className="pl-1">or drag and drop</p>)}
                      </div>
                      {fileName == '' && (<p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>)}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="problem_description" className="block text-sm font-medium leading-6 text-white">
                    What problem do you address?
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="problem_description"
                      required
                      name="problem_description"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="problem_solution" className="block text-sm font-medium leading-6 text-white">
                    How do you solve this problem?
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="problem_solution"
                      required
                      name="problem_solution"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="problem_approach" className="block text-sm font-medium leading-6 text-white">
                    What is unique about your problem-solving approach?
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="problem_approach"
                      required
                      name="problem_approach"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="userbase" className="block text-sm font-medium leading-6 text-white">
                    Who is your user and who is your paying customer (note: may be the same group)?
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="userbase"
                      required
                      name="userbase"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="revenue" className="block text-sm font-medium leading-6 text-white">
                    What is your current revenue to date? If none, how do you plan to make money?
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="revenue"
                      required
                      name="revenue"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="advantage" className="block text-sm font-medium leading-6 text-white">
                    What is your competitive advantage?
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="advantage"
                      required
                      name="advantage"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="money_usage" className="block text-sm font-medium leading-6 text-white">
                    If you won USD 1 Mio., how would you spend it?
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="money_usage"
                      required
                      name="money_usage"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="border-b border-white/10 pb-12">
              <div className="mt-10 space-y-10">
                <Fieldset text={'Which round do you apply for?'} name={'round'} values={[{ id: 'round-seed', value: 'seed' }, { id: 'pre-seed', value: 'round-pre-seed' }]} />
              </div>
            </div>

            <div className="border-b border-white/10 pb-12">
              <div className="mt-10 space-y-10">
                <Fieldset text={'Are you currently raising funds?'} name={'funding'} values={[{ id: 'founding-yes', value: 'yes' }, { id: 'founding-no', value: 'no' }]} />
              </div>
            </div>

            <div className="border-b border-white/10 pb-12">
              <div className="mt-10 space-y-10">
                <Fieldset text={'Did you already pitch to investors?'} name={'pitching'} values={[{ id: 'pitching-yes', value: 'yes' }, { id: 'pitching-no', value: 'no' }]} />
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 pb-12">
            <div className="mt-10 space-y-10">
              <p className='italic text-white text-sm font-medium leading-6'>
                By submitting the application I agree to the terms and conditions. I acknowledge and agree that if I register for the seed round, my registration details will be shared with the organisers of the <a className='underline' href='https://www.startupworldcup.io/' target='_blank'>Startup World Competition</a>.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )} Submit
            </button>
          </div>
        </form>
      </div >
    </div >
  )
}

function Fieldset({ text, name, values }: any) {
  return (
    <div className="mt-10 space-y-10">
      <fieldset>
        <legend className="text-sm font-semibold leading-6 text-white">{text}</legend>
        {values.map((item: any, i: number) => (
          <div className="mt-6 space-y-6" key={item.id}>
            <div className="flex items-center gap-x-3">
              <input
                id={item.id}
                required
                name={name}
                type="radio"
                value={item.value}
                className="h-4 w-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
              />
              <label htmlFor={item.id} className="block text-sm font-medium leading-6 text-white">
                {item.value}
              </label>
            </div>
          </div>
        ))}
      </fieldset>
    </div>
  )
}
