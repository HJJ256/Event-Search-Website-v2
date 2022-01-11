import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private http: HttpClient) { }
  
  eventSearch(keyword:string, latlong:string, location:string, radius:string, unit:string, segmentId:string){
    let url = "/api/search?keyword="+keyword+"&latlong="+latlong+"&location="+location+"&radius="+radius+"&unit="+unit+"&segmentId="+segmentId;
    return this.http.get(url);
  }

  eventDetails(eventId:string){
    let url = "/api/details?eventId="+eventId;
    return this.http.get(url);
  }

  autocompleteApi(keyword:string){
    let url = "/api/auto?keyword="+keyword;
    return this.http.get(url);
  }

  geosearch(){
    let url = "https://ipinfo.io?token=333e0cd1d96882";
    return this.http.get(url);
  }
}
