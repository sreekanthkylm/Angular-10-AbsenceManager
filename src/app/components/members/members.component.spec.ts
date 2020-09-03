import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MembersComponent } from './members.component';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AbsenceManagerService } from "../../services/absence-manager.service";
import { ExportIcsService } from "../../services/export-ics.service";

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  let service: AbsenceManagerService;
  let exportservice: ExportIcsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MembersComponent],
      providers: [{
        provide: ActivatedRoute, useValue: {
          queryParamMap: of(convertToParamMap({ userId: '123' }))
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    service = TestBed.get(AbsenceManagerService);
    exportservice = TestBed.get(ExportIcsService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe both members and absences api if user id is present in route paramters', () => {
    component.paramsList.params.userId = 2664;
    spyOn(service, 'getMembers').and.returnValue(of({
      message: "success", payload: [{ name: "Mike", userId: 2664 }, { name: "Bernhard", userId: 2796 }]
    }));
    spyOn(service, 'getAbsences').and.returnValue(of({
      message: "success", payload: [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 },
      { endDate: "2017-01-05", startDate: "2017-01-05", type: "vacation", userId: 2796 }]
    }));
    component.susbcribeMembersAbsences();
    expect(component.memberDetails).toEqual({ name: "Mike", userId: 2664 });
    expect(component.memberAbscencesList).toEqual([{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 }]);
  });

  it('should call ExportIcs Service for exporting absences list to Ics', () => {
    let memberName = { name: "Mike", userId: 2664 };
    let memberAbscences = [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 }];
    var spyUpdate = spyOn(exportservice, "exportIcsSingleUser").and.callThrough();
    component.exportToIcs(memberAbscences, memberName);
    expect(spyUpdate).toHaveBeenCalledWith(memberAbscences, memberName);
  });

  it('should route to pagenotfound if given userid is not in the users list', () => {
    component.paramsList.params.userId = 1;
    spyOn(service, 'getMembers').and.returnValue(of({
      message: "success", payload: [{ name: "Mike", userId: 2664 }, { name: "Bernhard", userId: 2796 }]
    }));
    spyOn(service, 'getAbsences').and.returnValue(of({
      message: "success", payload: [{ endDate: "2017-01-13", startDate: "2017-01-13", type: "sickness", userId: 2664 },
      { endDate: "2017-01-05", startDate: "2017-01-05", type: "vacation", userId: 2796 }]
    }));
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.susbcribeMembersAbsences();
    expect(navigateSpy).toHaveBeenCalledWith('/pagenotfound');
  });
});
