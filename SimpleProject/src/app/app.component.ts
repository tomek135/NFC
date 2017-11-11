import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { AlertController} from 'ionic-angular';
import { StatusBar, Splashscreen,NFC,Ndef,Device} from 'ionic-native';
//import { StartPage } from '../pages/startPage/startPage';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { Page3 } from '../pages/page3/page3';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({name: 'safeHtml'})
export class Safe {
  constructor(private sanitizer:DomSanitizer){}

  transform(style) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
    //return this.sanitizer.bypassSecurityTrustHtml(html);
    // return this.sanitizer.bypassSecurityTrustScript(value);
    // return this.sanitizer.bypassSecurityTrustUrl(value);
    // return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;
  showedAlert: boolean;
  confirmAlert;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Wyślij wiadomość', component: Page1 },
      { title: 'O aplikacji', component: Page2 },
      { title: 'Szablony', component: Page3 }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      //StatusBar.overlaysWebView(true);
      StatusBar.backgroundColorByHexString('#1976D2');
      StatusBar.show();
      Splashscreen.hide();
      this.showedAlert = false;
    

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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
