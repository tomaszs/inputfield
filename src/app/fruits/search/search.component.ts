import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { SearchService } from './services/search.service';

// In real app it can be stored in a consts file for whole app if applicable
// Named const makes it easier to change it and tell what it is
// For reusable component it would be an input with a default value
// Could be moved to Storybook too
const DEBOUNCE_TIME_MS = 300;

@Component({
  selector: 'app-search',
  standalone: true, // Better tree shaking, by default in latest Angular
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  // TODO: Could expose  events for being reusable
  // TODO: Could expose way to provide API or service for suggestions to be reusable
  // TODO: Template could use new templating system
  searchControl = new FormControl('');
  suggestions: string[] = [];
  isLoading = false;
  error: string | null = null;

  private searchService = inject(SearchService); // Clearer than constructor DI
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME_MS),
        distinctUntilChanged(), // We query only when query changes
        tap(() => {
          this.isLoading = true;
          this.error = null;
        }),
        switchMap((query) =>
          this.searchService.getSuggestedFruits(query || '').pipe(
            catchError(() => {
              this.error = 'Error fetching suggestions';
              return of([]);
            }),
            finalize(() => (this.isLoading = false))
          )
        ),
        takeUntil(this.destroy$) // Clears resources. It can be replaced with toSignal that unsubscribes automatically. No memory leaks, clearer code
      )
      .subscribe((results: string[]) => (this.suggestions = results));
  }

  ngOnDestroy() {
    this.destroy$.next(); // Signal all subscriptions to stop
    this.destroy$.complete(); // Clean up the subject
  }

  selectSuggestion(suggestion: string) {
    this.searchControl.setValue(suggestion, { emitEvent: false });
    this.suggestions = [];
  }
}
