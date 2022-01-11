import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  
  eventArray:any = []
  showNoResults = false
  showError = false  
  selectedEvent = true;
  eventDetails:any = {Event:{},Artist:{},Venue:{}}
  disableDetailsButton = true
  disableStarButton = true

  reset(){
    this.eventArray = []
    this.showNoResults = false
    this.showError = false  
    this.selectedEvent = true;
    this.eventDetails = {Event:{},Artist:{},Venue:{}}
    this.disableDetailsButton = true
    this.disableStarButton = true
  }
  constructor() { 
  }
}
