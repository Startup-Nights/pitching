import { useParams } from "@remix-run/react"

export default function Signup() {
  const startup = useParams().startup as string

  return (
    <div className="xl:pl-72 max-w-6xl">
      <div className="px-4 sm:px-6 lg:px-8 mb-24">
        <div className='my-12 pb-12'>
          <h2 className="text-3xl font-semibold leading-7 text-white">Thanks for voting!</h2>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            With a bit of luck, your first choice <span className="font-bold italic">{startup}</span> will be pitching at the Startup Nights!
          </p>

          <p className="mt-4 text-sm leading-6 text-gray-400">
            Don't worry though if you haven't got a ticket yet - we got you! Use the discount code <span className="font-bold italic">thx-for-your-vote_PC15</span> when registering as a small token of appreciation.
          </p>

          <p className="mt-4 text-sm leading-6 text-gray-400">
            See you soon!
          </p>
        </div>
      </div>
    </div>
  )
}
