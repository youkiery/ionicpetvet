import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController, Events } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-sale',
  templateUrl: 'sale.html',
})
export class SalePage {
  // post: {
  //   name: string,
  //   date: string,
  //   description: string,
  //   files: any
  // } = {}
  filter: object = {
    keyword: "",
    sort: 0,
    type: 0
  }
  type: number = 0
  active: string[] = ["", "active"]
  activebar: number[] = [1, 0, 0, 0, 0]
  actindex = 0
  prvindex = 0
  constructor(public modalCtrl: ModalController, public service: ServiceProvider, public http: HttpClient,
    public lang: LangProvider, public alert: AlertController, public navCtrl: NavController,
    public navParam: NavParams, public ev: Events) {
      var type = this.navParam.get("type")
      if (type) {
        this.setActive(type.value)
      }
      this.filterall()  
      this.ev.subscribe("submitorder-finish", (data) => {
        this.service.userpet = data["vender"]
      })
      // setInterval(() => {
      //   console.log(this.service.userpet);
      // }, 3000)
    
  }

  sell() {
    this.setActive(0)
  }
  buy() {
    this.setActive(1)
  }
  order() {
    this.setActive(2)
  }
  sold() {
    this.setActive(3)
  }
  bought() {
    this.setActive(4)
  }

  back() {
    this.navCtrl.pop()
  }
  
  setActive(index) {
    // console.log(index);
    
    this.activebar[this.actindex] = 0
    this.prvindex = this.actindex
    this.actindex = index
    this.activebar[this.actindex] = 1
    this.filter["type"] = index
    this.filterall()
  } 

  filterall() {
    this.service.fetch(this.service.url + "&action=salefilter&uid=" + this.service.uid + "&" + this.service.toparam(this.filter)).then(response => {
        this.service.userpet = response["data"]
        this.type = this.filter["type"]
    })
  }

  disorder(id) {
    var alert = this.alert.create({
      title: this.lang["notice"],
      message: this.lang["removequest"],
      buttons: [
        {
          text: this.lang["remove"],
          handler: () => {
            this.service.fetch(this.service.url + "&action=disorder&id=" + id + "&uid=" + this.service.uid + "&" + this.service.toparam(this.filter)).then(response => {
              // console.log(response);
                this.service.userpet = response["data"]["userpet"]
            })
          }
        },
        {
          text: this.lang["cancel"]
        }
      ]
    })
    alert.present()
  }

  viewdetail(oid) {
    this.service.fetch(this.service.url + "&action=getvender&oid=" + oid).then(response => {
        
        this.modalCtrl.create(OrderDetail, {data: response["data"]}).present()
    })
  }

  post() {
    let x = this.modalCtrl.create(Post, {filter: this.filter});
    x.present()
  }

  edit(id, name, timer, price, description, kind, species, type, age, vaccine, image) {
    let x = this.modalCtrl.create(Post, {data: {id: id, name: name, timer: timer, price: price, description: description, kind: kind, species: species, type: type, age: age, vaccine: vaccine, image: image}});
    x.present()
  }

  remove(id) {
    let alert = this.alert.create({
      title: this.lang["removequest"],
      buttons: [
        {
          text: this.lang["remove"],
          handler: () => {
            this.service.fetch(this.service.url + "&action=removepost&id=" + id + "&uid=" + this.service.uid + "&" + this.service.toparam(this.filter)).then(response => {
              switch (response["status"]) {
                case 1:
                  this.service.showMsg(this.lang["removesuccess"])
                  this.service.userpet = response["data"]["userpet"]
                  break;
                default:
                  this.service.showMsg(this.lang["removefail"])
                  break;
              }
            })
          }
        },
        {
          text: this.lang["cancel"]
        }
      ]
    })
    alert.present()
  }

  orderdetail(pid) {
    this.service.fetch(this.service.url + "&action=getorderlist&pid=" + pid).then(response => {
      // console.log(response);
        let modal = this.modalCtrl.create(OrderDetailList, {data: response["data"], filter: this.filter, pid: pid})
        modal.present()
    })
  }

}

