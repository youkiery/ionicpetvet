import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController,  Events } from 'ionic-angular';
import { LangProvider } from '../../providers/lang/lang';
import { ServiceProvider } from '../../providers/service/service';
import { HttpClient } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from '@angular/platform-browser';

import { ProviderPage } from '../provider/provider'



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
  clickIndex: number = 0;
  new: object = {
    1: 0,
    6: 0,
    7: 0
  }
  page: number = 1;
  isnext: boolean = false
  interval: any
  refreshkey: string = ""
  constructor(public modalCtrl: ModalController, public service: ServiceProvider, public http: HttpClient,
    public lang: LangProvider, public alert: AlertController, public navCtrl: NavController,
    public navParam: NavParams, public ev: Events) {
      // console.log(this.new);
      this.service.userpet = Array.apply(null, Array(12)).map(() => {
        return {
          image: ["../assets/imgs/noimage.png"],
          name: this.lang.loading,
          owner: this.lang.loading,
          price: this.lang.loading,
          province: this.lang.loading,
          timer: this.lang.loading,
          type: this.lang.loading,
        }
      })
        
      var type = this.navParam.get("type")
      if (type) {
        this.setActive(type.value)
      }
      else {
        this.filterall()  
      }

      this.ev.subscribe("submitorder-finish", (data) => {
        this.service.userpet = data["userpet"]
        this.next = data["next"]
      })
      // setInterval(() => {
      //   console.log(this.service.userpet);
      // }, 3000)
    
  }

  ionViewWillLeave() {
    clearInterval(this.interval)
  }
  ionViewDidEnter() {
    this.interval = setInterval(() => {
      // console.log(this.service.uid);
      this.getnewsalenotices()
    }, 5000);
}

