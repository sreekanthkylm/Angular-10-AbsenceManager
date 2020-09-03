import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AbsencesComponent } from './absences.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AbsenceManagerService } from "../../services/absence-manager.service";
import { ExportIcsService } from "../../services/export-ics.service";

describe('AbsencesComponent', () => {
  let component: AbsencesComponent;
  let fixture: ComponentFixture<AbsencesComponent>;
  let service: AbsenceManagerService;
  let exportservice: ExportIcsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AbsencesComponent],
      providers: [{
        provide: ActivatedRoute, useValue: {
          queryParamMap: of(convertToParamMap({ startDate: '2017-01-01', endDate: '2017-02-01' }))
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsencesComponent);
    component = fixture.componentInstance;
    service = TestBed.get(AbsenceManagerService);
    exportservice = TestBed.get(ExportIcsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe both members and absences api if start date and end date is present in route paramters', () => {
    component.paramsList.params.startDate = '2017-01-12';
    component.paramsList.params.endDate = '2017-01-15';
    spyOn(service, 'getMembers').and.returnValue(of({
      message: "success", payload: [{ name: "Mike", userId: 2664 }, { name: "Bernhard", userId: 2796 }]
    }));
    spyOn(service, 'getAbsences').and.returnValue(of({
      message: "success", payload: [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 },
      { endDate: "2017-01-05", startDate: "2017-01-05", type: "vacation", userId: 2796 }]
    }));
    component.susbcribeMembersAbsences();
    expect(component.membersAbscencesList).toEqual([{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664, memberDetails: { name: "Mike", userId: 2664 } }]);
  });

  it('should call ExportIcs Service for exporting absences list to Ics', () => {
    let memberAbscences = [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664, memberDetails: { name: "Mike", userId: 2664 } }];
    var spyUpdate = spyOn(exportservice, "exportIcsMultiUser").and.callThrough();
    component.exportToIcs(memberAbscences);
    expect(spyUpdate).toHaveBeenCalledWith(memberAbscences);
  });
});