@Component({
  template: `
  <form (ngSubmit)="savepost()" class="sale">
    <div class="sale_left">
      <ion-item>
        <ion-label> {{lang.title}} </ion-label>
        <ion-input type="text" [(ngModel)]="this.post.name" name="name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.kind}} </ion-label>
        <ion-select [(ngModel)]="post.kind" name="kind">
          <ion-option *ngFor="let option of this.service.kind" value="{{option.id}}">{{option.name}}</ion-option>
        </ion-select>
      </ion-item>
      <ion-item *ngIf="post.kind > 0">
        <ion-label> {{lang.species}} </ion-label>
        <ion-select [(ngModel)]="post.species" name="species">
          <ion-option *ngFor="let option of this.service.species[post.kind]" value="{{option.id}}">{{option.name}}</ion-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.age}} </ion-label>
        <ion-select [(ngModel)]="post.age" name="age">
          <ion-option *ngFor="let option of service.config.age; let i = index" value="{{i}}">{{option}}</ion-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.vaccine}} </ion-label>
        <ion-select [(ngModel)]="post.vaccine" name="vaccine">
          <ion-option *ngFor="let option of service.config.vaccine; let i = index" value="{{i}}">{{option}}</ion-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.type}} </ion-label>
        <ion-select [(ngModel)]="post.typeid" name="typeid">
          <ion-option *ngFor="let option of service.type; let i = index" value="{{i}}">{{option}}</ion-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.price}} </ion-label>
        <ion-input type="text" [(ngModel)]="this.post.price" name="price" placeholder="{{lang.unit}}" (keyup)="formatprice($event)"></ion-input>
      </ion-item>
      <ion-textarea [(ngModel)]="this.post.description" name="description" class="description" placeholder="{{lang.description}}"></ion-textarea>
      <button ion-button color="secondary" type="submit" class="button-half"> {{lang.post}} </button>
    </div>
    <div class="sale_right">
      <div class="upload-btn-wrapper">
        <ion-label class="upload-btn">{{lang.upload}}</ion-label>
        <input class="upload-input" type="file" [(ngModel)]="post.files" id="files" name="files" multiple (change)="change()" >
        <span *ngFor="let image of post.image">
          <img class="thumb" src="{{image}}">
        </span>
      </div>
    </div>
  </form>
  `
})
export class Post {
  post: any = {}
  images: string[] = []
  filter: object = {
    keyword: "",
    sort: 0,
    type: 0
  }
  realprice: number = 0

  constructor(public navCtrl: NavController, public navParams: NavParams, public lang: LangProvider,
    public service: ServiceProvider, public http: HttpClient, public viewCtrl: ViewController) {
    // console.log(this.service.species);
    
    var now = new Date();
    var data = this.navParams.get("data")
    this.filter = this.navParams.get("filter")
    // console.log(data);
    
    if (data) {
      this.post = data
      // console.log(this.post);
      // console.log(this.service.config);
    } else {
      this.post.name = ""
      this.post.date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() 
      this.post.description = ""
      this.post.kind = 0
      this.post.species = 0
      this.post.vaccine = 0
      this.post.typeid = 0
      this.post.age = 0
      this.post.price = 0
    }
  }

  formatprice(e) {
    var x = e.target.selectionStart ;
    var d1 = (this.post.price.match(/./g) || []).length
    var num = this.parse(this.post.price);
    
    if (isFinite(Number(e.key)) || e.key == "Backspace" || e.key == "Delete") {
      this.post.price = this.format(num)
      setTimeout(() => {
        var d2 = (this.post.price.match(/./g) || []).length
        x += (d2 - d1);
        e.target.setSelectionRange(x, x)
      }, 10)
    }
  }

    format(num) {
      var formatter = new Intl.NumberFormat('vi-VI', {
        style: 'currency',
        currency: 'VND',
      });
      var result = formatter.format(num)
      result = result.slice(0, result.length - 2)
      return result
    }

    parse(val) {
      return val.replace(/\./g, "")
    }

  change() {
    var input = document.getElementById("files")
    this.post.image = []
    if (input["files"] && input["files"][0]) {
      var length = input["files"].length;
      for (var i = 0; i < length; i ++) {
        var reader = new FileReader();

        reader.onload = (e) => {
          this.post.image.push(e.target["result"])
        };
  
        reader.readAsDataURL(input["files"][i]);  
      }
    }
  }

