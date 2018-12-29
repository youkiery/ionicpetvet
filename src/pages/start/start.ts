import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { ServiceProvider } from '../../providers/service/service'

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {
  uid: number
  ready: boolean = false
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: ServiceProvider,
    private storage: Storage) {
      this.uid = Number(this.storage.get("uid"))
      if (Number.isFinite(this.uid)) {
        this.uid = 0
      }
      this.init()
    }

  init() {
    this.service.fetch(this.service.url + "&action=getinit&uid=" + this.uid).then(response => {
      console.log(response);
    }, (e) => {})
  }
}
