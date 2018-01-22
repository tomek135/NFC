import { Component } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Http} from '@angular/http';
import { Headers } from '@angular/http';
import { Deeplinks } from '@ionic-native/deeplinks';
import { AlertController, NavController } from 'ionic-angular';
import { map } from 'rxjs/operator/map';
import { timeout} from 'rxjs/operator/timeout';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Page3 } from '../page3/page3';
import { TestProvider} from '../testProvider/TestProvider';

@Component({
    selector: 'page-page1',
    templateUrl: 'page1.html',
    providers: [NFC,Ndef]
})

export class Page1 {

    isNFCActive: boolean;
    public NFCInfo: string;
    public tagID: number[];
    public tagIDAfterEncode: number;
    public decodeTag: number;
    public temp: string;
    public keySplit: any;
    isAlert: boolean = false;
    public receivedLink: string;
    
    constructor( 
        public deeplinks: Deeplinks,
        public alertCtrl: AlertController,
        public navCtrl: NavController, 
        private NFC: NFC, 
        private ndef: Ndef, 
        public http: Http , 
        public testProvider: TestProvider) { 
        
            this.deeplinks.route({
              '/': {}
            }).subscribe((match)=>{
            let receivedData = {
                key : match.$args.key,
                groupId: match.$args.groupId,
                link: match.$link.queryString,
            }
            this.testProvider.key= receivedData.key;
            this.testProvider.groupId = receivedData.groupId;
            this.receivedLink = receivedData.link;

            var keyLength = this.testProvider.key.length;//długość znaków klucza
            switch(keyLength%4)
            {
                case 0: break;
                case 2:
                {
                    this.testProvider.key = this.testProvider.key+"==";
                    break;
                }
                case 3:
                {
                    this.testProvider.key = this.testProvider.key+"=";
                    break;
                }
            }
            alert("Autoryzacja poprawna! \nNazwa Grupy: "+ this.testProvider.groupId);
            },(noMatch)=>{
            console.log("Wystąpił problem "+JSON.stringify(noMatch));
            })
            this.listenNFC();
        }

    selectTemplate(){
        this.navCtrl.push(Page3);
    }


    listenNFC(){
        //Funkcja wywolująca sie gdy przyłożymy tag do telefonu
        this.NFC.addNdefListener(() => {
            console.log("Nasłuchiwanie znaczników zostało włączone");
            this.isNFCActive = true;
           }, (err) => {
             console.log("Brak włączonego NFC!");
             this.showConfirm();
           }).subscribe((event) => {
            //wydarzenia nastepujące po prawidłowym odczycie tagu
             this.tagID = event.tag.id; // ID tagu
             this.decodeTag = parseInt(this.NFC.bytesToHexString(event.tag.id),16);  //ID tagu zapisane w hex
             this.temp = atob(this.testProvider.key);//dekodowanie klucza
             this.keySplit = this.temp.split(":");
             this.tagIDAfterEncode = this.keySplit[0];
             
             //if(this.decodeTag == this.tagIDAfterEncode)//MDQwYWMyNmEzYjJiODE6MDQwYWMyNmEzYjJiODE=
            // {*/
                let headers = new Headers();
                headers.append('Authorization','Basic '+ this.testProvider.key);// MTIzNDU2OjEyMzQ1Ng==
                headers.append('Content-Type', 'application/json');

                let dataToSend ={
                    groupId: this.testProvider.groupId,
                    content: this.getContent(this.testProvider.message)
                };

                if(!this.isAlert)//zeby nie wysyłać wiadomosci kiedy jest wyswietlone powiadomienie
                {
                 //this.http.post('http://'+this.testProvider.adresServera+':'+this.testProvider.port,JSON.stringify(dataToSend), {headers: headers})
                 //this.http.put('https://'+this.testProvider.adresServera+':'+this.testProvider.port+'/general',JSON.stringify(dataToSend),{headers:headers})
                 this.http.put('https://nefico.tele.pw.edu.pl:8080/general',JSON.stringify(dataToSend),{headers:headers})
                 .timeout(1000)
                 .map(res => res.text())
                 .subscribe(data => {
                        this.showAlert('Powiadomienie','Wiadomość została wysłana');
                    }, (err)=>{
                        this.showAlert('Nie udało się wysłać wiadomości!',err);
                    });
                }
             //}
            // else
            // {
             //   this.showAlert('Brak uprawnień!','Nie masz wystarczających uprawnień aby wysłać wiadomość.');
           // }
           });
    }

    getContent(myContent: string){
        return "<div class=\"mdl-demo mdl-color--grey-100 mdl-color-text--grey-700 mdl-base\"><div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\"><header class=\"mdl-layout__header mdl-layout__header--scroll mdl-color--primary\"><div class=\"mdl-layout--large-screen-only mdl-layout__header-row\">"
        +"</div><div class=\"mdl-layout--large-screen-only mdl-layout__header-row\"><h3>Nefico - Wiadomości</h3>"
        +"</div><div class=\"mdl-layout--large-screen-only mdl-layout__header-row\">"
        +"</div><div class=\"mdl-layout__tab-bar mdl-js-ripple-effect mdl-color--primary-dark\">"
        +"<a href=\"#overview\" class=\"mdl-layout__tab is-active\">Wiadomość</a></div></header>"
        +"<main class=\"mdl-layout__content\"><div class=\"mdl-layout__tab-panel is-active\" id=\"overview\">"
        +"<section class=\"section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp\">"
        +"<div class=\"mdl-card mdl-cell mdl-cell--12-col\"><div class=\"mdl-card__supporting-text\"><h4>Wiadomość</h4><h5>"
        +myContent+"</h5></div></div></section></div><footer class = \"mdl-mini-footer mdl-color--primary\">"
        +"<div class = \"mdl-mini-footer__left-section\"><ul class = \"mdl-mini-footer__link-list\">"
        +"<li><a href=\"https://secure.tele.pw.edu.pl/\" class=\"mdl-layout__tab mdl-color-text--grey-100 mdl-base\">Instytut Telekomunikacji PW</a></li>"
        +"</ul></div></footer></main></div><script defer src=\"https://code.getmdl.io/1.3.0/material.min.js\"></script></div>"
    }


    showConfirm() {
        let confirm = this.alertCtrl.create({
          title: 'NFC nie jest włączone.',
          message: 'Aby korzystać z aplikacji konieczne jest włączenie NFC w telefonie. Czy chcesz włączyć?',
          buttons: [
            {
              text: 'Zamknij',
              handler: () => {
              }
            },
            {
              text: 'Włącz',
              handler: () => {
                this.NFC.showSettings();
              }
            }
          ]
        });
        confirm.present();
      }

      showAlert(title: string, subTitle: string) {
        if(!this.isAlert){
            let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: [{
                text: 'OK',
                handler: () =>{
                    this.isAlert = false;
                    }
                }]
            });
            alert.present().then(()=>{
            this.isAlert=true;
            });
        }
    }
}