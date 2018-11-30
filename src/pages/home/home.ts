import { Component, ViewChild } from '@angular/core';
import { NavController, Events, ViewController, ModalController, AlertController } from 'ionic-angular';

import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { DetailPage } from '../detail/detail'
import { SalePage } from '../sale/sale';
import { SupportPage } from '../support/support';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('input') myInput;

  // main
  filter: object = {
    keyword: "",
    sort: 0,
    type: 0,
    price: {
      lower: 0,
      upper: 73
    },
    kind: 0,
    species: 0,
    province: 0
  }
  rangeSettings: number = 20;
  setdage: any;
  banner: string = ""
  active: string[] = ["", "active"]
  activebar: number[] = [1, 0, 0, 0, 0]
  actindex = 0
  prvindex = 0
  issearch: boolean = false
  // user
  submitButton: string[]
  submitType: number = 0 // 0: login, 1: signup
  user: {
    username: string,
    password: string,
    vpassword: string,
    name: string,
    phone: string,
    address: string,
    province: number,
  } = {
    username: "",
    password: "",
    vpassword: "",
    name: "",
    phone: "",
    address: "",
    province: 0
  }
  menu: boolean = false
  notifice: object[] = []
  info: {
    name: string,
    phone: string,
    address: string
  } = {
    name: "",
    phone: "",
    address: ""
  }
  province: number = 0
  page: number = 1
  isnext: boolean = false
  constructor(public navCtrl: NavController, public lang: LangProvider, public storage: Storage,
    public http: HttpClient, public service: ServiceProvider, public event: Events,
    public modalCtrl: ModalController, public alertCtrl: AlertController) {
      this.submitButton = [lang.login, lang.signup];
      // console.log(this.filter);
      
      this.service.loadstart()
      this.storage.get("login").then(logindata => {
        if (logindata) {
          this.checklogin(logindata)
        } else {
          this.refresh()
        }
      })
  }

  checklogin(logindata) {
    return new Promise((resolve) => {
      this.http.get(this.service.url + "&action=getlogin&id=" + logindata).subscribe(data => {
        if (data["status"]) {
          // login
          // console.log(data);
          
          this.service.logged(data["data"], this.navCtrl, false);
        }
        this.refresh().then(() => {
          resolve()
        })
      })
    })
  }

  refresh() {
    // console.log(this.filter);
    this.page = 1;
    return new Promise((resolve) => {
      this.service.loadstart()
      this.http.get(this.service.url + "&action=getinit&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&province=" + this.filter["province"] + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]] + "&page=" + this.page).subscribe(data => {
        // console.log(data);
        this.service.kind = data["data"]["kind"]
        this.service.species = data["data"]["species"]
        this.service.config = data["data"]["config"]
        this.service.type = data["data"]["type"]
        this.service.newpet = data["data"]["newpet"]
        this.isnext = data["data"]["next"]
        this.banner = this.service.baseurl + this.service.config["banner"]
        this.service.loadend()
        resolve()
      })
    })
  }

  next() {
    this.service.loadstart()
    this.http.get(this.service.url + "&action=filter&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&province=" + this.filter["province"] +  "&page=" + (this.page + 1) + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]]).subscribe(data => {
      // console.log(data);
      if (data["status"]) {
        this.service.newpet = data["data"]["newpet"]
        this.isnext = data["data"]["next"]
        this.page ++;
      }
      this.service.loadend()
    })
}

  changeprovince() {
    this.service.loadstart()
    this.http.get(this.service.url + "&action=changeprovince&uid=" + this.service.uid + "&province=" + this.province).subscribe(response => {
      if (response["status"]) {
        this.service.province = this.province
      }
      this.service.loadend()
    })
  }

  changeinfo() {
    this.info.name = this.service.name
    this.info.phone = this.service.phone
    this.info.address = this.service.address
    this.alertCtrl.create({
      title: this.lang.changeinfo,
      inputs: [
        {
          name: this.info.name,
          value: this.info.name,
          type: "text",
          placeholder: this.lang["name"]
        },
        {
          name: this.info.phone,
          value: this.info.phone,
          type: "text",
          placeholder: this.lang["phone"]
        },
        {
          name: this.info.address,
          value: this.info.address,
          type: "text",
          placeholder: this.lang["address"]
        }
      ],
      buttons: [
        {
          text: this.lang.save,
          handler: (data) => {
            this.service.loadstart()
            this.http.get(this.service.url + "&action=changeinfo&uid=" + this.service.uid
              + "&" + this.service.toparam(data)).subscribe(response => {
                if (response["status"]) {
                  this.service.name = data.name
                  this.service.phone = data.phone
                  this.service.address = data.address
                }
                this.service.loadend()
              })
          }
        },
        {
          text: this.lang.cancel
        }
      ]
    }).present()
  }

  search() {
    // console.log(1);
    this.issearch = true
    this.setActive(4)
    setTimeout(() => {
      this.myInput.setFocus()
    }, 500)
  }
  bsearch() {
    // console.log(2);
    this.issearch = false
    this.setActive(this.prvindex)
  }

  setActive(index) {
    // console.log(index);
    // console.log(this.filter);
    
    this.activebar[this.actindex] = 0
    this.prvindex = this.actindex
    this.actindex = index
    this.activebar[this.actindex] = 1
  } 

  home() {
    // remove all pushed page, set root to home
  }

  login() {
    this.setActive(1)
    this.province = this.service.province
  }

  detail(index) {
    this.navCtrl.push(DetailPage, {data: this.service.newpet[index]});
  }

  open() {
    this.menu = !this.menu
  }
  close() {
    this.menu = false
  }

  sale() {
    this.navCtrl.push(SalePage);
  }

  unit(price) {
    var formatter = new Intl.NumberFormat('vi-VI', {
      style: 'currency',
      currency: 'VND',
   });
   return formatter.format(price)
  }

  support() {
    this.navCtrl.push(SupportPage)
  }

  about() {
    this.navCtrl.push(AboutPage)
  }

  changepass() {
    this.modalCtrl.create(ChangePass).present()
  }

  inbox() {
    this.setActive(2);
    this.service.loadstart()
    this.http.get(this.service.url + "&action=getnotify&uid=" + this.service.uid).subscribe((response) => {
      // console.log(response);
      if (response["status"]) {
        this.notifice = response["data"]
      }
      this.service.loadend()
    })
  }

  tonotify(type, pid) {
    
    type = parseInt(type)
    switch (type) {
      case 1:
        // to order
      case 2:
        // to order
      case 5:
        // to order
        this.navCtrl.push(SalePage, {type: {
          value: 2,
          pid: pid
        }})
        break;
      case 3:
        // to detail
      case 4:
        // to detail
        this.navCtrl.push(DetailPage, {type: {
          value: 1,
          pid: pid
        }})
        break;
      case 6:
        // to bought
        this.navCtrl.push(SalePage, {type: {
          value: 4,
          pid: pid
        }})
        break;
      case 7:
        // to sold
        this.navCtrl.push(SalePage, {type: {
          value: 3,
          pid: pid
        }})
        break;
    }
  }

  filtersuball() {
    this.bsearch()
    this.filterall()
  }

  filterall() {
    this.service.loadstart()
    return new Promise((resolve) => {
      this.http.get(this.service.url + "&action=filter&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&province=" + this.filter["province"] +  "&page=" + this.page + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]]).subscribe(data => {
        // console.log(data);
        if (data["status"]) {
          this.service.newpet = data["data"]["newpet"]
          this.isnext = data["data"]["next"]
          // this.service.newpet = data["data"]
          // this.service.newpet = data["data"]
          resolve()
        }
        this.setActive(0)
        this.service.loadend()
      })
    })
  }

  submit() {
    // check username and password
    var msg = ""
    if (!this.user.username) {
      msg = "Chưa nhập tên tài khoản"
    } else if (!this.user.password) {
      msg = "Chưa nhập mật khẩu"
    } else if (this.submitType) {
      if (!this.user.name) {
        msg = "Chưa nhập tên"
      } else if (!this.user.phone) {
        msg = "Chưa nhập số điện thoại"
      } else if (!this.user.vpassword) {
        msg = "Chưa xác nhận mật khẩu"
      } else if (this.user.vpassword !== this.user.password) {
        msg = "Xác nhận mật khẩu không đúng"
      } else {
        this.service.loadstart()
        // signup
        this.http.get(this.service.url + "&action=signup&" + this.service.toparam(this.user)).subscribe(data => {
          switch (data["status"]) {
            case 1: // username existed
              this.service.showMsg(this.lang["existedusername"]);            
            break;
            case 2: // success
              this.service.logged(data["data"])
            break;
            default:
              // undefined error
              this.service.showMsg(this.lang["undefined"]);            
          }
          this.service.loadend()
        })
      }
    } else {
        // login        
        this.service.loadstart()
        this.http.get(this.service.url + "&action=login&" + this.service.toparam(this.user)).subscribe(data => {
          // console.log(data);
          switch (data["status"]) {
            case 1: // no username
              this.service.showMsg(this.lang["haventusername"]);
            break;
            case 2: // incorrect password
              this.service.showMsg(this.lang["incorrectpassword"]);            
            break;
            case 3: // success
              // console.log(data);
              this.service.logged(data["data"])
            break;
            default: // undefined error
              this.service.showMsg(this.lang["undefined"]);            
          }
          this.service.loadend()
        })
    }
    if (msg) {
      this.service.showMsg(msg)
    }
  }

  nousername() {
    this.submitType = 1;
  }
  haveusername() {
    this.submitType = 0;
  }

}
@Component({
  template:
  `
  <form (ngSubmit)="changepass()">
    <ion-list>
      <ion-item>
        <ion-label> {{lang.password}} </ion-label>
        <ion-input [(ngModel)]="pass" name="password"> </ion-input>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.npassword}} </ion-label>
        <ion-input [(ngModel)]="npass" name="npass"> </ion-input>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.vpassword}} </ion-label>
        <ion-input [(ngModel)]="vpass" name="vpass"> </ion-input>
      </ion-item>
      <button ion-button>
        {{lang.changepass}}
      </button>
    </ion-list>
  `
})
export class ChangePass {
  pass: string = ""
  vpass: string = ""
  npass: string = ""
  constructor(public lang: LangProvider, public service: ServiceProvider, public viewCtrl: ViewController,
    public http: HttpClient) {
  }
  changepass() {
    // console.log(this.pass, this.vpass);
    if (this.npass == this.vpass) {
      this.service.loadstart()
      this.http.get(this.service.url + "&action=changepass&uid=" + this.service.uid + "&pass=" + this.pass + "&npass=" + this.npass).subscribe(response => {
        if (response) {
          // đổi mật khẩu thành công
          this.service.showMsg("Đổi mật khẩu thành công")
        }
        this.service.loadend()
      })
      this.viewCtrl.dismiss()
    }
    else {
      this.service.showMsg(this.lang["undefined"])
    }
  }
}
