import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedModule } from '../../../shared/shared.module';
import { ReminderItemModalComponent } from './components/reminder-item-modal/reminder-item-modal.component';
import { NewLocation } from '../../../_interfaces/Location.modal';
import { ToastService } from '../../../_services/toast.service';

export enum SelectedUnit{
  km = "km",
  m = "m",
  mil = "mil"
}
@Component({
  selector: 'app-add-location-modal',
  templateUrl: './add-location-modal.component.html',
  styleUrls: ['./add-location-modal.component.scss'],
  standalone: true,
  imports: [SharedModule, ReminderItemModalComponent],
})
export class AddLocationModalComponent implements OnInit {
  isAddRemInputOpen: boolean = false;
  isInEditState: boolean = false;
  newLocation: NewLocation;
  newReminderTitle: string = "";


  constructor(
    private modalController: ModalController,
    private toastService: ToastService
  ) {
    this.newLocation = {
      title: "",
      streetAddress: "",
      radius: null,
      radiusUnit: "m",
      reminders: []
    }
   }

  ngOnInit() {
    this.newLocation.radius = this.getDefaultValue();
  }

  returnUnit = (value: number) => {
    this.newLocation.radius = parseFloat(value.toFixed(1));
    return `${this.newLocation.radius}${this.newLocation.radiusUnit}`
  }

  getMax(){
    let retVal;
    switch(this.newLocation.radiusUnit){
      case SelectedUnit.km:
        retVal = 3;
        break;
      case SelectedUnit.m:
        retVal = 1000;
        break;
      case SelectedUnit.mil:
        retVal = 3;
        break;
      default:
        retVal = 0;
        break;
    }
    return retVal;
  }

  getMin(){
    let retVal;
    switch(this.newLocation.radiusUnit){
      case SelectedUnit.km:
        retVal = 0.5;
        break;
      case SelectedUnit.m:
        retVal = 10;
        break;
      case SelectedUnit.mil:
        retVal = 0.5;
        break;
      default:
        retVal = 0;
        break;
    }
    return retVal;
  }

  getDefaultValue(){
    return parseFloat(((this.getMax() + this.getMin()) / 2).toFixed(1));
  }

  getColor(value: string): boolean{
    if(value === this.newLocation.radiusUnit){
      return true;
    }
    return false;
  }

  changeUnit(unit: string){
    switch(unit){
      case "km":
        this.newLocation.radiusUnit = "km";
        break;
      case "m":
        this.newLocation.radiusUnit = "m";
        break;
      case "mil":
        this.newLocation.radiusUnit = "mil";
        break;
      default:
        this.newLocation.radiusUnit = "m";
        break;
    }
    this.newLocation.radius = this.getDefaultValue();
  }

  handleToggleInputs(){
    this.isAddRemInputOpen = !this.isAddRemInputOpen;
  }

  addNewReminder(){
    if(this.newReminderTitle){
      this.newLocation.reminders.push({title: this.newReminderTitle});
      this.isAddRemInputOpen = false;
    }
    this.newReminderTitle = "";
  }

  handleEdit(){
    this.isInEditState = true;
  }

  getStep(){
    let retVal;
    switch(this.newLocation.radiusUnit){
      case SelectedUnit.km:
        retVal = 0.1;
        break;
      case SelectedUnit.m:
        retVal = 10;
        break;
      case SelectedUnit.mil:
        retVal = 0.1;
        break;
      default:
        retVal = 1;
        break;
    }
    return retVal;
  }

  /**
   * THIS METHOD UPDATES currentRadiusValue WHEN DRAGGING THE RANGE. I DON'T KNOW WHY.
   * WELL, IT WORKS SO...
   *  */ 
  updateRadius(e: any){
  
  }

  areFieldsValid(): boolean{
    const {title, streetAddress, radius, radiusUnit, reminders} = this.newLocation;
    if(!title || !streetAddress || !radius || !radiusUnit || reminders.length <= 0){
      return false;
    }
    return true;
  }

  async saveAndCloseModal(){
    if(!this.areFieldsValid()){
      await this.toastService.createErrorToast("You are missing some fields!");
      return;
    }


    // await this.modalController.dismiss();
  }
}
