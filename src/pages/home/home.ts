import { Component, ViewChild } from '@angular/core';
import { NavController, Events, ModalController, AlertController } from 'ionic-angular';

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
  npage: number = 1
  isnnext: boolean = false
  new: number = 0
  interval: any
  configInterval: any
  constructor(public navCtrl: NavController, public lang: LangProvider, public storage: Storage,
    public http: HttpClient, public service: ServiceProvider, public event: Events,
    public modalCtrl: ModalController, public alertCtrl: AlertController) {
      this.submitButton = [lang.login, lang.signup];
      // console.log(this.filter);
      this.storage.get("login").then(uid => {
        this.service.uid
        this.init(uid)
      })
  }
  ionViewWillLeave() {
    clearInterval(this.interval)
  }
  ionViewDidEnter() {
    this.interval = setInterval(() => {
      if (this.service.uid) {
        this.getnewnotice()
      }
    }, 5000);
  }
  init(uid) {
    if (!uid) uid = 0;
    this.service.fetch(this.service.url + "&action=getlogin&uid=" + uid + "&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&province=" + this.filter["province"] +  "&page=" + this.page + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]]).then((response) => {
      if (response["logininfo"]) {
        this.service.logged(response["logininfo"], this.navCtrl, false);
      }
      this.service.kind = response["kind"]
      this.service.species = response["species"]
      this.service.config = response["config"]
      this.service.type = response["type"]
      this.service.newpet = response["newpet"]
      this.isnext = response["next"]
      this.new = response["new"]
      this.banner = this.service.baseurl + this.service.config["banner"]
      console.log(this.service.newpet);
      
    }, (e) => {})
  }

  reconnect() {
    if (this.service.isconfig) {
      this.filterall()
    }
    else {
      this.init(this.service.uid)
    }
  }

  next() {
    this.service.fetch(this.service.url + "&action=filter&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&province=" + this.filter["province"] +  "&page=" + (this.page + 1) + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]]).then(response => {
      // console.log(data);
      this.service.newpet = response["newpet"]
      this.isnext = response["next"]
      this.page ++;
    }, (e) => {})
}

  changeprovince() {
    this.service.fetch(this.service.url + "&action=changeprovince&uid=" + this.service.uid + "&province=" + this.province).then(response => {
      this.service.province = this.province
      this.service.showMsg(this.lang["changedprovince"])
    }, (e) => {})
  }

  changeinfo() {
    this.info.name = this.service.name
    this.info.phone = this.service.phone
    this.info.address = this.service.address
    this.alertCtrl.create({
      title: this.lang.changeinfo,
      inputs: [
        {
          name: "name",
          value: this.info.name,
          type: "text",
          placeholder: this.lang["name"]
        },
        {
          name: "phone",
          value: this.info.phone,
          type: "text",
          placeholder: this.lang["phone"]
        },
        {
          name: "address",
          value: this.info.address,
          type: "text",
          placeholder: this.lang["address"]
        }
      ],
      buttons: [
        {
          text: this.lang.cancel
        },
        {
          text: this.lang.save,
          handler: (data) => {
            // console.log(data);
            
            this.service.fetch(this.service.url + "&action=changeinfo&uid=" + this.service.uid
              + "&name=" + data.name + "&phone=" + data.phone + "&address=" + data.address).then(response => {
                switch (response["status"]) {
                  case 1:
                    this.service.name = data.name
                    this.service.phone = data.phone
                    this.service.address = data.address
                  break;
                  case 2:
                    this.service.showMsg("usedphone")
                  break;
                }
              }, (e) => {})
          }
        }
      ]
    }).present()
  }

  search() {
    if (this.service.isconnect) {

      // console.log(1);
      this.issearch = true
      this.setActive(4)
      setTimeout(() => {
        this.myInput.setFocus()
      }, 500)
    }
  }
  bsearch() {
    // console.log(2);
    this.issearch = false
    this.setActive(this.prvindex)
  }

  setActive(index) {
    // console.log(index);
    // console.log(this.filter);
    this.service.newpet = []
    this.activebar[this.actindex] = 0
    this.prvindex = this.actindex
    this.actindex = index
    this.activebar[this.actindex] = 1
  } 

  home() {
    // remove all pushed page, set root to home
  }

  login() {
    if (this.service.isconnect) {

      this.setActive(1)
      this.province = this.service.province
    }
  }

  detail(index) {
    this.navCtrl.push(DetailPage, {data: this.service.newpet[index]});
  }

  open() {
    if (this.service.isconnect) {
      this.menu = !this.menu
    } else {
      this.service.showMsg(this.lang["msgreconnect"])
    }
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
    this.alertCtrl.create({
      title: this.lang.changepass,
      inputs: [
        {
          name: "pass",
          type: "password",
          placeholder: this.lang["password"]
        },
        {
          name: "npass",
          type: "password",
          placeholder: this.lang["npassword"]
        },
        {
          name: "vpass",
          type: "password",
          placeholder: this.lang["vpassword"]
        }
      ],
      buttons: [
        {
          text: this.lang.cancel
        },
        {
          text: this.lang.save,
          handler: (data) => {
            var msg = ""
            if (!data.pass) {
              msg = this.lang["emptypass"]
            } else if (!data.npass) {
              msg = this.lang["emptynpass"]
            } else if (data.npass != data.vpass) {
              msg = this.lang["incorrectvpass"]
            }
            if (!msg) {
              this.service.fetch(this.service.url + "&action=changepass&uid=" + this.service.uid + "&pass=" + data.pass + "&npass=" + data.npass).then(response => {
                  // đổi mật khẩu thành công
                  if (response["status"] == 1) {
                    this.service.showMsg("Đổi mật khẩu thành công")
                  }
                  else {
                    this.service.showMsg(this.lang["incorrectpassword"])
                  }
              }, (e) => {})
            }
            else {
              this.service.showMsg(msg)
            }
          }
        }
      ]
    }).present()
  }

  inbox() {
    if (this.service.isconnect) {
      this.setActive(2);
      if (this.service.uid) {
        this.service.fetch(this.service.url + "&action=getnotify&uid=" + this.service.uid + "&page=" + this.npage).then((response) => {
          // console.log(response);
            this.notifice = response["notify"]
            this.isnnext = response["next"]
            this.new = response["new"]
        }, (e) => {})
      }
    }
  }

  nnext() {
    this.service.fetch(this.service.url + "&action=getnotify&uid=" + this.service.uid + "&page=" + (this.npage + 1)).then((response) => {
        this.notifice = response["notify"]
        this.isnnext = response["next"]
        this.new = response["new"]
        this.npage ++
    }, (e) => {})
  }

  getnewnotice() {
    this.http.get(this.service.url + "&action=getnewnotice&uid=" + this.service.uid + "&ck=" + this.service.rand()).subscribe(response => {
      console.log(this.service.isconnect);
      
      if (response["status"]) {
        this.new = response["data"]["new"]
      }
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
    this.page = 1;
    this.filterall()
  }

  filterall() {
      this.service.fetch(this.service.url + "&action=filter&keyword=" + this.filter["keyword"] + "&kind=" + this.filter["kind"] + "&species=" + this.filter["species"] + "&sort=" + this.filter["sort"] + "&type=" + this.filter["type"] + "&province=" + this.filter["province"] +  "&page=" + this.page + "&price=" + this.service.price[this.filter["price"]["lower"]] + "-" + this.service.price[this.filter["price"]["upper"]]).then(response => {
        this.setActive(0)
        this.service.newpet = response["newpet"]
        this.isnext = response["next"]
      }, (e) => {})
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
        // signup
        this.service.fetch(this.service.url + "&action=signup&" + this.service.toparam(this.user)).then(response => {
          switch (response["status"]) {
            case 1: // username existed
              this.service.showMsg(this.lang["existedusername"]);            
            break;
            case 2: // success
              this.service.logged(response["info"])
            break;
            default:
              // undefined error
              this.service.showMsg(this.lang["undefined"]);            
          }
        }, (e) => {})
      }
    } else {
        // login        
        this.service.fetch(this.service.url + "&action=login&" + this.service.toparam(this.user)).then(response => {
          // console.log(data);
          switch (response["status"]) {
            case 1: // no username
              this.service.showMsg(this.lang["haventusername"]);
            break;
            case 2: // incorrect password
              this.service.showMsg(this.lang["incorrectpassword"]);            
            break;
            case 3: // success
              // console.log(data);
              this.service.logged(response["logininfo"])
              this.new = response["new"]
            break;
            default: // undefined error
              this.service.showMsg(this.lang["undefined"]);            
          }
        }, (e) => {})
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
