export const EVENT_DETAILS = {
  name: 'Miles for Smiles',
  tagline: 'Run for a Cause, Spread a Smile',
  distance: '5KM',
  type: 'Charity Run',
  expectedParticipants: 500,
  categories: [
    {
      id: 'boys',
      label: 'Boys (5KM)',
      description: 'Under & Open categories for Boys',
    },
    {
      id: 'girls',
      label: 'Girls (5KM)',
      description: 'Under & Open categories for Girls',
    },
  ],
  prizes: {
    first: {
      amount: 10000,
      formatted: '₹10,000',
    },
    second: {
      amount: 7500,
      formatted: '₹7,500',
    },
  },
} as const;
