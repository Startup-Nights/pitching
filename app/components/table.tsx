export default function Table({ startups, title }: any) {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gray-900 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-white">{title}</h1>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                          Score
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                          Name
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {startups.map((startup) => (
                        <tr key={startup.name}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                            {startup.points}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{startup.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
