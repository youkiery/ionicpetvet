import { Injectable } from '@angular/core';
import { ToastController, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

import { LangProvider } from '../lang/lang'

@Injectable()
export class ServiceProvider {
  baseurl: string = "http://localhost/"
  url: string = "http://localhost/index.php?nv=mobile"
  // baseurl: string = "https://petcoffee.com/"
  // url: string = "https://petcoffee.com/index.php?nv=mobile"
  signInfo: {
    username: string,
    password: string,
    vpassword: string,
    name: string,
    phone: string,
    address: string,
    area: number,
    role: number,
    sale: number,
    active: number
  } = {
    username: "",
    password: "",
    vpassword: "",
    name: "",
    phone: "",
    address: "",
    area: 0,
    role: 0,
    sale: 0,
    active: 0
  }
  user: {
    username: string,
    password: string,
    vpassword: string,
    name: string,
    phone: string,
    address: string,
    area: number,
    role: number,
    sale: number,
    active: number
  } = {
    username: "",
    password: "",
    vpassword: "",
    name: "",
    phone: "",
    address: "",
    area: 0,
    role: 0,
    sale: 0,
    active: 0
  }

  uid: number = 0
  name: string = ""
  phone: string = ""
  address: string = ""
  province: number = 0
  role: number = 0
  islogged: boolean = false
  loading: any
  isloading: boolean = false
  keyword: object[] = [{
    name: "poople",
    species: "2",
  }]
  // userpet: {
  //   name: string,
  //   price: string,
  //   describe: string,
  //   age: string,
  // }[] = []
  userpet: any = []
  newpet: any = []
  kind: any = []
  species: any = []
  config: any = []
  type: any = []
  sort: string[] = ["Mới nhất", "Cũ nhất", "Giá tăng dần", "Giá giảm dần"]
  function: object[] = [
    {key: "a", name: "Quản trị chung"},
    {key: "k", name: "Loài"},
    {key: "u", name: "Người dùng"},
  ]
  price: number[] = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]
  isconfig: boolean = false
  isconnect: boolean = true
  connectkey: string = "000000"
  prvfetch: any
  p: object = {
    use: false,
    sale: false,
    admin: false,
    p: false,
    kind: 0,
    user: 0,
    post: 0
  }
  // provides: string[] = ["An Giang","Bà Rịa Vũng Tàu","Bạc Liêu","Bắc Kạn","Bắc Giang","Bắc Ninh","Bến Tre","Bình Dương","Bình Định","Bình Phước","Bình Thuận","Cà Mau","Cao Bằng","Cần Thơ – Hậu Giang","TP. Đà Nẵng","ĐắkLắk – Đắc Nông","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","TP. Hà Nội","Hà Tĩnh","Hải Dương","TP. Hải Phòng","Hoà Bình","Hưng Yên","TP. Hồ Chí Minh","Khánh Hoà","Kiên Giang","Kon Tum","Lai Châu – Điện Biên","Lạng Sơn","Lao Cai","Lâm Đồng","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hoá","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"]
  // date: string[] = ["1 ngày", "2 ngày", "3 ngày", "4 ngày", "5 ngày", "6 ngày", "1 tuần", "2 tuần", "3 tuần", "1 tháng", "2 tháng", "3 tháng", "4 tháng", "5 tháng", "6 tháng", "7 tháng", "8 tháng", "9 tháng", "10 tháng", "11 tháng", "1 năm", "2 năm", "3 năm", "4 năm", "5 năm", "6 năm", "7 năm", "8 năm", "9 năm", "10 năm", "11 năm", "12 năm", "13 năm", "14 năm", "15 năm", "16 năm", "17 năm", "18 năm", "19 năm", "20 năm", "Nhiều hơn"]
  // vaccine: string[] = ["Chưa tiêm", "1 Mũi", "2 Mũi", "3 Mũi", "4 Mũi", "5 Mũi", "6 Mũi", "7 Mũi", "8 Mũi", "9 Mũi", "10 Mũi", "Nhiều hơn"]
  constructor(public toastCtrl: ToastController, public storage: Storage, public event: Events,
    public loadCtrl: LoadingController, public http: HttpClient, public lang: LangProvider) {

  }
  cancelconnect() {
    this.connectkey = this.rand()
  }
  rand() {
    var r = "abcdefghijklmnopqrstuvwxyz01234567890";
    var ra = r.split("");
    var rl = ra.length;
    var result = ""
    for (let i = 0; i < 6; i++) {
      var random = Math.floor(Math.random() * rl);
      result += ra[random]
    }
    return result
  }
  fetch(url: string) {
    // reject | 0: connection error, 1: server error, 2: ignore
    return new Promise((resolve, reject) => {
      this.loadstart()
      this.connectkey = this.rand()
      var storageKey = this.connectkey;
      setTimeout(() => {
        if (storageKey == this.connectkey) {
          this.showMsg(this.lang["slownet"])
        }
      }, 10000)
      setTimeout(() => {
        if (storageKey == this.connectkey) {
          this.loadend()
          this.rejecterror(reject, 0)
        }
      }, 30000)
      this.http.get(url + "&ck=" + this.connectkey).subscribe(response => {
        // console.log(this.isconnect);
        this.loadend()
        this.isconnect = true
        if (response["status"]) {
          
          if (response["data"]["key"] == this.connectkey) {
            this.connectkey = this.rand()
            resolve(response["data"])
          } else {
            this.rejecterror(reject, 2)
          }
        } else {
          this.rejecterror(reject, 1)
        }
      }, () => {        
        this.rejecterror(reject, 0)
      })
    })
  }
  rejecterror(reject, key) {
    // console.log(key);
    this.loadend()
    this.connectkey = this.rand()
    switch (key) {
      case 1:
        this.showMsg(this.lang["servererror"])
      break;
      case 2:
      break;
      default:
        // console.log(this.isconnect);
        this.isconnect = false
        this.showMsg(this.lang["interneterror"])
    }
    reject(key)
  }
  showMsg(msg) {
    if (msg) {
      this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: "bottom"
      }).present();
    }
  }
  getData(dataname) {
    return new Promise((resolve, reject) => {
      this.storage.get(dataname).then(gottenData => {
        if (gottenData) {
          resolve(gottenData);
        } else {
          reject();
        }
      })
    })
  }
  setData(dataname, data) {
    if (data) {
      this.storage.set(dataname, data)
    }
  }
  logged(logdata, navCtrl = null, redirect = true) {
    this.setData("login", logdata["uid"]);
    this.user = logdata
    this.setrole(logdata["role"], logdata["active"], logdata["sale"])

    this.islogged = true;
    if (navCtrl && redirect) navCtrl.pop();
  }
  setrole(role: string, active: number, sale: number) {
    if (active > 0) {
      this.p["use"] = true
    }
    if (sale > 0) {
      this.p["sale"] = true
    }
    
    var roles = role.split(",")
    if (roles.length) {
      roles.forEach((role_key: string) => {
        switch (role_key) {
          case "1":
            this.p["user"] = 1
          break;
          case "2":
            this.p["user"] = 2
          break;
          case "3":
            this.p["post"] = 1
          break;
          case "4":
            this.p["post"] = 2
          break;
          case "5":
            this.p["menu"] = 1
          break;
          case "6":
            this.p["menu"] = 2
          break;
          case "7":
            this.p["species"] = 1
          break;
          case "8":
            this.p["species"] = 2
          break;
          case "9":
            this.p["area"] = 1
          break;
          case "10":
            this.p["area"] = 2
          break;
          case "7":
            this.p["p"] = 1
          break;
        }
      });
      if (this.p["user"]) {
        this.p["admin"] = true
      } else if (this.p["post"]) {
        this.p["admin"] = true
      } else if (this.p["menu"]) {
        this.p["admin"] = true
      } else if (this.p["p"]) {
        this.p["admin"] = true
      } else if (this.p["area"]) {
        this.p["admin"] = true
      } else if (this.p["kind"]) {
        this.p["admin"] = true
      }
    }
    console.log(this.p);
    
  }
  logout() {
    this.storage.remove("login");
    this.islogged = false
    this.uid = 0
    this.name = ""
    this.phone = ""
    this.address = ""
  }
  validphone(phone: string) {
    var length = phone.length
    var nphone = Number(phone)
    if (!(length < 4 || length > 12 || isNaN(nphone))) {
      return false
    }
    return true;
  }
  
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
  }
  loadstart() {
    if (!this.isloading) {
      if (!this.isconfig) {
        this.loading = this.loadCtrl.create({
          content: "Vui lòng chờ",
        })
      }
      else {
        this.loading = this.loadCtrl.create({
          content: "Vui lòng chờ",
          enableBackdropDismiss: true
        })
      }
      // setInterval(() => {
      //   this.loadend()
      // }, 30000)
      this.loading.onDidDismiss(() => {
        this.cancelconnect()
      })
      this.loading.present()
      this.isloading = true;
    }
  }
  loadend() {
    if (this.isloading) {
      this.isloading = false;
      this.loading.dismiss()
    }
  }
  toparam(obj) {
    var result = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.push(key + "=" + obj[key]);
      }
    }
    return result.length ? result.join("&") : ""
  }
}
