import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang'

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private lang: LangProvider) {
    
  }

  back() {
    this.navCtrl.pop()
  }

}
