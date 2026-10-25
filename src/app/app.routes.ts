import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./branch-search/branch-search.component').then((m) => m.BranchSearchComponent),
  },
  {
    path: 'legacy',
    loadComponent: () => import('./legacy/branch-search-old.component').then((m) => m.BranchSearchOld),
  },
  { path: '**', redirectTo: '' },
];
