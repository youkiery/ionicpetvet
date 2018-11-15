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
  owner: object
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
    public service: ServiceProvider, public lang: LangProvider, public modalCtrl: ModalController) {
    this.data = this.navParams.get("data");
    this.http.get(this.service.url + "&action=getinfo&id=" + this.data["id"]).subscribe(data => {
      this.owner = data
    })
  }

  order() {
    let modal = this.modalCtrl.create(Order, {id: this.service.uid, name: this.service.name, address: this.service.address, phone: this.service.phone})
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
        <ion-input type="text" [(ngModel)]="order.name" name="name" {{disabled}}></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>
          {{lang.address}}
        </ion-label>
        <ion-input type="text" [(ngModel)]="order.address" name="address" {{disabled}}></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>
          {{lang.phone}}
        </ion-label>
        <ion-input type="text" [(ngModel)]="order.phone" name="phone" {{disabled}}></ion-input>
      </ion-item>
      <button ion-button block>
        {{lang.buy}}
      </button>
    </form>
  `
})
export class Order {
  disabled: string = ""
  order: object
  constructor(public navParam: NavParams, public service: ServiceProvider, public http: HttpClient,
    public lang: LangProvider, public viewCtrl: ViewController) {
    var data = this.navParam.get("data")
    if (data) {
      this.order["id"] = data["id"]
      this.order["name"] = data["name"]
      this.order["address"] = data["address"]
      this.order["phone"] = data["phone"]
      this.disabled = "disabled"
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
        case 1:
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