reconnect() {
  this.filterall();
}

  getnewsalenotices() {
    if (!this.refreshkey) {
      this.refreshkey = this.service.rand()
      this.http.get(this.service.url + "&action=getnewsalenotices&uid=" + this.service.uid + "&ck=" + this.refreshkey).subscribe(response => {
        if (response["status"]) {
          this.new = response["data"]["new"]
        }
        setTimeout(() => {
          this.refreshkey = ""
        }, 3000);
      })
    }
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
    this.filter["type"] = index
    this.filterall()
  } 

  filterall() {
    this.page = 1;
    this.service.fetch(this.service.url + "&action=salefilter&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.filter)).then(response => {
      this.activebar[this.actindex] = 0
      this.prvindex = this.actindex
      this.actindex = this.filter["type"]
      this.activebar[this.actindex] = 1
      this.service.userpet = response["userpet"]
      this.isnext = response["next"]
      this.new[response["newtype"]] = response["new"]
      this.type = this.filter["type"]
    }, (e) => {})
  }

  next() {
    this.service.fetch(this.service.url + "&action=salefilter&uid=" + this.service.uid + "&page=" + (this.page + 1) + "&" + this.service.toparam(this.filter)).then(response => {
      // console.log(response);
      this.service.userpet = response["userpet"]
      this.isnext = response["next"]
      this.new[response["newtype"]] = response["new"]
      this.type = this.filter["type"]
    }, (e) => {})
  }

  venderdetail(provider) {
    this.navCtrl.push(ProviderPage, {provider: provider})
  }

  disorder(id) {
    this.clickIndex = 1;
    var alert = this.alert.create({
      title: this.lang["notice"],
      message: this.lang["removequest"],
      buttons: [
        {
          text: this.lang["remove"],
          handler: () => {
            this.service.fetch(this.service.url + "&action=disorder&id=" + id + "&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.filter)).then(response => {
              this.service.userpet = response["userpet"]
            }, (e) => {})
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
    if (!this.clickIndex) {
      this.service.fetch(this.service.url + "&action=getvender&oid=" + oid).then(response => {
      // console.log(response);
        this.modalCtrl.create(OrderDetail, {data: response}).present()
      }, (e) => {})
    }
    else {
      this.clickIndex = 0
    }
  }

  post() {
    let x = this.modalCtrl.create(Post, {filter: this.filter, page: this.page});
    x.present()
  }

  edit(id, name, timer, price, description, kind, species, type, age, vaccine, image) {
    if (!this.clickIndex) {
      let x = this.modalCtrl.create(Post, {data: {id: id, name: name, timer: timer, price: price, description: description, kind: kind, species: species, type: type, age: age, vaccine: vaccine, image: image}, filter: this.filter});
      x.present()
    }
    else {
      this.clickIndex = 0
    }
  }

  remove(id) {
    this.clickIndex = 1;
    let alert = this.alert.create({
      title: this.lang["removequest"],
      buttons: [
        {
          text: this.lang["cancel"]
        },
        {
          text: this.lang["remove"],
          handler: () => {
            this.service.fetch(this.service.url + "&action=removepost&pid=" + id + "&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.filter)).then(response => {
                  this.service.showMsg(this.lang["removesuccess"])
                  this.service.userpet = response["userpet"]
            }, (e) => {})
          }
        }
      ]
    })
    alert.present()
  }

  orderdetail(pid) {
    this.service.fetch(this.service.url + "&action=getorderlist&pid=" + pid).then(response => {
      // console.log(response);
        let modal = this.modalCtrl.create(OrderDetailList, {data: response, filter: this.filter, pid: pid, page: this.page})
        modal.present()
    }, (e) => {})
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
        <ion-select [(ngModel)]="post.type" name="type">
          <ion-option *ngFor="let option of service.type; let i = index" value="{{i}}">{{option}}</ion-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label> {{lang.price}} </ion-label>
        <ion-input type="text" id="price" [(ngModel)]="this.post.price" name="price" placeholder="{{lang.unit}}" (ionChange)="formatprice($event)" ></ion-input>
      </ion-item>
      <ion-textarea [(ngModel)]="this.post.description" name="description" class="description" placeholder="{{lang.description}}"></ion-textarea>
      <div class="sale_right">
        <ion-icon name="camera" (click)="takephoto()" class="camera"></ion-icon>
        <div class="upload-btn-wrapper">
          <ion-label class="upload-btn">{{lang.upload}}</ion-label>
          <input class=" upload-input" type="file" [(ngModel)]="post.files" id="files" name="files" multiple (change)="change()" >
        </div>
        <span *ngFor="let image of post.image">
          <img class="thumb" src="{{image}}">
        </span>
      </div>
      <button ion-button color="secondary" type="submit" class="button-half"> {{lang.post}} </button>
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
  page: number = 1
  files: any[]
  changing: boolean = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public lang: LangProvider,
    public service: ServiceProvider, public http: HttpClient, public viewCtrl: ViewController,
    public camera: Camera, private base64: Base64, private sanitizer: DomSanitizer) {
    // console.log(this.service.species);
    var now = new Date();
    var data = this.navParams.get("data")
    this.page = this.navParams.get("page")
    this.filter = this.navParams.get("filter")
    // console.log(data);
    // console.log(this.filter);
    
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
      this.post.type = 0
      this.post.age = 0
      this.post.price = 0
      this.post.image = ["assets/imgs/noimage.png"]
    }
    this.post.price = this.format(this.post.price)
  }

  takephoto() {
    let options = {
      quality: 95,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      // console.log(imageData);
      this.base64.encodeFile(imageData).then((base64File: string) => {
        let blob = new Blob([base64File], {type: "image/jpeg"});
        this.files = [blob]
        this.post.image = [this.sanitizer.bypassSecurityTrustUrl(base64File)]
        // console.log(base64File);
      }, (err) => {
        // console.log(err);
      });
    }, (err) => {
      this.service.showMsg(this.lang.nocam)
    });
  }

  formatprice(e) {
    if (!this.changing) {
      var x = document.getElementById("price");
      var child = x.children[0] as HTMLInputElement;
      var y = Number(child["selectionStart"]);
      // console.log(y);
      
      var z = this.parse(child["value"])
      if (Number(z)) {
        var d1 = (this.post.price.split(".")).length - 1
        this.post.price = this.format(z)
        this.changing = true
        var d2 = (this.post.price.split(".")).length - 1
          y += (d2 - d1);
          // console.log(d2, d1, y);
          setTimeout(() => {
            child.setSelectionRange(y, y)
          }, 10);
      }
    }
    else {
      this.changing = false
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
    var maxWidth = 640;
    var maxHeight = 480;
    this.post.image = []
    if (input["files"] && input["files"][0]) {
      var length = input["files"].length;
      for (var i = 0; i < length; i ++) {
        var reader = new FileReader();
        reader.readAsDataURL(input["files"][i]);  

        reader.onload = (e) => {
          var image = new Image();
          image.src = e.target["result"];
          image.onload = (e2) => {
            var c = document.createElement("canvas")
            var ctx = c.getContext("2d");
                
            var ratio = 1;

            if(image.width > maxWidth)
              ratio = maxWidth / image.width;
            else if(image.height > maxHeight)
              ratio = maxHeight / image.height;

            c.width = image["width"];
            c.height = image["height"];
            ctx.drawImage(image, 0, 0);

            var cc = document.createElement("canvas")
            var cctx = cc.getContext("2d");
            cc.width = image.width * ratio;
            cc.height = image.height * ratio;

            cctx.fillStyle = "#fff";
            cctx.fillRect(0, 0, cc.width, cc.height);
            cctx.drawImage(c, 0, 0, c.width, c.height, 0, 0, cc.width, cc.height);

            this.post.image.push(cc.toDataURL("image/jpg"))
          };
        };
      }
    }
  }

  savepost() {
    if (!this.post.name) {
      this.service.showMsg(this.lang["emptytitle"])
    }
    else {
      this.service.loadstart()
      if (!this.files) {
        var files = document.getElementById("files");
        this.files = files["files"];
      }
      
      var fd = new FormData();
      var check = true;
      var length = 0;
      while (check) {
        if (this.files && this.files[length]) {
          fd.append("file[" + length + "]", this.files[length]);
          length ++;
        } else check = false;
      }
      fd.append("uid", String(this.service.uid));
      fd.append("ck", this.service.rand());
      fd.append("name", this.post.name);
      fd.append("age", this.post.age);
      fd.append("price", this.parse(this.post.price));
      fd.append("description", this.post.description);
      fd.append("species", this.post.species);
      fd.append("kind", this.post.kind);
      fd.append("vaccine", this.post.vaccine);
      fd.append("typeid", this.post.type);
      fd.append("id", this.post.id);
      fd.append("sort", this.post.vaccine);
      fd.append("type", this.post.type);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          var response = JSON.parse(xhttp.responseText)
          this.service.loadend()
          switch (response["data"]["status"]) {
            case 1:
            // success
            // console.log("x");
              this.service.showMsg(this.lang["uploadsuccess"])
              this.service.userpet = response["data"]["userpet"]
              this.viewCtrl.dismiss()
              break;
            case 2:
            // edit success
              this.files = null
              this.service.showMsg(this.lang["editsuccess"])            
              this.service.userpet = response["data"]["userpet"]
              this.viewCtrl.dismiss()
              break;
            case 3:
            // upload error
              this.service.showMsg(this.lang["uploaderror"])            
            break;
            default:
              this.service.showMsg(this.lang["undefined"])            
          }
        }
      };
      xhttp.open("POST", this.service.url + "&op=main&action=savepost&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.filter), true);
      xhttp.send(fd);
    }
  }
}
@Component({
  template: `
    <ion-list>
      <ion-item color="primary">
        {{lang["orderdetail"]}}
      </ion-item>
      <ion-item>
        <b> {{lang["customer"]}} </b>
        <span class="right">
          {{vender["name"]}}
        </span>
      </ion-item>
      <ion-item>
        <b> {{lang["phone"]}} </b>
        <span class="right">
          {{vender["phone"]}}
        </span>
      </ion-item>
      <ion-item>
        <b> {{lang["address"]}} </b>
        <span class="right">
          {{vender["address"]}}
        </span>
      </ion-item>
    </ion-list>
  `
})
export class OrderDetail {
  vender: object = {
    name: "",
    phone: "",
    address: ""
  }
  constructor(public navParams: NavParams, public lang: LangProvider, public service: ServiceProvider) {
    var data = this.navParams.get("data")
    // console.log(data);
    if (data["vender"] && data["vender"]["name"]) {
      this.vender = data["vender"]
    }
  }
}

