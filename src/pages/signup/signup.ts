import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { LangProvider } from '../../providers/lang/lang';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  submitType: number = 0
  submitButton: string[]
  constructor(public navCtrl: NavController, public navParams: NavParams, private service: ServiceProvider,
    private lang: LangProvider) {
      this.submitButton = [lang.login, lang.signup];
  }

  change(index: number) {
    this.submitType = index
  }

  submit() {
    var msg = ""
    if (!this.service.signInfo.username) {
      msg = "Chưa nhập tên tài khoản"
    } else if (!this.service.signInfo.password) {
      msg = "Chưa nhập mật khẩu"
    } else if (this.submitType) {
      if (!this.service.signInfo.name) {
        msg = "Chưa nhập tên"
      } else if (!this.service.signInfo.phone) {
        msg = "Chưa nhập số điện thoại"
      } else if (!isFinite(Number(this.service.signInfo.phone)) || this.service.signInfo.phone.length < 4 || this.service.signInfo.phone.length > 12) {
        msg = "Số điện thoại không hợp lệ"
      } else if (!this.service.signInfo.vpassword) {
        msg = "Chưa xác nhận mật khẩu"
      } else if (this.service.signInfo.vpassword !== this.service.signInfo.password) {
        msg = "Xác nhận mật khẩu không đúng"
      } else {
        // signup
        this.service.fetch(this.service.url + "&action=signup&" + this.service.toparam(this.service.signInfo)).then(response => {
          switch (response["status"]) {
            case 1: // success
            this.service.logged(response["info"])
            break;
            case 2: // error
            this.service.showMsg(response["msg"]);            
            break;
          }
        }, (e) => {})
      }
    } else {
        // login        
        this.service.fetch(this.service.url + "&action=signin&" + this.service.toparam(this.service.signInfo)).then(response => {
          switch (response["status"]) {
            case 1: // success
            this.service.logged(response["info"])
            break;
            case 2: // error
            this.service.showMsg(response["msg"])
            break;
          }
        }, (e) => {})
    }
    if (msg) {
      this.service.showMsg(msg)
    }
  }
}
