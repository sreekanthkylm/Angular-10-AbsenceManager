import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchComponent } from './search.component';
import { formatDate } from '@angular/common';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SearchComponent],
      providers: [{ provide: Router, useValue: mockRouter }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to members page when search with user id', () => {
    component.userId = 24;
    component.searchUserAbsences();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/members'], { queryParams: { userId: 24 } });
  });

  it('should navigate to absences page when search with start and end dates', () => {
    component.startDate = new Date();
    component.endDate = new Date();
    component.searchAbsencesInDateRange();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/absences'], { queryParams: { startDate: formatDate(new Date(), 'y-MM-dd', 'en'), endDate: formatDate(new Date(), 'y-MM-dd', 'en') } });
  });

  it('should enable SearchButton when start and end dates are present', () => {
    component.startDate = new Date();
    component.endDate = new Date();
    component.enableSearchButton();
    expect(component.buttonDisabled).toEqual(false);
  });

  it('should enable UserSearchIcon when user id is present', () => {
    component.userId = 24;
    component.enableUserSearchIcon();
    expect(component.iconDisabled).toEqual(false);
  });

  it('should disable SearchButton when start and end dates are not present', () => {
    component.enableSearchButton();
    expect(component.buttonDisabled).toEqual(true);
  });

  it('should disable UserSearchIcon when user id is not present', () => {
    component.enableUserSearchIcon();
    expect(component.iconDisabled).toEqual(true);
  });
});
