import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  favoritesArray:any = []
  myStorage = window.localStorage
  constructor() { 
    if(this.myStorage.getItem('favorite') == null){
      this.updateLocalStorage()
    }
    else{
      this.updateFavoritesArray()
    }
  }

  updateFavoritesArray(){
    var favorites:any = this.myStorage.getItem('favorite')
    this.favoritesArray = JSON.parse(favorites)
  }

  updateLocalStorage(){
    this.myStorage.setItem('favorite',JSON.stringify(this.favoritesArray))
  }
  
  insertFavorite(e:any){
    this.updateFavoritesArray()
    if(!this.existFavoriteElement(e)){
      this.favoritesArray.push(e)
      this.updateLocalStorage()
    }
  }

  deleteFavorite(e:any){
    this.updateFavoritesArray()
    if(this.existFavoriteElement(e)){
      this.favoritesArray.splice(this.getFavoriteIndex(e),1)
      this.updateLocalStorage()
    }
  }

  existFavoriteElement(e:any){
    for(let elem of this.favoritesArray){
      if(elem.id === e.id){
        return true
      }
    }
    return false
  }

  getFavoriteIndex(e:any){
    for(let elem in this.favoritesArray){
      if(this.favoritesArray[elem].id === e.id){
        return elem
      }
    }
    return -1
  }
  getFavorites(){
    return this.favoritesArray;
  }
}
