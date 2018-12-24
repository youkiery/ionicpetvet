import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private localNotifications: LocalNotifications) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.localNotifications.schedule({
        text: 'Delayed ILocalNotification',
        // sound: isAndroid ? 'file://sound.mp3': 'file://beep.caf',
        data: { secret: "key" },
        trigger: {at: new Date(new Date().getTime() + 3600)},
        led: 'FF0000',
     });
    });
  }
}

