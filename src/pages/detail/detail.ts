import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, AlertController } from 'ionic-angular';

import { ServiceProvider } from '../../providers/service/service';
import { LangProvider } from '../../providers/lang/lang';

import { ProviderPage } from '../provider/provider';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  data: object = {
    ageid: "0",	
    description: "",	
    id: "0",	
    image: "",	
    kind: "",	
    name: "",	
    owner: "",	
    price: "0",	
    province: 0,	
    species: "",	
    time: 0,	
    typeid: 0,	
    user: 0,	
    vaccine: 0
  }
  comment: object = []
  rate: number = 0
  ratedisabled: boolean = false
  owner: object = {
    name: "",
    address: "",
    phone: ""
  }
  anyone: object = {
    name: "",
    address: "",
    phone: ""
  } 
  disabled: boolean = false
  public: string
  chattext: string = ""
  classhover: string[] = ["nhover", "shover"]
  shover: number[] = [0, 0, 0, 0, 0]
  page: number = 1;
  isnext: boolean = false
  true: boolean = true
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public service: ServiceProvider, public lang: LangProvider, public modalCtrl: ModalController,
    public event: Events, public alert: AlertController) {
    var type = this.navParams.get("type");
    // console.log(type);
    
    if (type) {
      this.service.fetch(this.service.url + "&action=getdatainfo&pid=" + type.pid).then(response => {
        // console.log(response);
          this.data = response["owner"]
          this.init()
      }, (e) => {})
    }
    else {
      this.data = this.navParams.get("data");
      this.init()
    }
    // console.log(this.data);
    this.service.getData("public").then(data => {
      // console.log(1);
      this.public = String(data)
    }, () => {
      this.public = "false"
    })
    // console.log(this.data);
  }

  init() {
    var uid = "0"
    if (this.service.uid) {
      uid = this.service.uid
    }
    this.service.fetch(this.service.url + "&action=getinfo&pid=" + this.data["id"] + "&uid=" + uid + "&puid=" + this.data["user"] + "&page=" + this.page).then(response => {
      // console.log(data);
      
      this.owner = response["owner"]
      this.comment = response["comment"]
      this.isnext = response["next"]
      this.rate = response["rate"]
      if (!this.service.uid) {
        // console.log(1);
        
        this.ratedisabled = true
      } else if (this.rate) {
        // console.log(2);
        this.onhover(this.rate)
        this.ratedisabled = true
      }
      if (response["order"]) {
        document.getElementById("buy").setAttribute("disabled", "true")
      }
    }, (e) => {})
  }

  onhover(index) {
    if (!this.ratedisabled) {
      this.shover.fill(0)
      for (let i = 0; i < index; i++) {
        this.shover[i] = 1;
      }
      // console.log(index);
    }
  }

  onuhover() {
    if (!this.ratedisabled) {
      this.shover.fill(0)
    }
  }

  crate(index) {
    if (!this.ratedisabled) {
      this.service.fetch(this.service.url + "&action=rate&value=" + index +"&uid=" + this.service.uid + "&pid=" + this.data["id"]).then(response => {
        // console.log(response);
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
      }, (e) => {})
    }
  }

  viewdetail(data) {
    // console.log(data);
    this.alert.create({
      title: this.lang.userinfo,
      message: this.lang.name + ": " + data["name"] + "<br>" + this.lang.phone + ": " + data["phone"] + "<br>" + this.lang.address + ": " + data["address"] + "<br>"
    }).present()
  }

  provider() {
    this.navCtrl.push(ProviderPage, {provider: this.owner})
  }

  order() {
    if (this.service.uid) {
      this.disabled = true;
    }
      this.alert.create({
        title: this.lang["order"],
        inputs: [
          {
            name: "name",
            type: "text",
            value: this.service.name,
            placeholder: this.lang["name"],
            disabled: this.disabled
          },
          {
            name: "phone",
            type: "text",
            value: this.service.phone,
            placeholder: this.lang["phone"],
            disabled: this.disabled
          },
          {
            name: "address",
            type: "text",
            value: this.service.address,
            placeholder: this.lang["address"],
            disabled: this.disabled
          }
        ],
        buttons: [
          {
            text: this.lang["order"],
            handler: (data) => {
              this.service.fetch(this.service.url + "&action=order&" + this.service.toparam(data)).then(response => {
                // insert success
                this.service.showMsg(this.lang["ordersuccess"])
                document.getElementById("buy").setAttribute("disabled", "true")
              }, (e) => {})
            }
          },
          {
            text: this.lang["cancel"]
          }
        ]
      }).present()
  }
  back() {
    this.navCtrl.pop()
  }
  postchat() {
    // console.log(this.chattext);
    this.service.setData("public", this.public)
    // var cid = 0;
    if (!this.service.uid) {
      var msg = ""
      if (!this.anyone["name"]) {
        msg = this.lang["nonameallow"]
      } else if (!this.anyone["address"]) {
        msg = "Chưa nhập địa chỉ";
      } else if (!this.anyone["phone"]) {
        msg = "Chưa nhập số điện thoại";
      } else {
        this.service.fetch(this.service.url + "&action=postchat&id=" + this.data["id"] + "&" + this.service.toparam(this.anyone) + "&puid=" + this.data["user"] + "&chattext=" + this.chattext + "&page=" + this.page).then(response => {
          // console.log(response);
          if (response["status"]) {
            this.comment = response["comment"]
            this.chattext = ""
          }
        }, (e) => {})
      }
      this.service.showMsg(msg);
    } 
    else {
      // this.service.fetch(this.service.url + "&action=postchat&id=" + this.data["id"] + "&uid=" + this.service["uid"] + "&puid=" + this.data["user"] + "&name=" + this.name + "&public=" + this.public + "&chattext=" + this.chattext).subscribe(response => {
      this.service.fetch(this.service.url + "&action=postchat&id=" + this.data["id"] + "&uid=" + this.service["uid"] + "&puid=" + this.data["user"] + "&chattext=" + this.chattext + "&page=" + this.page).then(response => {
        // console.log(response);
        if (response["status"]) {
          this.comment = response["comment"]          
          this.chattext = ""
        }
      }, (e) => {})
    }
    
  }
  next() {
    this.service.fetch(this.service.url + "&action=nextcomment&page=" + this.page + "&pid=" + this.data["id"]).then(response => {
      if (response["status"]) {
        this.comment = response["comment"]
        this.isnext = response["next"]
        this.page ++
      }
    }, (e) => {})
  }
}
