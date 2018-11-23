import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-provider',
  templateUrl: 'provider.html',
})
export class ProviderPage {
  provider: object
  rate: {
    total: number,
    averate: number,
    comment: {
      name: string,
      msg: string,
      time: string
    }
  }[] = [{
    total: 100,
    averate: 3,
    comment: {
      name: "string",
      msg: "string",
      time: "22/12/2018"
    }
  }]
  active: string[] = ["", "active"]
  activebar: number[] = [1, 0, 0]
  actindex = 0
  prvindex = 0
  constructor(public modalCtrl: ModalController, public service: ServiceProvider, public http: HttpClient,
    public lang: LangProvider, public alert: AlertController, public navCtrl: NavController,
    public navParam: NavParams) {
      this.provider = this.navParam.get('provider')
      this.provider["description"] = "Chưa có"
  }

  setActive(index) {
    console.log(index);
    this.activebar[this.actindex] = 0
    this.prvindex = this.actindex
    this.actindex = index
    this.activebar[this.actindex] = 1
  } 

  refresh() {
    this.setActive(0)
    this.service.loadstart()
    this.http.get(
      this.service.url + "&action=getproviderpet&prid=" + this.provider["id"]).subscribe(response => {
        console.log(response);
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
