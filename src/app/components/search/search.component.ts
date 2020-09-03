import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  userId: number;
  startDate: Date;
  endDate: Date;
  buttonDisabled: boolean = true;
  iconDisabled: boolean = true;

  constructor(private router: Router) { }

  searchUserAbsences() {
    this.router.navigate(['/members'], { queryParams: { userId: this.userId } });
  }

  searchAbsencesInDateRange() {
    this.router.navigate(['/absences'], { queryParams: { startDate: formatDate(this.startDate, 'y-MM-dd', 'en'), endDate: formatDate(this.endDate, 'y-MM-dd', 'en') } });
  }

  enableSearchButton() {
    (this.startDate && this.endDate) ? this.buttonDisabled = false : this.buttonDisabled = true;
  }

  enableUserSearchIcon() {
    this.userId ? this.iconDisabled = false : this.iconDisabled = true;
  }
}
