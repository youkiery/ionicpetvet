import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';
import { HttpClient } from '@angular/common/http';
import { DetailPage } from '../detail/detail';

@IonicPage()
@Component({
  selector: 'page-provider',
  templateUrl: 'provider.html',
})
export class ProviderPage {
  provider: object = {}
  rate: {
    total: number,
    average: number,
    totalsale: number,
    comment: {
      name: string,
      msg: string,
      time: string
    }[]
  } = {
    total: 0,
    average: 0,
    totalsale: 0,
    comment: []
  }
  active: string[] = ["", "active"]
  activebar: number[] = [1, 0, 0]
  actindex = 0
  prvindex = 0
  propet: object[]
  page: number = 1
  isnext: boolean = false
  rpage: number = 1
  isrnext: boolean = false
  constructor(public service: ServiceProvider, public http: HttpClient,
    public lang: LangProvider, public alert: AlertController, public navCtrl: NavController,
    public navParam: NavParams) {
      this.provider = this.navParam.get('provider')
      this.propet = Array.apply(null, Array(12)).map(() => {
        return {
          image: ["../assets/imgs/noimage.png"],
          name: this.lang.loading,
          owner: this.lang.loading,
          price: this.lang.loading,
          province: this.lang.loading,
          timer: this.lang.loading,
          type: this.lang.loading,
        }
      })
        // console.log(this.provider);
      
      this.provider["description"] = "Chưa có"
      this.refresh()
  }

  setActive(index) {
    // console.log(index);
    this.activebar[this.actindex] = 0
    this.prvindex = this.actindex
    this.actindex = index
    this.activebar[this.actindex] = 1
  } 

  detail(index) {
    this.navCtrl.push(DetailPage, {data: this.propet[index]});
  }

  refresh() {
    this.setActive(0)

    this.service.fetch(
      this.service.url + "&action=getproviderpet&name=" + this.provider["name"] + "&phone=" + this.provider["phone"] + "&page=" + this.page).then(response => {
          this.propet = response["propet"]
          this.isnext = response["next"]
          // console.log(response["rate"]);
          // console.log(this.rate["comment"]);
      }, e => {})
  }

  reconnect() {
    this.refresh()
  }

  getrate() {
    this.service.fetch(
      this.service.url + "&action=getrate&name=" + this.provider["name"] + "&phone=" + this.provider["phone"] + "&page=" + this.rpage).then(response => {
        this.rate["total"] = response["total"]
        this.rate["average"] = response["average"]
        this.rate["totalsale"] = response["totalsale"]
        this.rate["comment"] = response["rate"]
        this.isrnext = response["next"]
      }, e => {})
  }

  getnextrate() {
    this.service.fetch(
      this.service.url + "&action=getnextrate&name=" + this.provider["name"] + "&phone=" + this.provider["phone"] + "&page=" + (this.rpage + 1)).then(response => {
        this.rate["comment"] = response["rate"]
        this.isrnext = response["next"]
        this.rpage ++
      }, e => {})
  }

  next() {
    this.service.fetch(
      this.service.url + "&action=getproviderpet&name=" + this.provider["name"] + "&phone=" + this.provider["phone"] + "&page=" + (this.page + 1)).then(response => {
        // console.log(response);
          this.propet = response["propet"]
          this.isnext = response["next"]
          this.page ++
          // console.log(response["rate"]);
          // console.log(this.rate["comment"]);
      }, e => {})
  }
  info() {
    if (this.service.isconnect) {
      this.setActive(1)
    }
  }
  crate() {
    if (this.service.isconnect) {
      this.setActive(2)
      this.getrate()
    }
  }
  home() {
    this.navCtrl.popAll()
  }
  back() {
    this.navCtrl.pop()
  }
}
