import { useState } from "react"

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Password({ setUnlocked, check, title, message }: any) {
  const [firstTry, setFirstTry] = useState(true)

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-100">
            {title}
          </h2>

          <p className="mt-8 text-sm text-gray-500">
            {message}
          </p>

        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={(e: any) => {
            // TODO: check password
            e.preventDefault()

            if (e.target.password.value !== check) {
              setFirstTry(false)
              return
            }

            setUnlocked(true)
          }} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-400">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={() => setFirstTry(true)}
                  className={classNames(
                    "block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6",
                    firstTry ? '' : 'bg-red-400/50',
                  )}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