  savepost() {
    var files = document.getElementById("files");
    files = files["files"];
    
    var fd = new FormData();
    var check = true;
    var length = 0;
    while (check) {
      if (files && files[length]) {
        fd.append("file[" + length + "]", files[length]);
        length ++;
      } else check = false;
    }
    fd.append("uid", this.service.uid);
    fd.append("ck", this.service.rand());
    fd.append("name", this.post.name);
    fd.append("age", this.post.age);
    fd.append("price", this.post.price);
    fd.append("description", this.post.description);
    fd.append("species", this.post.species);
    fd.append("kind", this.post.kind);
    fd.append("vaccine", this.post.vaccine);
    fd.append("typeid", this.post.typeid);
    fd.append("id", this.post.id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var response = JSON.parse(xhttp.responseText)
        switch (response["status"]) {
          case 1:
          // success
          // console.log("x");
          this.service.showMsg(this.lang["uploadsuccess"])
          this.service.userpet = response["data"]["userpet"]
          this.viewCtrl.dismiss()
          break;
          case 2:
          // edit success
          this.service.showMsg(this.lang["editsuccess"])            
          this.service.userpet = response["data"]["userpet"]
          this.viewCtrl.dismiss()
          break;
          case 3:
          // upload error
          this.service.showMsg(this.lang["uploaderror"])            
          break;
          default:
        }
      }
    };
    xhttp.open("POST", this.service.url + "&op=main&action=savepost&uid=" + this.service.uid + "&" + this.service.toparam(this.filter), true);
    xhttp.send(fd);
  }
}
@Component({
  template: `
    <ion-list>
      <ion-item color="primary">
        {{lang["orderdetail"]}}
      </ion-item>
      <ion-item>
        <b> {{lang["customer"]}} </b> {{data["name"]}}<p>
      </ion-item>
      <ion-item>
        <b> {{lang["phone"]}} </b> {{data["phone"]}}<p>
      </ion-item>
      <ion-item>
        <b> {{lang["address"]}} </b> {{data["address"]}}<p>
      </ion-item>
    </ion-list>
  `
})
export class OrderDetail {
  data: object = {
    name: "",
    phone: "",
    address: ""
  }
  constructor(public navParams: NavParams, public lang: LangProvider, public service: ServiceProvider) {
    var data = this.navParams.get("data")
    // console.log(data);
    if (data["vender"] && data["vender"]["name"]) {
      this.data = data["vender"]
    }
  }
}

@Component({
  template: `
    <ion-list>
      <div *ngFor="let vender of data">
        <ion-item color="primary" (click)="submitorder(vender['oid'])">
          {{lang["orderdetail"]}}
        </ion-item>
        <ion-item>
          <b> {{lang["customer"]}} </b> {{vender["name"]}}<p>
        </ion-item>
        <ion-item>
          <b> {{lang["phone"]}} </b> {{vender["phone"]}}<p>
        </ion-item>
        <ion-item>
          <b> {{lang["address"]}} </b> {{vender["address"]}}<p>
        </ion-item>
      </div>
    </ion-list>
  `
})
export class OrderDetailList {
  data: object[] = [{
    name: "",
    phone: "",
    address: ""
  }]
  pid: number = -1
  filter: object = {}
  constructor(public navParams: NavParams, public lang: LangProvider, public service: ServiceProvider,
    public http: HttpClient, public ev: Events, public viewCtrl: ViewController) {
    var data = this.navParams.get("data")
    this.filter = this.navParams.get("filter")
    this.pid = this.navParams.get("pid")
    // console.log(data);
    // console.log(this.filter);
    if (data["vender"] && data["vender"].length) {
      this.data = data["vender"]
    }
  }
  submitorder(oid) {
    this.service.fetch(this.service.url + "&action=submitorder&oid=" + oid + "&pid=" + this.pid + "&uid=" + this.service.uid + "&" + this.service.toparam(this.filter)).then(response => {
      // console.log(response);
          // success
          this.ev.publish("submitorder-finish", response["data"])
          this.viewCtrl.dismiss()
    })
  }
}

