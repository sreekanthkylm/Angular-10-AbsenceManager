import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbsenceManagerService } from "../../services/absence-manager.service";
import { ExportIcsService } from "../../services/export-ics.service";
import { forkJoin } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-absence-manager',
  templateUrl: './absence-manager.component.html',
  styleUrls: ['./absence-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AbsenceManagerComponent implements OnInit {

  gridColumns: number = 1;
  paramsList: any;
  // Storing all members Details
  membersList: Array<any> = [];

  constructor(private membersService: AbsenceManagerService, private exportIcsService: ExportIcsService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // Route Parameters Checking
    this.route.queryParamMap.subscribe((params) => {
      this.paramsList = { ...params.keys, ...params };
      // Check params have userId for generating a single users absences
      if (this.paramsList.params.userId) {
        this.router.navigate(['/members'], { queryParams: { userId: this.paramsList.params.userId } });
      }
      // Check params have startdate and enddate for generating absences absences in the given date range
      else if (this.paramsList.params.startDate && this.paramsList.params.endDate) {
        this.router.navigate(['/absences'], { queryParams: { startDate: this.paramsList.params.startDate, endDate: this.paramsList.params.endDate } });
      }
      // If url is empty generate MemberList with abscenes grouped list
      else if (Object.keys(this.paramsList.params).length === 0) {
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
    // Subscribe both members and absences
    forkJoin([members, absences]).subscribe(results => {
      // results[0] is members and results[1] is absences
      this.getMembersAbscences(results[0].payload, results[1].payload);
    });
  }

  // Get Abscence List For All Members
  getMembersAbscences(members, absences) {
    this.gridColumns = 2;
    this.membersList = members.sort((a, b) => a.userId - b.userId);
    // Group Abscences Based on userId
    let absenceGroup = absences.reduce((r, a) => {
      r[a.userId] = [...r[a.userId] || [], a];
      return r;
    }, {});
    // Generate members abscene list by merging abscenes list to members list
    for (let i = 0; i < this.membersList.length; i++) {
      for (let key in absenceGroup) {
        if (absenceGroup.hasOwnProperty(key) && this.membersList[i].userId == key) {
          this.membersList[i].absences = absenceGroup[key];
          console.log(this.membersList,"members");
        }
      }
    }
  }

  // Managing Number of Grid Items
  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 2 ? 3 : 2;
  }

  // Generate an iCal file for multi users (.ics)
  exportToIcs(membersList) {
    this.exportIcsService.exportIcsMultiLoop(membersList);
  }

  // Generate an iCal file for Single user(.ics)
  exportToIcsMember(memberAbscences, memberName) {
    this.exportIcsService.exportIcsSingleUser(memberAbscences, memberName);
  }
}