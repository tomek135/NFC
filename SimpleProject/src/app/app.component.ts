﻿import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { AlertController} from 'ionic-angular';
import { Splashscreen} from 'ionic-native';
import { StatusBar} from '@ionic-native/status-bar';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
//import { Page3 } from '../pages/page3/page3';
import {TestProvider} from '../pages/testProvider/TestProvider';


@Component({
  templateUrl: 'app.html',
  providers: [NFC,Ndef,TestProvider,StatusBar]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;
  showedAlert: boolean;
  confirmAlert;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public testProvider: TestProvider, public alertCtrl: AlertController, public NFC: NFC,public ndef: Ndef,private statusBar: StatusBar) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Wyślij wiadomość', component: Page1 },
      { title: 'O aplikacji', component: Page2 }
     // { title: 'Szablony', component: Page3 }
    ];

    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#1976D2');
      this.statusBar.show();
      Splashscreen.hide();
      this.showedAlert = false;

      if(!this.NFC.enabled())
      {
        this.showConfirm();
      }
    


    //Confirm exit
    this.platform.registerBackButtonAction(()=> {
      if(this.nav.length() == 1){
        if(!this.showedAlert){
          this.confirmExitApp();
        } else {
          this.showedAlert = false;
          this.confirmAlert.dismiss();
        }
      }

        this.nav.pop();
      });
    });
  }


  confirmExitApp(){
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
      title: "Zamknąć apliakcję?",
      message: "Czy chcesz wyjść z aplikacji?",
      buttons: [
        {
            text: 'Nie',
            handler: () => {
                this.showedAlert = false;
                return;
            }
        },
        {
            text: 'Tak',
            handler: () => {
                this.platform.exitApp();
            }
        }
    ]

    });
    this.confirmAlert.present();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Twój telefon nie obsługuje NFC.',
      message: 'Aby korzystać z aplikacji konieczny jest moduł NFC w telefonie.',
      buttons: [
        {
          text: 'Zamknij',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,[TestProvider]);
  }
}
