function calculateScore(name: string, data: any, voter: string): number {
  let points = 0

  data.filter((line: string[]) => line[1] === voter).forEach((line: string[]) => {
    if (voter === 'jury') {
      line.forEach((item: string, idx: number) => {
        if (item === name) {
          switch (idx) {
            case 5:
              points += 5
              break
            case 6:
              points += 4
              break
            case 7:
              points += 3
              break
            case 8:
              points += 2
              break
            case 9:
              points += 1
              break
          }
        }
      })
    } else {
      if (line[5] === name) {
        points += 1
      }
    }
  })

  return points
}

export default function Votes({ votes }: { votes: any[] }) {
  const pre_seed_startups = new Set<string>();
  const seed_startups = new Set<string>();

  const counter = [...Array(5).keys()]

  votes.forEach((vote, i) => {
    if (vote[2] === 'seed') {
      counter.forEach(i => {
        if (vote[5 + i] && vote[5 + i] !== '') {
          seed_startups.add(vote[5 + i])
        }
      })
    } else if (vote[2] === 'pre-seed') {
      counter.forEach(i => {
        if (vote[5 + i] && vote[5 + i] !== '') {
          pre_seed_startups.add(vote[5 + i])
        }
      })
    }
  })

  const pre_seed = Array.from(pre_seed_startups)
  const seed = Array.from(seed_startups)

  console.log(pre_seed)
  console.log(seed)

  const scores_preseed_public = pre_seed.map((startup: string) => ({
    "name": startup,
    "points": calculateScore(startup, votes, 'public'),
  })).sort((a: any, b: any) => a.points > b.points ? -1 : 1)

  const scores_seed_public = seed.map((startup: string) => ({
    "name": startup,
    "points": calculateScore(startup, votes, 'public'),
  })).sort((a: any, b: any) => a.points > b.points ? -1 : 1)

  const scores_preseed_jury = pre_seed.map((startup: string) => ({
    "name": startup,
    "points": calculateScore(startup, votes, 'jury'),
  })).sort((a: any, b: any) => a.points > b.points ? -1 : 1)

  const scores_seed_jury = seed.map((startup: string) => ({
    "name": startup,
    "points": calculateScore(startup, votes, 'jury'),
  })).sort((a: any, b: any) => a.points > b.points ? -1 : 1)

  return (
    <div className="xl:pl-72 flex flex-wrap">
      <Table startups={scores_preseed_public.slice(0, 10)} title={'Pre-Seed Public Voting'} />
      <Table startups={scores_preseed_jury.slice(0, 10)} title={'Pre-Seed Jury Voting'} />
      <Table startups={scores_seed_public.slice(0, 10)} title={'Seed Public Voting'} />
      <Table startups={scores_seed_jury.slice(0, 10)} title={'Seed Jury Voting'} />
    </div>
  )
}

function Table({ startups, title }: any) {
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
