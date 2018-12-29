import { Component } from '@angular/core';
import { Platform, /*AlertController*/ } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { HomePage } from '../pages/home/home';
import { StartPage } from '../pages/start/start';

// import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = StartPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen/*, private localNotifications: LocalNotifications, private alert: AlertController*/) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // this.alert.create({
      //   message: "android: " + platform.is("android") + " | ios: " + platform.is("ios") + " | browser: " + platform.is("browser") + " | mobile: " + platform.is("mobile") + " | phablet: " + platform.is("phablet") + " | mobileweb: " + platform.is("mobileweb")
      // }).present()

      //   this.localNotifications.schedule({
      //     text: 'Delayed ILocalNotification',
      //     // sound: isAndroid ? 'file://sound.mp3': 'file://beep.caf',
      //     data: { secret: "key" },
      //     trigger: {at: new Date(new Date().getTime() + 3600)},
      //     led: 'FF0000',
      //  });
    });
  }
}

