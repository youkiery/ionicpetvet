import { Component, ViewChild } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import {DetailPage} from '../detail/detail'
import { SalePage } from '../sale/sale';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('input') myInput;

  // main
  filter: object = {
    keyword: "",
    sort: 0,
    type: 0,
    price: {
      lower: 0,
      upper: 73
    },
    kind: 0,
    species: 0
  }
  rangeSettings: number = 20;
  setdage: any;
  banner: string = ""
  active: string[] = ["", "active"]
  activebar: number[] = [1, 0, 0, 0, 0]
  actindex = 0
  prvindex = 0
  issearch: boolean = false
  // user
  submitButton: string[]
  submitType: number = 0 // 0: login, 1: signup
  user: {
    username: string,
    password: string,
    vpassword: string,
    name: string,
    phone: string,
    address: string,
    province: number,
  } = {
    username: "",
    password: "",
    vpassword: "",
    name: "",
    phone: "",
    address: "",
    province: 0
  }
  menu: boolean = false
  notifice: object[] = []
  constructor(public navCtrl: NavController, public lang: LangProvider, public storage: Storage,
    public http: HttpClient, public service: ServiceProvider, public event: Events) {
      this.submitButton = [lang.login, lang.signup];

      this.service.loadstart()
      this.getlogin().then(logindata => {
        this.checklogin(logindata)
      })
  }

  getlogin() {
    return new Promise((resolve) => {
      this.storage.get("login").then(logindata => {
        resolve(logindata)
      })
    })
  }

  checklogin(logindata) {
    return new Promise((resolve) => {
      this.http.get(this.service.url + "&action=getlogin&id=" + logindata).subscribe(data => {
        if (data["status"]) {
          // login
          console.log(data);
          
          this.service.logged(data["data"], this.navCtrl, false);
        }
        this.refresh().then(() => {
          resolve()
        })
      }, (e) => {
        // network error
        this.service.showMsg(this.lang["undefined"])
        this.refresh().then(() => {
          resolve()
        })
      })
    })
  }

  refresh() {
    return new Promise((resolve) => {
      this.service.loadstart()
      this.http.get(this.service.url + "&action=getinit&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]]).subscribe(data => {
        console.log(data);
        this.service.kind = data["data"]["kind"]
        this.service.species = data["data"]["species"]
        this.service.config = data["data"]["config"]
        this.service.type = data["data"]["type"]
        this.service.newpet = data["data"]["newpet"]
        this.banner = this.service.baseurl + this.service.config["banner"]
        this.service.loadend
        resolve()
      })
    })
  }

  search() {
    console.log(1);
    this.issearch = true
    this.setActive(4)
    setTimeout(() => {
      this.myInput.setFocus()
    }, 500)
  }
  bsearch() {
    console.log(2);
    this.issearch = false
    this.setActive(this.prvindex)
  }

  setActive(index) {
    console.log(index);
    
    this.activebar[this.actindex] = 0
    this.prvindex = this.actindex
    this.actindex = index
    this.activebar[this.actindex] = 1
  } 

  home() {
    // remove all pushed page, set root to home
  }

  login() {
    this.setActive(1)
  }

  detail(index) {
    this.navCtrl.push(DetailPage, {data: this.service.newpet[index]});
  }

  open() {
    this.menu = !this.menu
  }
  close() {
    this.menu = false
  }

  sale() {
    this.navCtrl.push(SalePage);
  }

  unit(price) {
    var formatter = new Intl.NumberFormat('vi-VI', {
      style: 'currency',
      currency: 'VND',
   });
   return formatter.format(price)
  }

  inbox() {
    this.setActive(2);
    this.service.loadstart()
    this.http.get(this.service.url + "&action=getnotify&uid=" + this.service.uid).subscribe((response) => {
      console.log(response);
      if (response["status"]) {
        this.notifice = response["data"]
      }
      this.service.loadend()
    })
  }

  tonotify(type, pid) {
    
    type = parseInt(type)
    switch (type) {
      case 1:
        // to order
      case 2:
        // to order
      case 5:
        // to order
        this.navCtrl.push(SalePage, {type: {
          value: 2,
          pid: pid
        }})
        break;
      case 3:
        // to detail
      case 4:
        // to detail
        this.navCtrl.push(DetailPage, {type: {
          value: 1,
          pid: pid
        }})
        break;
      case 6:
        // to bought
        this.navCtrl.push(SalePage, {type: {
          value: 4,
          pid: pid
        }})
        break;
      case 7:
        // to sold
        this.navCtrl.push(SalePage, {type: {
          value: 3,
          pid: pid
        }})
        break;
    }
  }

  filtersuball() {
    this.bsearch()
    this.filterall()
  }

  filterall() {
    this.service.loadstart()
    return new Promise((resolve) => {
      this.http.get(this.service.url + "&action=filter&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]]).subscribe(data => {
        console.log(data);
        if (data["status"]) {
          this.service.newpet = data["data"]
          // this.service.newpet = data["data"]
          // this.service.newpet = data["data"]
          resolve()
        }
        this.setActive(0)
        this.service.loadend()
      })
    })
  }

  submit() {
    // check username and password
    if (this.submitType) {
      this.service.loadstart()
      // signup
      this.http.get(this.service.url + "&action=signup&" + this.service.toparam(this.user)).subscribe(data => {
        switch (data["status"]) {
          case 1: // username existed
            this.service.showMsg(this.lang["existedusername"]);            
          break;
          case 2: // success
            this.service.logged(data["data"])
          break;
          default:
            // undefined error
            this.service.showMsg(this.lang["undefined"]);            
          }
          this.service.loadend()
      }, (e) => {
        // undefined error
        this.service.loadend()
        this.service.showMsg(this.lang["undefined"]);            
      })
    } else {
      // login
      this.http.get(this.service.url + "&action=login&" + this.service.toparam(this.user)).subscribe(data => {
        console.log(data);
        
        switch (data["status"]) {
          case 1: // no username
            this.service.showMsg(this.lang["haventusername"]);
          break;
          case 2: // incorrect password
            this.service.showMsg(this.lang["incorrectpassword"]);            
          break;
          case 3: // success
            console.log(data);
            this.service.logged(data["data"])
          break;
          default: // undefined error
            this.service.showMsg(this.lang["undefined"]);            
          }
          this.service.loadend()
      }, (e) => {
        // undefined error
        this.service.loadend()
        this.service.showMsg(this.lang["undefined"]);            
      })
    }
  }

  nousername() {
    this.submitType = 1;
  }
  haveusername() {
    this.submitType = 0;
  }


}
