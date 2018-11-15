import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  submitButton: string[]
  submitType: number = 0 // 0: login, 1: signup
  user: {
    username: string,
    password: string,
    vpassword: string,
    name: string,
    phone: string,
    address: string,
    provide: number,
  } = {
    username: "",
    password: "",
    vpassword: "",
    name: "",
    phone: "",
    address: "",
    provide: 0
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public lang: LangProvider,
    public http: HttpClient, public service: ServiceProvider) {
    this.submitButton = [lang.login, lang.signup];

  }

  submit() {
    // check username and password
    if (this.submitType) {
      // signup
      this.http.get(this.service.url + "?action=signup&" + this.service.toparam(this.user)).subscribe(data => {
        switch (data["status"]) {
          case 1: // username existed
            this.service.showMsg(this.lang["existedusername"]);            
          break;
          case 2: // success
            this.service.logged(data["data"], this.navCtrl);
          break;
          default:
            // undefined error
            this.service.showMsg(this.lang["undefined"]);            
        }
      }, (e) => {
        // undefined error
        this.service.showMsg(this.lang["undefined"]);            
      })
    } else {
      // login
      this.http.get(this.service.url + "?action=login&" + this.service.toparam(this.user)).subscribe(data => {
        console.log(data);
        
        switch (data["status"]) {
          case 1: // no username
            this.service.showMsg(this.lang["haventusername"]);
          break;
          case 2: // incorrect password
            this.service.showMsg(this.lang["incorrectpassword"]);            
          break;
          case 3: // success
            this.service.logged(data["data"], this.navCtrl);
          break;
          default: // undefined error
            this.service.showMsg(this.lang["undefined"]);            
        }
      }, (e) => {
        // undefined error
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
