import { NgModule, ErrorHandler, Component } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { BrowserModule } from '@angular/platform-browser';
import { Device } from '@ionic-native/device';
import { HttpModule} from '@angular/http';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Headers } from '@angular/http';
import { MyApp } from './app.component';
import { StatusBar} from 'ionic-native';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { Page3 } from '../pages/page3/page3';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    Page3
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      menuType: 'overlay',
      platforms: {
        ios: {
          menuType: 'reveal',
        }
      }
    })
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    Page3
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},StatusBar,Deeplinks]
})
export class AppModule {}
