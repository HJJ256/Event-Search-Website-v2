import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { BrowserModule } from '@angular/platform-browser';

import {RoundProgressModule} from 'angular-svg-round-progressbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';

import { FormsModule } from '@angular/forms';
import { ResultTableComponent } from './result-table/result-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventDetailsComponent } from './event-details/event-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ResultTableComponent,
    EventDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    RoundProgressModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQuwS1FuP95xMXOtDLW841gsw6f_7DAr8'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