@Component({
  template: `
    <ion-list>
      <div *ngFor="let vender of data">
        <ion-item color="primary">
          {{lang["orderdetail"]}}
          <ion-icon name="cart"  (click)="submitorder(vender['oid'])" class="right"></ion-icon>
        </ion-item>
        <ion-item>
          <b> {{lang["customer"]}} </b>
          <span class="right">
            {{vender["name"]}}
          </span>
        </ion-item>
        <ion-item>
          <b> {{lang["phone"]}} </b>
          <span class="right">
            {{vender["phone"]}}
          </span>
        </ion-item>
        <ion-item>
          <b> {{lang["address"]}} </b>
          <span class="right">
            {{vender["address"]}}
          </span>
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
  page: number
  constructor(public navParams: NavParams, public lang: LangProvider, public service: ServiceProvider,
    public http: HttpClient, public ev: Events, public viewCtrl: ViewController) {
    var data = this.navParams.get("data")
    this.filter = this.navParams.get("filter")
    this.pid = this.navParams.get("pid")
    this.page = this.navParams.get("page")
    // console.log(data);
    // console.log(this.filter);
    if (data["vender"] && data["vender"].length) {
      this.data = data["vender"]
    }
  }
  submitorder(oid) {
    this.service.fetch(this.service.url + "&action=submitorder&oid=" + oid + "&pid=" + this.pid + "&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.filter)).then(response => {
      // console.log(response);
          // success
          this.ev.publish("submitorder-finish", response)
          this.viewCtrl.dismiss()
    }, (e) => {})
  }
}

