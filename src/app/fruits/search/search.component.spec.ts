import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SearchComponent } from './search.component';
import { SearchService } from './services/search.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['getSuggestedFruits']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent, ReactiveFormsModule],
      providers: [{ provide: SearchService, useValue: searchServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty search field', () => {
    expect(component.searchControl.value).toBe('');
  });

  it('should call the search service when input changes', fakeAsync(() => {
    searchServiceSpy.getSuggestedFruits.and.returnValue(of(['Apple', 'Apricot']));

    component.searchControl.setValue('Ap');
    tick(300);

    expect(searchServiceSpy.getSuggestedFruits).toHaveBeenCalledWith('Ap');
    expect(component.suggestions).toEqual(['Apple', 'Apricot']);
  }));

  it('should handle API errors gracefully', fakeAsync(() => {
    searchServiceSpy.getSuggestedFruits.and.returnValue(of([]));

    component.searchControl.setValue('Invalid');
    tick(300);

    expect(component.error).toBeNull();
    expect(component.suggestions).toEqual([]);
  }));

  it('should clear suggestions when selecting a suggestion', () => {
    component.suggestions = ['Apple', 'Apricot'];
    component.selectSuggestion('Apple');

    expect(component.searchControl.value).toBe('Apple');
    expect(component.suggestions).toEqual([]);
  });

  it('should unsubscribe on destroy', () => {
    const spy = spyOn(component['destroy$'], 'next');
    const spyComplete = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
