import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  // TODO: Can be readonly
  private fruits = [
    'Apple',
    'Apricot',
    'Banana',
    'Blackberry',
    'Cantaloupe',
    'Cherry',
    'Date',
    'Dragonfruit',
    'Elderberry',
    'Eggfruit',
    'Feijoa',
    'Fig',
    'Gooseberry',
    'Grape',
    'Honeydew',
    'Huckleberry',
    'Imbe',
    'Indian Fig',
    'Jackfruit',
    'Jujube',
    'Kiwi',
    'Kumquat',
    'Lemon',
    'Lime',
    'Mango',
    'Mulberry',
    'Nance',
    'Nectarine',
    'Olive',
    'Orange',
    'Papaya',
    'Peach',
    'Pineapple',
    'Quandong',
    'Quince',
    'Rambutan',
    'Raspberry',
    'Salak',
    'Strawberry',
    'Tamarind',
    'Tangerine',
    'Ugli Fruit',
    'Uva',
    'Vanilla',
    'Voavanga',
    'Watermelon',
    'Xigua',
    'Yellow Passion Fruit',
    'Zucchini',
  ];

  // A library that finds similar words in the list
  private fuse = new Fuse(this.fruits, {
    includeScore: true,
    threshold: 0.4,
  });

  getSuggestedFruits(query: string): Observable<string[]> {
    // Early exits to make it clear what is the main path
    if (!query.trim()) return of([]);
    if (Math.random() < 0.5)
      return throwError(() => new Error('Random API failure')).pipe(delay(500));

    // Main path (improves readability)
    return of(this.fuse.search(query).map((result) => result.item)).pipe(
      delay(500)
    );
  }
}
