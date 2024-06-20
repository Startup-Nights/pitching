enum Round {
  Seed = 'seed',
  PreSeed = 'pre-seed'
}

class Registration {
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  company: string = '';
  website: string = '';
  linkedin: string = '';
  pitching_deck: string = '';
  round: string = Round.PreSeed;
  is_raising_funds: boolean = false;
  has_already_pitched_to_investors: boolean = false;
  applied_on: string = '';

  approved: boolean = false;
}
