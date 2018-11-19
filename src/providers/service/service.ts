import { Injectable } from '@angular/core';
import { ToastController, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class ServiceProvider {
  baseurl: string = "http://localhost/"
  url: string = "http://localhost/roll.php"
  uid: string = ""
  name: string = ""
  phone: string = ""
  address: string = ""
  islogged: boolean = false
  loading: any
  isloading: boolean = false
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
  sort: string[] = ["Mới nhất", "Cũ nhất", "Giá tăng dần", "Giá giảm dần"]
  price: number[] = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]
  // provides: string[] = ["An Giang","Bà Rịa Vũng Tàu","Bạc Liêu","Bắc Kạn","Bắc Giang","Bắc Ninh","Bến Tre","Bình Dương","Bình Định","Bình Phước","Bình Thuận","Cà Mau","Cao Bằng","Cần Thơ – Hậu Giang","TP. Đà Nẵng","ĐắkLắk – Đắc Nông","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hà Nam","TP. Hà Nội","Hà Tĩnh","Hải Dương","TP. Hải Phòng","Hoà Bình","Hưng Yên","TP. Hồ Chí Minh","Khánh Hoà","Kiên Giang","Kon Tum","Lai Châu – Điện Biên","Lạng Sơn","Lao Cai","Lâm Đồng","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Bình","Thái Nguyên","Thanh Hoá","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"]
  // date: string[] = ["1 ngày", "2 ngày", "3 ngày", "4 ngày", "5 ngày", "6 ngày", "1 tuần", "2 tuần", "3 tuần", "1 tháng", "2 tháng", "3 tháng", "4 tháng", "5 tháng", "6 tháng", "7 tháng", "8 tháng", "9 tháng", "10 tháng", "11 tháng", "1 năm", "2 năm", "3 năm", "4 năm", "5 năm", "6 năm", "7 năm", "8 năm", "9 năm", "10 năm", "11 năm", "12 năm", "13 năm", "14 năm", "15 năm", "16 năm", "17 năm", "18 năm", "19 năm", "20 năm", "Nhiều hơn"]
  // vaccine: string[] = ["Chưa tiêm", "1 Mũi", "2 Mũi", "3 Mũi", "4 Mũi", "5 Mũi", "6 Mũi", "7 Mũi", "8 Mũi", "9 Mũi", "10 Mũi", "Nhiều hơn"]
  constructor(public toastCtrl: ToastController, public storage: Storage, public event: Events,
    public loadCtrl: LoadingController) {
  }
  showMsg(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: "top"
    }).present();
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
    this.uid = logdata["uid"];
    this.name = logdata["name"];
    this.phone = logdata["phone"];
    this.address = logdata["address"];
    
    this.islogged = true;
    if (navCtrl && redirect) navCtrl.pop();
  }
  logout() {
    this.storage.remove("login");
    this.islogged = false
    this.uid = null
    this.name = ""
    this.phone = ""
    this.address = ""
  }
  loadstart() {
    if (!this.isloading) {
      this.loading = this.loadCtrl.create({
        content: "Vui lòng chờ",
        duration: 5000,
      })
      setTimeout(() => {
        this.loadend()
      }, 3000);
      this.loading.present()
      this.isloading = true;
    }
  }
  loadend() {
    if (this.isloading) {
      this.loading.dismiss()
      this.isloading = false;
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
