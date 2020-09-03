import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbsenceManagerService } from "../../services/absence-manager.service";
import { ExportIcsService } from "../../services/export-ics.service";
import { forkJoin } from "rxjs";
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AbsencesComponent implements OnInit {

  gridColumns: number = 1;
  paramsList: any;
  // Storing All members abscence list for a given date range
  membersAbscencesList: Array<any> = [];
  /* Angular Material Table Data Variables */
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[];
  private paginator: MatPaginator;
  private sort: MatSort;
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private membersService: AbsenceManagerService, private exportIcsService: ExportIcsService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // Route Parameters Checking
    this.route.queryParamMap.subscribe((params) => {
      this.paramsList = { ...params.keys, ...params };
      // Check params have startdate and enddate for generating absences absences in the given date range
      if (this.paramsList.params.startDate && this.paramsList.params.endDate) {
        this.susbcribeMembersAbsences();
      }
      // All other Cases route to page not found
      else {
        this.router.navigateByUrl('/pagenotfound');
      }
    });
  }

  // Subscribe Members Api and Absences Api
  susbcribeMembersAbsences() {
    let members = this.membersService.getMembers();
    let absences = this.membersService.getAbsences();
    // Subscribe both members and absences results[0] is members and results[1] is absences
    forkJoin([members, absences]).subscribe(results => {
      // Filter Absence list within Specified date range.
      this.membersAbscencesList = results[1].payload.filter((abscence) => { return (abscence.endDate >= this.paramsList.params.startDate) && (abscence.startDate <= this.paramsList.params.endDate) });
      // Sort the list With StartDate
      this.membersAbscencesList.sort((a, b) => { return new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf() });
      // Generate members abscene list by merging abscenes list to members details
      for (let i = 0; i < this.membersAbscencesList.length; i++) {
        this.membersAbscencesList[i]["memberDetails"] = results[0].payload.find((member) => member.userId == this.membersAbscencesList[i].userId);
      }
      this.createAbsenceTable(this.membersAbscencesList);
    });
  }

  // Create Absence List Table For A Given Date Range 
  createAbsenceTable(abscenceList) {
    this.displayedColumns = ['UserName', 'UserId', 'CrewId', 'AbsenceType', 'StartDate', 'EndDate'];
    const absences = [];
    abscenceList.forEach((absence) => {
      absences.push({
        UserName: absence.memberDetails.name, UserId: absence.userId, CrewId: absence.crewId,
        AbsenceType: absence.type, StartDate: absence.startDate, EndDate: absence.endDate
      });
    });
    this.dataSource = new MatTableDataSource(absences);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Generate an iCal file for absences in a given date range (.ics)
  exportToIcs(membersAbscences) {
    this.exportIcsService.exportIcsMultiUser(membersAbscences);
  }

}
