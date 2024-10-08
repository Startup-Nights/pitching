import Table from "./table"

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

export default function Votes({ votes, registrations }: any) {
  const scores_preseed_jury = registrations.filter((registration: any) => registration.round === 'pre-seed').map((registration: any) => ({
    "name": registration.company,
    "points": calculateScore(registration.company, votes, 'jury'),
  })).sort((a: any, b: any) => a.points > b.points ? -1 : 1)
  const scores_preseed_public = registrations.filter((registration: any) => registration.round === 'pre-seed').map((registration: any) => ({
    "name": registration.company,
    "points": calculateScore(registration.company, votes, 'public'),
  })).sort((a: any, b: any) => a.points > b.points ? -1 : 1)

  const scores_seed_jury = registrations.filter((registration: any) => registration.round === 'seed').map((registration: any) => ({
    "name": registration.company,
    "points": calculateScore(registration.company, votes, 'jury'),
  })).sort((a: any, b: any) => a.points > b.points ? -1 : 1)
  const scores_seed_public = registrations.filter((registration: any) => registration.round === 'seed').map((registration: any) => ({
    "name": registration.company,
    "points": calculateScore(registration.company, votes, 'public'),
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
