import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Coords } from '../_interfaces/Location.modal';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from './location.service';
import { UserConfigService } from './user-config.service';

@Injectable({
  providedIn: 'root'
})
export class LocationPermService {
  locationPermState: string;
  userCoords: Coords;
  watchID: string;
  private locationPermStateUpdated: BehaviorSubject<string> = new BehaviorSubject<string>(null); // this will be used in the settings page to toggle/un-toggle the location
  locationPermStateUpdated$ = this.locationPermStateUpdated.asObservable();

  constructor(
    private locationService: LocationService,
    private userConfigService: UserConfigService
  ) { }

  async checkPermission(): Promise<string>{
    const permStatus = await Geolocation.checkPermissions();
    return permStatus.location;
  }

  async requestLocationPermission(){
    const requestPerm = await Geolocation.requestPermissions();
    if(requestPerm){
      this.locationPermState = requestPerm.location;
      let userPrefLocationStatus = await this.userConfigService.getLocationStatus();
      // if granted, watch users location
      if(this.locationPermState === "granted" && (!userPrefLocationStatus || userPrefLocationStatus === "granted")){
        await this.watchUsersLocation();
        await this.userConfigService.setLocationStatus("granted");
      }
      this.locationPermStateUpdated.next(this.locationPermState);
    }
  }

  async watchUsersLocation(){
    this.watchID = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }, (position) => {
      this.userCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      this.locationService.checkUserAndLocationsCoords(this.userCoords);
    })
  }

  async clearWatchUserLocation(){
    if(this.watchID){
      await Geolocation.clearWatch({id: this.watchID});
      this.userCoords = null;
    }
  }
}
