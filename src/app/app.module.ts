import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DetailPage, Order } from '../pages/detail/detail';
import { UserPage } from '../pages/user/user';
import { SalePage, Post, OrderDetail, OrderDetailList } from '../pages/sale/sale';
import { InboxPage } from '../pages/inbox/inbox';
import { ProviderPage } from '../pages/provider/provider';

import { LangProvider } from '../providers/lang/lang';
import { ServiceProvider } from '../providers/service/service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Order,
    Post, OrderDetail, OrderDetailList,
    DetailPage, 
    UserPage,
    SalePage, 
    InboxPage,
    ProviderPage
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
    DetailPage, Order,
    UserPage,
    SalePage, Post, OrderDetail, OrderDetailList,
    InboxPage,
    ProviderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LangProvider,
    ServiceProvider
  ]
})
export class AppModule {}
