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
    type: 0,
    sold: 1
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
        if (data["next"]) {
          this.isnext = data["next"]
        }
        else {
          this.page --
        }
      })
      this.ev.subscribe("save-post", (data) => {
        console.log(data);
        this.service.userpet = data["userpet"]
        if (data["next"]) {
          this.isnext = data["next"]
        }
        else {
          this.page --
        }
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
  mating() {
    this.setActive(3)
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
    console.log(this.filter);
    if (this.filter["sold"]) {
      this.filter["sold"] = 1
    }
    else {
      this.filter["sold"] = 0
    }
    
    this.service.fetch(this.service.url + "&action=salefilter&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.filter)).then(response => {
      this.activebar[this.actindex] = 0
      this.prvindex = this.actindex
      this.actindex = this.filter["type"]
      this.activebar[this.actindex] = 1
      this.service.userpet = response["userpet"]
      this.isnext = response["next"]
      this.new[response["newtype"]] = response["new"]
      this.type = this.filter["type"]
    }, (e) => { })
  }

  next() {
    this.service.fetch(this.service.url + "&action=salefilter&uid=" + this.service.uid + "&page=" + (this.page + 1) + "&" + this.service.toparam(this.filter)).then(response => {
      // console.log(response);
      this.service.userpet = response["userpet"]
      this.isnext = response["next"]
      this.new[response["newtype"]] = response["new"]
      this.type = this.filter["type"]
      this.page ++
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
      this.service.fetch(this.service.url + "&action=getpostid&oid=" + oid).then(response => {
        this.modalCtrl.create(OrderDetail, {data: response["order"]["pid"]}).present()
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

  edit(id, name, timer, price, description, kind, species, type, age, vaccine, image, sold) {
    console.log(id, name, timer, price, description, kind, species, type, age, vaccine, image, sold);
    
    if (sold > 0) {
      console.log(id);
      
      this.modalCtrl.create(OrderDetail, {data: id}).present()
    }
    else {
      if (!this.clickIndex) {
        let x = this.modalCtrl.create(Post, {data: {id: id, name: name, timer: timer, price: price, description: description, kind: kind, species: species, type: type, age: age, vaccine: vaccine, image: image}, filter: this.filter});
        x.present()
      }
      else {
        this.clickIndex = 0
      }
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
                  if (response["next"]) {
                    this.isnext = response["next"]
                  }
                  else {
                    this.page --
                  }
            }, (e) => {})
          }
        }
      ]
    })
    alert.present()
  }

  submitmate(oid) {
    this.alert.create({
      title: this.lang["submitquest"],
      buttons: [
        {
          text: this.lang["cancel"]
        },
        {
          text: this.lang["submit"],
          handler: () => {
            this.service.fetch(this.service.url + "&action=submitmate&oid=" + oid + "&page=" + this.page + "&uid=" + this.service.uid + "&" + this.service.toparam(this.filter)).then(response => {
              this.service.userpet = response["userpet"]
            }, (e) => {})
          }
        }
      ]
    }).present()
  }

  orderdetail(pid) {
  }

}

