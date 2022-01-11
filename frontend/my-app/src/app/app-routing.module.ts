import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailsComponent } from './event-details/event-details.component';
import { ResultTableComponent } from './result-table/result-table.component';

const routes: Routes = [
  {path: 'results', component: ResultTableComponent, data: {animation: 'isRight'}},
  {path: 'details', component: EventDetailsComponent , data: {animation: 'isLeft'}}
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
