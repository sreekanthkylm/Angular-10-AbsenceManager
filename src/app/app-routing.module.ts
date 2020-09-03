import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbsenceManagerComponent } from './components/absence-manager/absence-manager.component';
import { AbsencesComponent } from './components/absences/absences.component';
import { MembersComponent } from './components/members/members.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: AbsenceManagerComponent, pathMatch: 'full' }, 
  { path: 'absences', component: AbsencesComponent },
  { path: 'members', component: MembersComponent },
  { path: 'pagenotfound', component: NotFoundComponent },
  { path: '**', redirectTo: 'pagenotfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
