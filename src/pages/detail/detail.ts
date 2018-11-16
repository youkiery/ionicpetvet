import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http'
import { ServiceProvider } from '../../providers/service/service';
import { LangProvider } from '../../providers/lang/lang';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  data: object
  owner: object = {
    name: "",
    address: "",
    phone: ""
  }
  disabled: string = "false"
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
    public service: ServiceProvider, public lang: LangProvider, public modalCtrl: ModalController) {
    this.data = this.navParams.get("data");
    this.service.loadstart()
    console.log(this.data);
    this.http.get(this.service.url + "?action=getinfo&id=" + this.data["id"] + "&uid=" + this.data["user"]).subscribe(data => {
      console.log(data);
      
      this.owner = data["data"]["owner"]
      if (data["data"]["order"]) {
        this.disabled = "x"
      }
      this.owner = data["data"]["owner"]
      this.service.loadend()
    })
  }

  order() {
    let modal = this.modalCtrl.create(Order, {pid: this.data["id"]})
    modal.present()
  }
}
@Component({
  template:
  `
    <form (ngSubmit)="buy()">
      <p class="note">
        {{lang.ordernote}}
      </p>
      <ion-item>
        <ion-label>
          {{lang.name}}
        </ion-label>
        <ion-input type="text" [(ngModel)]="order.name" name="name" disabled="{{disabled}}"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>
          {{lang.address}}
        </ion-label>
        <ion-input type="text" [(ngModel)]="order.address" name="address" disabled="{{disabled}}"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>
          {{lang.phone}}
        </ion-label>
        <ion-input type="text" [(ngModel)]="order.phone" name="phone" disabled="{{disabled}}"></ion-input>
      </ion-item>
      <button ion-button block>
        {{lang.buy}}
      </button>
    </form>
  `
})
export class Order {
  disabled: string = "false"
  order: object = {}
  constructor(public navParam: NavParams, public service: ServiceProvider, public http: HttpClient,
    public lang: LangProvider, public viewCtrl: ViewController) {
    var data = this.navParam.get("pid")
    
    this.order["pid"] = data
    this.order["id"] = this.service.uid
    this.order["name"] = this.service.name
    this.order["address"] = this.service.address
    this.order["phone"] = this.service.phone
    if (this.service.uid) {
      this.disabled = "true"
    }
  }
  buy() {
    this.service.loadstart()
    this.http.get(this.service.url + "?action=order&" + this.service.toparam(this.order)).subscribe(response => {
      switch (response["status"]) {
        case 1:
          // cannot insert
          this.service.showMsg(this.lang["orderfail"])
          break;
        case 2:
          // insert success
          this.service.showMsg(this.lang["ordersuccess"])
          this.viewCtrl.dismiss()
          break;
        default:
          // undefined error
          this.service.showMsg(this.lang["undefined"])
      }
      this.service.loadend()
    })
  }
}
