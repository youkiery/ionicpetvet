import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Events, ModalController } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */ 

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  func_list: string[] = ["Danh sách giống thú cưng", "Danh sách thành viên"]
  nav_index: number = 0
  species_list: object[] = []
  user_list: object[] = []
  user_page: number = 1;
  isusernext: boolean = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController,
    private lang: LangProvider, private service: ServiceProvider, private event: Events,
    private modal: ModalController) {
      this.species()
      this.event.subscribe("add-user", (list: object[], next: boolean) => {
        this.user_list = list
        this.isusernext = next
      })
  }
  set_nav(id: number) {
    this.nav_index = id
    switch (id) {
      case 1:
        this.user(1)
      break;
      default:
        this.species()
    }
  }
  species() {
    this.service.fetch(this.service.url + "&action=getspecies").then((response) => {
      this.species_list = response["list"]
    }, (err) => { })
  }
  user(page: number) {
    this.service.fetch(this.service.url + "&action=getuser&page=" + page).then((response) => {
      this.user_page = page
      this.user_list = response["list"]
      this.isusernext = response["next"]
    }, (err) => { })
  }
  edit_user(user: object) {
    var x = JSON.parse(JSON.stringify(user))
    x["province"] = this.service.config["province"].indexOf(user["province"]);
    let modal = this.modal.create(EditUser, {"user": x, "page": this.user_page})
    modal.present()
  }
  add_user() {
    let modal = this.modal.create(AddUser, {"page": this.user_page})
    modal.present()
    // let alert = this.alert.create({
    //   title: this.lang["add_user_title"],
    //   inputs: [
    //     {
    //       label: this.lang["username"],
    //       name: "username",
    //       type: "text",
    //     },
    //     {
    //       label: this.lang["name"],
    //       name: "name",
    //       type: "text",
    //     },
    //     {
    //       label: this.lang["phone"],
    //       name: "phone",
    //       type: "text",
    //     },
    //     {
    //       label: this.lang["address"],
    //       name: "address",
    //       type: "text",
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: this.lang["cancel"]
    //     },
    //     {
    //       text: this.lang["add"],
    //       handler: (data) => {
    //         console.log(data);
            
    //         this.service.fetch(this.service.url + "&action=adduser&page=" + this.user_page + "&" + this.service.toparam(data)).then((response) => {
    //           switch (response["status"]) {
    //             case 1:
    //               this.user_list = response["list"]
    //             break;
    //             default:
    //               this.service.showMsg(this.lang["existedusername"]);
    //           }
    //         }, (err) => { })
    //       }
    //     }
    //   ]
    // }).present()
  }
  change_role(id: number, role: number) {
    this.alert.create({
      title: this.lang["changerole"],
      inputs: [
        {
          label: this.lang["member"],
          name: "role",
          type: "radio",
          value: "0",
          checked: ((role == 0) ? true : false)
        },
        {
          label: this.lang["mod"],
          name: "role",
          type: "radio",
          value: "1",
          checked: ((role == 1) ? true : false)
        },
        {
          label: this.lang["supermod"],
          name: "role",
          type: "radio",
          value: "2",
          checked: ((role == 2) ? true : false)
        },
        {
          label: this.lang["admin"],
          name: "role",
          type: "radio",
          value: "3",
          checked: ((role == 3) ? true : false)
        }
      ],
      buttons: [
        {
          text: this.lang["save"],
          handler: (data) => {
            this.service.fetch(this.service.url + "&action=changerole&page=" + this.user_page + "id=" + id + "&role=" + data + "&uid=" + this.service.uid).then((response) => {
              if (response["status"] == 1) {
                this.service.setrole(response["role"], response["roles"], response["active"])
                this.user_list = response["list"]
                this.isusernext = response["next"]
              }
              else {
                this.service.showMsg(this.lang["notallowed"])
              }
            }, (err) => { })
          }
        },
        {
          text: this.lang["cancel"]
        }
      ]
    }).present()
  }

  remove_user(id: number) {
    this.alert.create({
      title: this.lang["removequest"],
      buttons: [
        {
          text: this.lang["remove"],
          handler: () => {
            this.service.fetch(this.service.url + "&action=removeuser&id=" + id + "&page=" + this.user_page).then((response) => {
              this.user_list = response["list"]
              this.isusernext = response["next"]
            }, (err) => { })
          }
        },
        {
          text: this.lang["cancel"]
        }
      ]
    }).present()
  }
  add_species(kind: number) {
      this.alert.create({
        title: this.lang["add_kind"],
        inputs: [
          {
            label: this.lang["kind"],
            name: "kind",
            type: "text",
            placeholder: this.lang["kind"]
          }
        ],
        buttons: [
          {
            text: this.lang["add"],
            handler: (data) => {
              this.service.fetch(this.service.url + "&action=addspecies&name=" + data["kind"] + "&kind=" + kind).then(response => {
                this.species_list = response["list"]
              }, (err) => {
                
              })
            }
          },
          {
            text: this.lang["cancel"],
          }
        ]
      }).present()
  }

  add_kind() {
    this.alert.create({
      title: this.lang["add_kind"],
      inputs: [
        {
          label: this.lang["kind"],
          name: "kind",
          type: "text",
          placeholder: this.lang["kind"]
        }
      ],
      buttons: [
        {
          text: this.lang["add"],
          handler: (data) => {
            this.service.fetch(this.service.url + "&action=addkind&name=" + data["kind"]).then(response => {
              this.species_list = response["list"]
            }, (err) => {
                
            })
          }
        },
        {
          text: this.lang["cancel"],
        }
      ]
    }).present()
  }
  remove_kind(id: number) {
    this.alert.create({
      title: this.lang["remove_quest"],
      buttons: [
        {
          text: this.lang["cancel"]
        },
        {
          text: this.lang["remove"],
          handler: (data) => {
            this.service.fetch(this.service.url + "&action=removekind&id=" + id).then(response => {
              this.species_list = response["list"]
            }, (err) => {
                
            })
          }
        }
      ]
    }).present()
  }
  remove_species(id: number) {
    this.alert.create({
      title: this.lang["remove_quest"],
      buttons: [
        {
          text: this.lang["cancel"]
        },
        {
          text: this.lang["remove"],
          handler: (data) => {
            this.service.fetch(this.service.url + "&action=removespecies&id=" + id).then(response => {
              this.species_list = response["list"]
            }, (err) => {
                
            })
          }
        }
      ]
    }).present()
  }
  back() {
    this.navCtrl.pop();
  }
  moreuser() {
    this.service.fetch(this.service.url + "&action=getuser&page=" + (this.user_page + 1)).then((response) => {
      this.user_page ++
      this.user_list = response["list"]
      this.isusernext = response["next"]
    }, (err) => { })
  }
}

