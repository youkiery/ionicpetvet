import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DetailPage } from '../pages/detail/detail';
import { SalePage, Post, OrderDetail, OrderDetailList } from '../pages/sale/sale';
import { ProviderPage } from '../pages/provider/provider';
import { AboutPage } from '../pages/about/about';
import { SupportPage } from '../pages/support/support';

import { LangProvider } from '../providers/lang/lang';
import { ServiceProvider } from '../providers/service/service';
import { Base64 } from '@ionic-native/base64';

@NgModule({
  declarations: [
    MyApp,
    Post, OrderDetail, OrderDetailList,
    HomePage,
    // DetailPage, 
    // SalePage, 
    // ProviderPage,
    // AboutPage, SupportPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailPage,
    SalePage, Post, OrderDetail, OrderDetailList,
    ProviderPage,
    AboutPage, SupportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LangProvider,
    ServiceProvider,
    Camera,
    Base64
  ]
})
export class AppModule {}
