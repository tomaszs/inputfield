import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty array for empty input', (done) => {
    service.getSuggestedFruits('').subscribe((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('should return an empty array for whitespace input', (done) => {
    service.getSuggestedFruits('   ').subscribe((results) => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('should return matching fruits when valid input is provided', (done) => {
    spyOn(Math, 'random').and.returnValue(0.6); // Ensure no API failure

    service.getSuggestedFruits('apple').subscribe((results) => {
      expect(results).toContain('Apple'); // Fuzzy match should find "Apple"
      done();
    });
  });

  it('should return multiple results for a partial match', (done) => {
    spyOn(Math, 'random').and.returnValue(0.6); // Prevent API failure

    service.getSuggestedFruits('upple').subscribe((results) => {
      expect(results.length).toBeGreaterThan(1);
      expect(results).toEqual(jasmine.arrayContaining(['Apple']));
      done();
    });
  });

  it('should simulate an API failure randomly', (done) => {
    spyOn(Math, 'random').and.returnValue(0.3); // Force failure

    service.getSuggestedFruits('apple').subscribe({
      next: () => fail('Expected an error, but got results'),
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Random API failure');
        done();
      },
    });
  });
});