@Component({
  template: `
    <form (ngSubmit)="create()" class="panel" *ngIf="user">
    <ion-item>
      <ion-label> {{lang.username}} </ion-label>
      <ion-input type="text" [(ngModel)]="this.user.username" name="username"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.password}} </ion-label>
      <ion-input type="password" [(ngModel)]="this.user.password" name="password"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.fullname}} </ion-label>
      <ion-input type="text" [(ngModel)]="this.user.name" name="name"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.phone}} </ion-label>
      <ion-input type="text" [(ngModel)]="this.user.phone" name="phone"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.address}} </ion-label>
      <ion-input type="text" [(ngModel)]="this.user.address" name="address"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.province}} </ion-label>
      <ion-select [(ngModel)]="this.user.province" name="province">
        <ion-option *ngFor="let option of service.config.province; let i = index" value="{{i}}">
          {{option}}
        </ion-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.role}} </ion-label>
      <ion-select [(ngModel)]="this.user.role" name="province">
        <ion-option value="0">
          {{lang.member}}
        </ion-option>
        <ion-option value="1">
          {{lang.mod}}
        </ion-option>
        <ion-option value="2">
          {{lang.supermod}}
        </ion-option>
        <ion-option value="3">
          {{lang.admin}}
        </ion-option>
      </ion-select>
    </ion-item>
    <div *ngFor="let option of service.function; let i = index">
      <ion-item *ngIf="user.role == 2">    
        <ion-label> {{option.name}} </ion-label>
        <ion-checkbox [(ngModel)]="roles[option.key]" name="i"></ion-checkbox>
      </ion-item>
    </div>
    <button ion-button color="secondary" type="submit" class="button-half"> {{lang.create}} </button>
  </form>
  `
})
export class AddUser {
  user: object = {}
  page: number = 1
  roles: object = {
    a: false,
    k: false,
    u: false
  }
  constructor(private navParam: NavParams, private viewCtrl: ViewController, private lang: LangProvider,
    private service: ServiceProvider, private event: Events) {
      var page = this.navParam.get("page")
      if (page) {
        this.page = page
      }
      this.user["province"] = 0
      this.user["role"] = 0
  }
  create() {
    var msg = ""
    if (!this.user["username"]) {
      msg = "Chưa nhập tên tài khoản"
    } else if (!this.user["password"]) {
      msg = "Chưa nhập mật khẩu"
    } else if (!this.user["name"]) {
        msg = "Chưa nhập tên"
      } else if (!this.user["phone"]) {
        msg = "Chưa nhập số điện thoại"
      } else if (!isFinite(Number(this.user["phone"])) || this.user["phone"].length < 4 || this.user["phone"].length > 12) {
        msg = "Số điện thoại không hợp lệ"
      } else {
        var x = ""
        for (const key in this.roles) {
          if (this.roles.hasOwnProperty(key)) {
            if (this.roles[key]) {
              x += key            
            }
          }
        }
        this.user["roles"] = x
        this.service.fetch(this.service.url + "&action=adduser&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.user)).then(response => {
          switch (response["status"]) {
            case 2: // username existed
              this.service.showMsg(this.lang["existedusername"]);            
            break;
            case 1: // success
              this.event.publish("add-user", response["list"], response["next"]);
              this.close()
            break;
          }
        }, (e) => {})
      }
    this.service.showMsg(msg)
  }
  close() {
    this.viewCtrl.dismiss()
  }
}
@Component({
  template: `
    <form (ngSubmit)="create()" class="panel" *ngIf="user">
    <ion-item>
      {{lang.username}} {{user.username}}
    </ion-item>
    <ion-item>
      <ion-label> {{lang.password}} </ion-label>
      <ion-input type="password" [(ngModel)]="this.user.password" name="password"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.fullname}} </ion-label>
      <ion-input type="text" [(ngModel)]="this.user.name" name="name"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.phone}} </ion-label>
      <ion-input type="text" [(ngModel)]="this.user.phone" name="phone"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.address}} </ion-label>
      <ion-input type="text" [(ngModel)]="this.user.address" name="address"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.province}} </ion-label>
      <ion-select [(ngModel)]="this.user.province" name="province">
        <ion-option *ngFor="let option of service.config.province; let i = index" value="{{i}}">
          {{option}}
        </ion-option>
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label> {{lang.role}} </ion-label>
      <ion-select [(ngModel)]="this.user.role" name="province">
        <ion-option value="0">
          {{lang.member}}
        </ion-option>
        <ion-option value="1">
          {{lang.mod}}
        </ion-option>
        <ion-option value="2">
          {{lang.supermod}}
        </ion-option>
        <ion-option value="3">
          {{lang.admin}}
        </ion-option>
      </ion-select>
    </ion-item>
    <div *ngFor="let option of service.function; let i = index">
      <ion-item *ngIf="user.role == 2">    
        <ion-label> {{option.name}} </ion-label>
        <ion-checkbox [(ngModel)]="roles[option.key]" name="i"></ion-checkbox>
      </ion-item>
    </div>
    <button ion-button color="secondary" type="submit" class="button-half"> {{lang.create}} </button>
  </form>
  `
})
export class EditUser {
  user: object = {}
  page : number = 1
  roles: object = {
    a: false,
    k: false,
    u: false
  }
  constructor(private navParam: NavParams, private viewCtrl: ViewController, private lang: LangProvider,
    private service: ServiceProvider, private event: Events) {
      var user = this.navParam.get('user');
      var page = this.navParam.get('page');
      console.log(user);
      
      if (user) {
        this.user = user
      }
      if (page) {
        this.page = page
      }
  }
  create() {
    var msg = ""
    if (!this.user["username"]) {
      msg = "Chưa nhập tên tài khoản"
    } else if (!this.user["name"]) {
        msg = "Chưa nhập tên"
      } else if (!this.user["phone"]) {
        msg = "Chưa nhập số điện thoại"
      } else if (!isFinite(Number(this.user["phone"])) || this.user["phone"].length < 4 || this.user["phone"].length > 12) {
        msg = "Số điện thoại không hợp lệ"
      } else {
        var x = ""
        console.log(this.roles);
        
        for (const key in this.roles) {
          if (this.roles.hasOwnProperty(key)) {
            if (this.roles[key]) {
              x += key            
            }
          }
        }
        this.user["roles"] = x
        this.service.fetch(this.service.url + "&action=edituser&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.user)).then(response => {
          switch (response["status"]) {
            case 1:
            this.event.publish("add-user", response["list"], response["next"]);
            this.close()
            break;
            case 2:
            this.service.showMsg(this.lang["existedusername"])
            break;
            case 3:
            this.service.showMsg(this.lang[""])
            break;
          }
        }, (e) => {})
      }
    this.service.showMsg(msg)
  }
  close() {
    this.viewCtrl.dismiss()
  }
}