import { Component, Input, OnInit } from '@angular/core';
import {FavoriteService} from '../favorite.service'
import {SharedDataService} from '../shared-data.service'
import {Router} from '@angular/router'

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  Object = Object;
  favoriteServ:any
  sharedDataService:any
  myRouter:any

  eventHeadings:any = {Artist:'Artist/Team(s)',BTA:'Buy Ticket At',Category:'Category', PriceRange: "Price Range", SeatMap: "Seat Map", Status: "Ticket Status", Date: "Time", Venue: "Venue"};

  artistHeadings:any = {Name:'Name',Followers:'Followers',Popularity:'Popularity',Check:'Check At'};

  venueHeadings:any = {Address:'Address',City:'City',Phone:'Phone Number',OpenHours:'Open Hours',GeneralRule:'General Rule',ChildRule:'Child Rule'};
  
  date = new Date();

  isEmpty(){
    var empty = true;
    for(let key in this.sharedDataService.eventDetails.Event){
      if (this.sharedDataService.eventDetails.Event[key] !== ""){
        return !empty;
      }
    }
    return empty;
  }

  

  numberWithCommas(x:number|string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getDate(date:string){
    return new Date(date)
  }
  constructor(private favoriteService: FavoriteService,private shareddata: SharedDataService, private router: Router) { 
    this.favoriteServ = favoriteService
    this.sharedDataService = shareddata
    this.myRouter = router
  }

  ngOnInit(): void {
  }

}
