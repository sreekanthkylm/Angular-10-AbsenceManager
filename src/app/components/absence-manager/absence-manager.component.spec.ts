import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AbsenceManagerComponent } from './absence-manager.component';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AbsenceManagerService } from "../../services/absence-manager.service";
import { ExportIcsService } from "../../services/export-ics.service";

describe('AbsenceManagerComponent', () => {
  let component: AbsenceManagerComponent;
  let fixture: ComponentFixture<AbsenceManagerComponent>;
  let service: AbsenceManagerService;
  let exportservice: ExportIcsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AbsenceManagerComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            queryParamMap: of(
              convertToParamMap({ userId: '123' }),
              convertToParamMap({ startDate: '2017-01-01', endDate: '2017-02-01' }),
              convertToParamMap({})
            )
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceManagerComponent);
    component = fixture.componentInstance;
    service = TestBed.get(AbsenceManagerService);
    exportservice = TestBed.get(ExportIcsService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe both members and absences api', () => {
    spyOn(service, 'getMembers').and.returnValue(of({
      message: "success", payload: [{ name: "Mike", userId: 2664 }, { name: "Bernhard", userId: 2796 }]
    }));
    spyOn(service, 'getAbsences').and.returnValue(of({
      message: "success", payload: [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 },
      { endDate: "2017-01-05", startDate: "2017-01-05", type: "vacation", userId: 2796 }]
    }));
    component.susbcribeMembersAbsences();
    expect(component.membersList).toEqual([
      { name: "Mike", userId: 2664, absences: [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 }] },
      { name: "Bernhard", userId: 2796, absences: [{ endDate: "2017-01-05", startDate: "2017-01-05", type: "vacation", userId: 2796 }] }]);
  });

  it('should call ExportIcs Service for exporting absences list to Ics', () => {
    let membersList = [
      { name: "Mike", userId: 2664, absences: [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 }] },
      { name: "Bernhard", userId: 2796, absences: [{ endDate: "2017-01-05", startDate: "2017-01-05", type: "vacation", userId: 2796 }] }];
    var spyUpdate = spyOn(exportservice, "exportIcsMultiLoop").and.callThrough();
    component.exportToIcs(membersList);
    expect(spyUpdate).toHaveBeenCalledWith(membersList);
  });

  it('should call ExportIcs Service for exporting a member absences list to Ics', () => {
    let memberName = { name: "Mike", userId: 2664 };
    let memberAbscences = [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 }];
    var spyUpdate = spyOn(exportservice, "exportIcsSingleUser").and.callThrough();
    component.exportToIcsMember(memberAbscences, memberName);
    expect(spyUpdate).toHaveBeenCalledWith(memberAbscences, memberName);
  });

  it('should toggle Grid Columns to 3 if clicked and current columns are 2', () => {
    component.gridColumns = 2;
    component.toggleGridColumns();
    expect(component.gridColumns).toEqual(3);
  });

  it('should toggle Grid Columns to 2 if clicked and current columns are 3', () => {
    component.gridColumns = 3;
    component.toggleGridColumns();
    expect(component.gridColumns).toEqual(2);
  });
});
