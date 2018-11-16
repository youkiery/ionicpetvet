import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import {DetailPage} from '../detail/detail'
import {UserPage} from '../user/user'
import { SalePage } from '../sale/sale';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  filter: object = {
    keyword: "",
    sort: 0,
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
  constructor(public navCtrl: NavController, public lang: LangProvider, public storage: Storage,
    public http: HttpClient, public service: ServiceProvider, public event: Events) {
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
      this.http.get(this.service.url + "?action=getlogin&id=" + logindata).subscribe(data => {
        if (data["status"]) {
          // login
          console.log(data);
          
          this.service.logged(data["data"], this.navCtrl, false);
        }
        this.refresh(resolve)
      }, (e) => {
        // network error
        this.refresh(resolve)
      })
    })
  }

  refresh(resolve = null) {
    this.http.get(this.service.url + "?action=getinit").subscribe(data => {
      console.log(data);
      this.service.kind = data["data"]["kind"]
      this.service.species = data["data"]["species"]
      this.service.config = data["data"]["config"]
      this.banner = this.service.baseurl + this.service.config["banner"]
      this.filterall().then(() => {
        this.service.loadend()
        if (resolve) {
          resolve()
        }
      })
    })
  }

  home() {
    // remove all pushed page, set root to home
  }

  login() {
    this.navCtrl.push(UserPage);
  }

  detail(index) {
    this.navCtrl.push(DetailPage, {data: this.service.newpet[index]});
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
  filterall() {
    return new Promise((resolve) => {
      this.http.get(this.service.url + "?action=filter&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&price=" + this.filter["price"]["lower"] + "-" + this.filter["price"]["upper"]).subscribe(data => {
        console.log(data);
        if (data["status"]) {
          this.service.newpet = data["data"]
          resolve()
        }
      })
    })
  }

}
