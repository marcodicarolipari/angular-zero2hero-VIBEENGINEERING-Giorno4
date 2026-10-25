import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { INITIAL_BRANCH_VM, BranchSearchVM } from './branch.model';
import { BranchService } from './branch.service';

@Component({
  selector: 'app-branch-search',
  imports: [ReactiveFormsModule],
  templateUrl: './branch-search.component.html',
  styleUrl: './branch-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchSearchComponent {
  private readonly branchService = inject(BranchService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly manualSearch$ = new Subject<string>();

  private readonly searchTerm$: Observable<string> = merge(
    // valueChanges: emette ad ogni digitazione
    this.searchControl.valueChanges,
    // manualSearch$: emette il valore corrente su Enter/click
    this.manualSearch$,
  ).pipe(
    // startWith: emette '' subito per mostrare lo stato iniziale
    startWith(''),
    // debounceTime: attende 300ms di pausa prima di procedere
    debounceTime(300),
    // map: rimuove gli spazi ai bordi
    map((term) => term.trim()),
    // distinctUntilChanged: ignora termini uguali al precedente
    distinctUntilChanged(),
    // filter: lascia passare il vuoto (reset) o termini di almeno 2 caratteri
    filter((term) => !term || term.length >= 2),
    // takeUntilDestroyed: chiude lo stream alla distruzione del componente
    takeUntilDestroyed(this.destroyRef),
  );

  private readonly vm$: Observable<BranchSearchVM> = this.searchTerm$.pipe(
    // switchMap: annulla la ricerca precedente se arriva un nuovo termine
    switchMap((term) => {
      if (!term) {
        return of(INITIAL_BRANCH_VM);
      }
      return this.branchService.searchBranches(term).pipe(
        // map: trasforma i risultati nel view model
        map((results): BranchSearchVM => ({ term, results, isLoading: false, error: null })),
        // startWith: emette subito lo stato di caricamento
        startWith<BranchSearchVM>({ term, results: [], isLoading: true, error: null }),
        // catchError: converte l'errore in un VM di errore senza chiudere lo stream esterno
        catchError(() =>
          of<BranchSearchVM>({
            term,
            results: [],
            isLoading: false,
            error: 'Impossibile caricare le filiali. Riprova più tardi.',
          }),
        ),
      );
    }),
  );

  readonly vm = toSignal(this.vm$, { initialValue: INITIAL_BRANCH_VM });

  onManualSearch(): void {
    this.manualSearch$.next(this.searchControl.value);
  }
}