@Component({
  template: `
  <ion-icon class="close" name="close" (click)="close()"></ion-icon>
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
        <div class="image_add_box">
          <ion-icon name="camera" (click)="takephoto()" class="image_camera"></ion-icon>
        </div>
        <div class="image_add_box">
          <span class="image_add"> + </span>
          <input class="upload-input" style="width: 120px; height: 120px;" type="file" [(ngModel)]="post.files" id="files" name="files" multiple (change)="change()" >
        </div>
        <span *ngFor="let image of post.image; let i = index">
          <div class="thumb_wrap">
            <img src="{{image}}">
            <ion-icon style="position: absolute; top: 4px; right: 4px; " name="close" (click)="remove(i)"></ion-icon>
          </div>
        </span>
        <span *ngIf="!post.image.length">
          <div class="thumb_wrap">
            <img src="assets/imgs/noimage.png">
          </div>
        </span>
      </div>
      <div style="clear: both;"></div>
      <button ion-button color="secondary" type="submit"> {{lang.post}} </button>
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
    public camera: Camera, private base64: Base64, private sanitizer: DomSanitizer, private event: Events) {
    // console.log(this.service.species);
    var now = new Date();
    var data = this.navParams.get("data")
    this.page = this.navParams.get("page")
    this.filter = this.navParams.get("filter")
    console.log(this.page);
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
      this.post.image = []
    }
    this.post.price = this.format(this.post.price)
  }

  close() {
    this.viewCtrl.dismiss()
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
      
      var z = this.parse(child["value"])
      var ck = Number.isInteger(Number(z))
      if (ck) {
        console.log(this.post.price);
        var d1 = (this.post.price.split(".")).length - 1
        this.realprice = d1;
        this.post.price = this.format(z)
        this.changing = true
        var d2 = (this.post.price.split(".")).length - 1
          y += (d2 - d1);
          setTimeout(() => {
            child.setSelectionRange(y, y)
          }, 10);
      }
      else {
        this.post.price = this.realprice
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

  remove(index: number) {
    this.post.image = this.post.image.filter((image: object, i: number) => { return i !== index})
  }

  change() {
    var input = document.getElementById("files")
    var maxWidth = 640;
    var maxHeight = 480;
    if (input["files"] && input["files"][0]) {
      var length = input["files"].length;
      for (var i = 0; i < length; i ++) {
        var reader = new FileReader();
        reader.readAsDataURL(input["files"][i]);  

        reader.onload = (e) => {
          var type = e.target["result"].split('/')[1].split(";")[0];
          console.log(type);
          if (["jpeg", "jpg", "png", "bmp", "gif"].indexOf(type) >= 0) {
            var image = new Image();
            image.src = e.target["result"];
            image.onload = (e2) => {
              // kiểm tra định dạng hình ảnh, img, png, bmp
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
              var base64Image = cc.toDataURL("image/jpeg");
              this.post.image.push(base64Image)
            };
          }
          else {
            this.service.showMsg(this.lang["noformat"])
          }
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
      var fd = new FormData();
      var check = true;
      var length = 0;
      while (check) {
        if (this.post.image && this.post.image[length]) {
          fd.append("image[" + length + "]", this.post.image[length]);
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
      fd.append("keyword", this.filter["keyword"]);
      fd.append("sort", this.filter["sort"]);
      fd.append("type", this.filter["type"]);
      var page = "1"

      if (isFinite(this.page)) {
        page = this.page.toString();
      }
      fd.append("page", page);
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
              this.event.publish("save-post", response["data"])
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
      xhttp.open("POST", this.service.url + "&op=main&action=savepost&uid=" + this.service.uid + "&page=" + page + "&" + this.service.toparam(this.filter), true);
      xhttp.send(fd);
    }
  }
}
@Component({
  template: `
    <ion-icon class="close" name="close" (click)="close()"></ion-icon>
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
  vender: object = {}
  constructor(public navParams: NavParams, public lang: LangProvider, public service: ServiceProvider,
    private viewCtrl: ViewController) {
    var data = this.navParams.get("data")
    this.service.fetch(this.service.url + "&action=getvenderinfo&id=" + data).then(response => {
      this.vender = response["info"]
    }, (e) => {})
  }
  close() {
    this.viewCtrl.dismiss()
  }
}

@Component({
  template: `
    <ion-icon class="close" name="close" (click)="close()"></ion-icon>
    <ion-list>
      <div *ngFor="let vender of data">
        <ion-item color="primary">
          {{lang["orderdetail"]}}
          <ion-icon *ngIf="vender.status == 0" class="cart" name="cart" (click)="submitorder(vender['oid'])"></ion-icon>
          <span *ngIf="vender.status > 0">{{lang["done"]}}</span>
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
    console.log(data);
    // console.log(this.filter);
    if (data["vender"] && data["vender"].length) {
      this.data = data["vender"]
    }
  }
  close() {
    this.viewCtrl.dismiss()
  }
  submitorder(oid) {
    this.service.fetch(this.service.url + "&action=submitorder&oid=" + oid + "&pid=" + this.pid + "&uid=" + this.service.uid + "&page=" + this.page + "&" + this.service.toparam(this.filter)).then(response => {
      switch (response["status"]) {
        case 1:
        this.ev.publish("submitorder-finish", response)
        this.viewCtrl.dismiss()
        break;
        case 2:
        this.data = response["list"]
        break;
      }
    }, (e) => {})
  }
}

