import { ArrowRightIcon, GlobeAltIcon, RocketLaunchIcon, TicketIcon } from "@heroicons/react/24/outline"
import { useParams } from "@remix-run/react"

export default function Signup() {
  const startup = decodeURIComponent(useParams().startup as string)

  return (
    <div className="xl:pl-72 max-w-6xl">
      <div className="px-4 sm:px-6 lg:px-8 mb-24 max-w-xl">
        <div className='my-12 pb-12'>
          <h2 className="text-3xl font-semibold leading-7 text-white">Thanks for casting your vote!</h2>
          <div className="mt-8 space-y-4">
            <p className="text-sm leading-6 text-gray-400">
              With a sprinkle of luck, you’ll see <span className="font-bold italic">{startup}</span> take the stage and rock that pitch!
            </p>
            <p className="text-sm leading-6 text-gray-400">
              If you don’t want to miss this one-of-a-kind show, grab your ticket now and enjoy a 15% discount {'-'} just use code <span className="font-bold italic">thx-for-your-vote_PC15</span>.
            </p>
            <p className="text-sm leading-6 text-gray-400">
              See you there — it's going to be legendary!
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 transition">
            <a
              className={"flex justify-center items-center rounded-xl gap-2 px-3 py-1.5 text-white text-sm font-semibold bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700"}
              href="https://www.b2match.com/e/startup-nights-2024/sign-up"
            >
              <TicketIcon className="h-5" />
              Onwards to the tickets!
            </a>
            <a
              className={"flex justify-center items-center rounded-xl gap-2 px-3 py-1.5 text-blue-600 text-sm font-semibold border-2 border-blue-600 hover:bg-blue-600 hover:text-white"}
              href="https://startup-nights.ch/pitching"
            >
              <GlobeAltIcon className="h-5" />
              Take me back
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
