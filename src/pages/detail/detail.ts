import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Events } from 'ionic-angular';

import { HttpClient } from '@angular/common/http'
import { ServiceProvider } from '../../providers/service/service';
import { LangProvider } from '../../providers/lang/lang';

import { InboxPage } from '../inbox/inbox';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  data: object
  comment: object = []
  owner: object = {
    name: "",
    address: "",
    phone: ""
  }
  disabled: string = ""
  chattext: string = ""
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
    public service: ServiceProvider, public lang: LangProvider, public modalCtrl: ModalController,
    public event: Events) {
    this.data = this.navParams.get("data");
    this.service.loadstart()
    console.log(this.data);
    this.http.get(this.service.url + "?action=getinfo&id=" + this.data["id"] + "&uid=" + this.data["user"] + "&puid=" + this.data["user"]).subscribe(data => {
      this.owner = data["data"]["owner"]
      this.comment = data["data"]["comment"]
      if (data["data"]["order"]) {
        document.getElementById("buy").setAttribute("disabled", "true")
      }
      this.service.loadend()
    })
    this.event.subscribe("ordered", () => {
      document.getElementById("buy").setAttribute("disabled", "true")
    })

  }

  order() {
    let modal = this.modalCtrl.create(Order, {pid: this.data["id"]})
    modal.present()
  }
  chat() {
    this.navCtrl.push(InboxPage, {id: this.data["id"]})
  }
  postchat() {
    this.service.loadstart()
    console.log(this.chattext);
    
    this.http.get(this.service.url + "?action=postchat&id=" + this.data["id"] + "&uid=" + this.service["uid"] + "&puid=" + this.data["user"] + "&chattext=" + this.chattext).subscribe(response => {
      console.log(response);
      if (response["status"]) {
        this.comment = response["data"]
      }
      this.service.loadend()
    })
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
    public lang: LangProvider, public viewCtrl: ViewController, public event: Events) {
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
          this.event.publish("ordered");
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
