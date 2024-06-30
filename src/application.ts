enum Round {
  Seed = 'seed',
  PreSeed = 'pre-seed'
}

class Registration {
  company: string = '';
  website: string = '';
  pitching_deck: string = '';
  problem_description: string = '';
  problem_solution: string = '';
  problem_approach: string = '';
  userbase: string = '';
  revenue: string = '';
  advantage: string = '';
  money_usage: string = '';
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  linkedin: string = '';
  country: string = '';
  round: string = Round.PreSeed;
  funding: string = '';
  pitching: string = '';
  applied_on: string = '';

  approved: boolean = false;
}
