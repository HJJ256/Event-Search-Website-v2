import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Input } from '@angular/core';
import {EventsService} from '../events.service'
import {FavoriteService} from '../favorite.service'
import {SharedDataService} from '../shared-data.service'
import {Router} from '@angular/router'

@Component({
  selector: 'result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit{
  
  eventAPI : any;
  favoriteServ: any
  sharedDataService:any;
  myRouter:any;

  JSON = JSON;
  myStorage = window.localStorage;

  constructor(private eventApi: EventsService, private favoriteService: FavoriteService,private shareddata: SharedDataService, private router: Router) {
    this.eventAPI = eventApi;    
    this.favoriteServ = favoriteService;
    this.sharedDataService = shareddata
    this.myRouter = router
  }

  ngOnInit(){
  }

  doEventDetailsFetch(eventId:string){
    this.eventAPI.eventDetails(eventId)
    .subscribe((data:any) => {
      if (data === {}){
        this.sharedDataService.eventDetails = {};
      }
      else{
        this.sharedDataService.eventDetails = data;
        //console.log(this.sharedDataService.eventDetails);
      }
      this.sharedDataService.disableStarButton = false;
      this.myRouter.navigate(['/details'])
    },
    (err:any) => {
      this.sharedDataService.eventDetails = {};
      this.myRouter.navigate(['/details'])
    })
    
    this.sharedDataService.disableDetailsButton=false;
  }
}
