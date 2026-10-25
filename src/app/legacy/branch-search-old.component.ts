import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Branch } from '../branch-search/branch.model';
import { BranchService } from '../branch-search/branch.service';

/** Versione LEGACY con subscribe() manuali, mantenuta come riferimento del refactoring. */
@Component({
  selector: 'app-branch-search-old',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2>Cerca filiale (legacy)</h2>
      <input type="text" [formControl]="searchControl" placeholder="Città, nome, indirizzo o CAP" />

      <p *ngIf="isLoading">Caricamento...</p>
      <p *ngIf="error">{{ error }}</p>
      <ul *ngIf="!isLoading && !error">
        <li *ngFor="let branch of results">{{ branch.name }} - {{ branch.city }}</li>
      </ul>
    </section>
  `,
})
export class BranchSearchOld implements OnInit, OnDestroy {
  readonly searchControl = new FormControl('', { nonNullable: true });
  results: Branch[] = [];
  isLoading = false;
  error: string | null = null;
  private sub1?: Subscription;
  private sub2?: Subscription;

  constructor(
    private svc: BranchService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.sub1 = this.searchControl.valueChanges.subscribe((term) => {
      this.isLoading = true;
      this.error = null;
      this.sub2 = this.svc.searchBranches(term).subscribe({
        next: (r) => {
          this.results = r;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Errore';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
    });
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
  }
}
