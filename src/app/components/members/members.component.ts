import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbsenceManagerService } from "../../services/absence-manager.service";
import { ExportIcsService } from "../../services/export-ics.service";
import { forkJoin } from "rxjs";
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MembersComponent implements OnInit {

  gridColumns: number = 1;
  paramsList: any;
  // Storing a single member Details
  memberDetails: {} = {};
  // Storing Single member abscence list
  memberAbscencesList: Array<any> = [];

  constructor(private membersService: AbsenceManagerService, private exportIcsService: ExportIcsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // Route Parameters Checking
    this.route.queryParamMap.subscribe((params) => {
      this.paramsList = { ...params.keys, ...params };
      // Check params have userId for generating a single users absences
      if (this.paramsList.params.userId) {
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
      // Generate A Single Member Abscence List
      this.memberDetails = results[0].payload.find((member) => member.userId == this.paramsList.params.userId);
      this.memberAbscencesList = results[1].payload.filter((abscence) => abscence.userId == this.paramsList.params.userId);
      if (typeof this.memberDetails === "undefined") this.router.navigateByUrl('/pagenotfound');
    });
  }

  // Generate an iCal file for Single user(.ics)
  exportToIcs(memberAbscences, memberName) {
    this.exportIcsService.exportIcsSingleUser(memberAbscences, memberName);
  }
}
