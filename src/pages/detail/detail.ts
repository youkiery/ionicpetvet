import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Events } from 'ionic-angular';

import { HttpClient } from '@angular/common/http'
import { ServiceProvider } from '../../providers/service/service';
import { LangProvider } from '../../providers/lang/lang';

import { InboxPage } from '../inbox/inbox';
import { ProviderPage } from '../provider/provider';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  data: object
  comment: object = []
  rate: number = 0
  ratedisabled: boolean = false
  owner: object = {
    name: "",
    address: "",
    phone: ""
  }
  disabled: string = ""
  public: string
  name: string = ""
  chattext: string = ""
  classhover: string[] = ["nhover", "shover"]
  shover: number[] = [0, 0, 0, 0, 0]
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
    public service: ServiceProvider, public lang: LangProvider, public modalCtrl: ModalController,
    public event: Events) {
    var type = this.navParams.get("type");
    this.service.loadstart()
    if (type) {
      this.http.get(this.service.url + "&action=getdatainfo&pid=" + type.pid).subscribe(response => {
        this.data = response
        this.service.loadend()
      })
    }
    else {
      this.data = this.navParams.get("data");
    }
    this.service.getData("public").then(data => {
      console.log(1);
      this.public = String(data)
    }, () => {
      this.public = "false"
    })
    console.log(this.data);
    
    this.service.loadstart()
    var uid = "0"
    if (this.service.uid) {
      uid = this.service.uid
    }
    this.http.get(this.service.url + "&action=getinfo&pid=" + this.data["id"] + "&uid=" + uid + "&puid=" + this.data["user"]).subscribe(data => {
      console.log(data);
      
      this.owner = data["data"]["owner"]
      this.comment = data["data"]["comment"]
      this.rate = data["data"]["rate"]
      if (!this.service.uid) {
        this.ratedisabled = true
      } else if (this.rate) {
        this.onhover(this.rate)
        this.ratedisabled = true
      }
      if (data["data"]["order"]) {
        document.getElementById("buy").setAttribute("disabled", "true")
      }
      this.service.loadend()
    })
    this.event.subscribe("ordered", () => {
      document.getElementById("buy").setAttribute("disabled", "true")
    })

  }

  onhover(index) {
    if (!this.ratedisabled) {
      this.shover.fill(0)
      for (let i = 0; i < index; i++) {
        this.shover[i] = 1;
      }
      console.log(index);
    }
  }

  onuhover() {
    if (!this.ratedisabled) {
      this.shover.fill(0)
    }
  }

  crate(index) {
    if (!this.ratedisabled) {
      this.http.get(this.service.url + "&action=rate&value=" + index +"&uid=" + this.service.uid + "&pid=" + this.data["id"]).subscribe(response => {
        console.log(response);
        switch (response["status"]) {
          case 1:
          // success
          this.service.showMsg(this.lang["thank"])
          this.onhover(index)
          this.ratedisabled = true
          break;
          default:
          // undefined error
        }
      })
    }
  }

  provider() {
    this.navCtrl.push(ProviderPage, {provider: this.owner})
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
    this.service.setData("public", this.public)
    // var cid = 0;
    if (!this.service.uid && !this.name.length) {
      this.service.showMsg(this.lang["nonameallow"]);
    } 
    else {
      // this.http.get(this.service.url + "&action=postchat&id=" + this.data["id"] + "&uid=" + this.service["uid"] + "&puid=" + this.data["user"] + "&name=" + this.name + "&public=" + this.public + "&chattext=" + this.chattext).subscribe(response => {
      this.http.get(this.service.url + "&action=postchat&id=" + this.data["id"] + "&uid=" + this.service["uid"] + "&puid=" + this.data["user"] + "&name=" + this.name + "&chattext=" + this.chattext).subscribe(response => {
        console.log(response);
        if (response["status"]) {
          this.comment = response["data"]
          this.chattext = ""
        }
        this.service.loadend()
      })
    }
    
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
    this.http.get(this.service.url + "&action=order&" + this.service.toparam(this.order)).subscribe(response => {
      switch (response["status"]) {
        case 1:
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
