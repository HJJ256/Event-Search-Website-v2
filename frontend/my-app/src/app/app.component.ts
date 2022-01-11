import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import {EventsService} from './events.service'
import {SharedDataService} from './shared-data.service'
import {slider} from './route-animations'

declare const geoSearch: any;
declare const validateRequiredField: any;
declare const enableDisableTextBox: any;

export class Details{
  public Keyword: string = '';
  public Distance: string = '';
  public Location: string = '';
  public LatLong: string = '';
  public Unit: string = 'miles';
  public segmentId: string = '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slider]
})
export class AppComponent implements OnInit {
  eventAPI : any;
  sharedDataService:any
  myRouter: any
  model = new Details();
  locationDisabled = true;
  focusLocation = true;
  focusKeyword= true;
  title = 'my-app';

  myStorage = window.localStorage;
  empty_array:any = [];

  autocompleteOpts:any = [];
  showProgressBar = false


  prepareRoute(outlet:RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
  }
  
  constructor(private eventApi: EventsService, private shareddata: SharedDataService, private router: Router) {
    this.eventAPI = eventApi;    
    this.sharedDataService = shareddata
    this.myRouter = router
  }

  ngOnInit(){
    if(this.myStorage.getItem('favorites') == null){
      this.myStorage.setItem('favorites',JSON.stringify(this.empty_array))
    }
    this.eventAPI.geosearch().subscribe((data:any)=>{
      this.model.LatLong = data.loc;
      //console.log("latlong: "+this.latlong)
    })
    this.router.navigate(['/results'])
  }

  resetPage(form:any){
    form.resetForm({Keyword: "", Category: "", Distance: "", Unit: "miles", Location: ""});
    this.eventAPI.geosearch().subscribe((data:any)=>{
      this.model.LatLong = data.loc;
    })
    this.locationDisabled = true;
    this.focusLocation = true;
    this.focusKeyword= true;
    this.autocompleteOpts = [];
    this.showProgressBar = false;
    this.sharedDataService.reset();
    this.router.navigate(['/results'])
  }

  doAutocomplete(){
    if (this.model.Keyword.trim()!==''){
      this.eventAPI.autocompleteApi(this.model.Keyword.trim()).subscribe((data:any) => {
        this.autocompleteOpts = data;
      },
      (err:any)=>{
        this.autocompleteOpts = [];  
      })
    }
    else{
      this.autocompleteOpts = [];
    }
  }

  doEventSearch(){
    var distance = this.model.Distance !== '' ? this.model.Distance : '10';
    //console.log(this.model.Distance)
    this.eventAPI.eventSearch(this.model.Keyword,this.model.LatLong,this.model.Location,distance,this.model.Unit,this.model.segmentId)
    .subscribe((data:any) => {
      //console.log(data)
      if (data.length === 0){
        this.sharedDataService.showNoResults = true;
        this.sharedDataService.showError = false;
        this.sharedDataService.eventArray = [];
        this.showProgressBar = false;
        this.sharedDataService.selectedEvent = true;
      }
      else{
        this.sharedDataService.showNoResults = false;
        this.sharedDataService.showError = false;
        this.sharedDataService.eventArray = data;
        this.showProgressBar = false;
        this.sharedDataService.selectedEvent = true;
      }
    },
    (err:any) => {
      this.sharedDataService.showError = true;
      this.sharedDataService.showNoResults = false;
      this.sharedDataService.eventArray = [];
      this.showProgressBar = false;
      this.sharedDataService.selectedEvent = true;
    })
  }

  removeSpaces(str : string){
    return str.trim()
  }

  emptyKeywordField(){
    if(this.model.Keyword){
      if (this.model.Keyword.trim()){
        this.focusKeyword = true;
        return false;
      }
      else{
        return true;
      }
      
    }
    else{
      return true
    }
  }

  emptyLocationField(){
    if(this.model.Location){
      if (this.model.Location.trim()){
        this.focusLocation = true;
        return false;
      }
      else{
        return true;
      }
      
    }
    else{
      return true
    }
  }

  onSubmit(form:any){
    this.showProgressBar = true;
    //console.log(form.value)
    this.doEventSearch()
    this.router.navigate(['/results'])
  }

  toggleLocation(tf: boolean){
    this.locationDisabled = tf;
    this.model.Location = "";
  }

  //native js
  ngGeoSearch(){
    geoSearch();
  }

  ngValidateRequiredField(fieldID: string,origLength: number){
    validateRequiredField(fieldID,origLength);
  }

  ngEnableDisableTextBox(){
    enableDisableTextBox();
  }
}
