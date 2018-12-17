import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang'

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private lang: LangProvider) {
    
  }

  back() {
    this.navCtrl.pop()
  }
}
