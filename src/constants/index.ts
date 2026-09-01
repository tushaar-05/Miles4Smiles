export const EVENT_DETAILS = {
  name: 'Miles for Smiles',
  tagline: 'Run for a Cause, Spread a Smile',
  distance: '5KM',
  type: 'Charity Run',
  minAge: 10,
  adultMinAge: 40,
  expectedParticipants: 500,
  categories: [
    {
      id: 'male',
      label: 'Male Category (5KM)',
      ageRange: 'Age: 10 – 39 Years',
      description: 'Competitive 5K for Male participants (10-39 Yrs)',
    },
    {
      id: 'female',
      label: 'Female Category (5KM)',
      ageRange: 'Age: 10 – 39 Years',
      description: 'Competitive 5K for Female participants (10-39 Yrs)',
    },
    {
      id: 'adult',
      label: 'Senior Adult Category (5KM)',
      ageRange: 'Age: 40+ Years',
      description: 'Competitive 5K for Senior Adult & Master runners (40+ Yrs)',
    },
  ],
  prizes: {
    total: '₹30,000',
    top10Reward: 'Official Event T-Shirts to Top 10 Winners in each category',
    perCategory: {
      first: {
        amount: 5000,
        formatted: '₹5,000',
      },
      second: {
        amount: 3000,
        formatted: '₹3,000',
      },
      third: {
        amount: 2000,
        formatted: '₹2,000',
      },
    },
  },
} as const;
