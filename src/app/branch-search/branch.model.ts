export interface Branch {
  id: number;
  name: string;
  city: string;
  address: string;
  zipCode: string;
  distanceKm: number;
}

export interface BranchSearchVM {
  term: string;
  results: Branch[];
  isLoading: boolean;
  error: string | null;
}

export const INITIAL_BRANCH_VM: BranchSearchVM = {
  term: '',
  results: [],
  isLoading: false,
  error: null,
};

export const MOCK_BRANCHES: Branch[] = [
  { id: 1, name: 'Filiale Duomo', city: 'Milano', address: 'Via Dante 12', zipCode: '20121', distanceKm: 1.2 },
  { id: 2, name: 'Filiale Termini', city: 'Roma', address: 'Via Giolitti 34', zipCode: '00185', distanceKm: 3.8 },
  { id: 3, name: 'Filiale Garibaldi', city: 'Torino', address: 'Corso Garibaldi 5', zipCode: '10122', distanceKm: 5.4 },
  { id: 4, name: 'Filiale Mercato', city: 'Napoli', address: 'Via Toledo 101', zipCode: '80134', distanceKm: 7.9 },
  { id: 5, name: 'Filiale Navigli', city: 'Milano', address: 'Alzaia Naviglio Grande 20', zipCode: '20144', distanceKm: 2.6 },
];
