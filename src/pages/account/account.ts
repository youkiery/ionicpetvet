import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';

import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  name: string = ""
  phone: string = ""
  address: string = ""
  listpet: {
    name: string,
    price: number,
    age: string,
    type: string
  }[]
  constructor(public navCtrl: NavController, public navParams: NavParams, public lang: LangProvider,
    public service: ServiceProvider, public http: HttpClient) {

  }

}

@Component({
  template: `
    <form (ngSubmit)="edit()">
      <ion-item>
        <ion-label> {{lang.name}} </ion-label>
        <ion-input type="text" [(ngModel)]="user.name" name="name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.phone}} </ion-label>
        <ion-input type="text" [(ngModel)]="user.phone" name="phone"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.address}} </ion-label>
        <ion-input type="text" [(ngModel)]="user.address" name="address"></ion-input>
      </ion-item>
      <button ion-button color="secondary" type="submit" class="button-half"> {{lang.save}} </button>
    </form>
  `
})
export class EditAccount {
  user: {
    name: string,
    phone: string,
    address: string
  } = {
    name: "",
    phone: "",
    address: ""
  }
  constructor(public lang: LangProvider, public navParm: NavParams) {
    var gottendata = this.navParm.get("data");
    if (gottendata) {
      this.user.name = gottendata["name"]
      this.user.phone = gottendata["phone"]
      this.user.address = gottendata["address"]
    }
  }
  edit() {

  }
}