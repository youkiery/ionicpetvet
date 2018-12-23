import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang';

@IonicPage()
@Component({
  selector: 'page-law',
  templateUrl: 'law.html',
})
export class LawPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private lag: LangProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LawPage');
  }
  back() {
    this.navCtrl.pop()
  }
}
