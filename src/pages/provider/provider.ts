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
  constructor(public service: ServiceProvider, public http: HttpClient,
    public lang: LangProvider, public alert: AlertController, public navCtrl: NavController,
    public navParam: NavParams) {
      this.provider = this.navParam.get('provider')
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
    this.service.loadstart()
    this.http.get(
      this.service.url + "&action=getproviderpet&name=" + this.provider["name"] + "&phone=" + this.provider["phone"]).subscribe(response => {
        // console.log(response);
        if (response["status"]) {
          this.propet = response["data"]["propet"]
          this.rate["total"] = response["data"]["total"]
          this.rate["average"] = response["data"]["average"]
          this.rate["totalsale"] = response["data"]["totalsale"]
          this.rate["comment"] = response["data"]["rate"]
          // console.log(response["data"]["rate"]);
          // console.log(this.rate["comment"]);
          
        }
        this.service.loadend()
      })
  }
  info() {
    this.setActive(1)
  }
  crate() {
    this.setActive(2)
  }
  home() {
    this.navCtrl.popAll()
  }
  back() {
    this.navCtrl.pop()
  }
}
