import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public lang: LangProvider,
    public http: HttpClient, public service: ServiceProvider) {

  }


}
