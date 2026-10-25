import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { Branch, MOCK_BRANCHES } from './branch.model';

@Injectable({ providedIn: 'root' })
export class BranchService {
  // Non ancora usato: predisposto per la sostituzione col vero endpoint HTTP
  private readonly http = inject(HttpClient);

  searchBranches(term: string): Observable<Branch[]> {
    const normalized = term.toLowerCase();
    // of: emette i dati mock; delay: simula la latenza di rete (400ms)
    return of(MOCK_BRANCHES).pipe(
      delay(400),
      // map: filtra le filiali per nome, città, indirizzo o CAP
      map((branches) =>
        branches.filter((b) =>
          [b.name, b.city, b.address, b.zipCode].some((f) => f.toLowerCase().includes(normalized)),
        ),
      ),
    );
  }
}
