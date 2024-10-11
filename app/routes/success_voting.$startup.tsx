import { useParams } from "@remix-run/react"

export default function Signup() {
  const startup = decodeURIComponent(useParams().startup as string)

  return (
    <div className="xl:pl-72 max-w-6xl">
      <div className="px-4 sm:px-6 lg:px-8 mb-24">
        <div className='my-12 pb-12'>
          <h2 className="text-3xl font-semibold leading-7 text-white">Thanks for casting your vote!</h2>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            With a sprinkle of luck, you’ll see <span className="font-bold italic">{startup}</span> take the stage and rock that pitch!
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            If you don’t want to miss this one-of-a-kind show, grab your ticket now and enjoy a 15% discount—just use code <span className="font-bold italic">thx-for-your-vote_PC15</span>.
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            See you there — it's going to be legendary!
          </p>
        </div>
      </div>
    </div>
  )
}
