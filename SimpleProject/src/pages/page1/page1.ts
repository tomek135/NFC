import { Component } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Http} from '@angular/http';
import { Headers } from '@angular/http';
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
    public tagID: string;
    public decodeTag: string;
    public temp: string;
    isAlert: boolean = false;
    
    constructor(public alertCtrl: AlertController,public navCtrl: NavController, private NFC: NFC, private ndef: Ndef, public http: Http , public testProvider: TestProvider) { 
        this.listenNFC();
    }

    selectTemplate(){
        this.navCtrl.push(Page3);
    }

    listenNFC(){
        //Funkcja wywolująca sie gdy przyłożymy tag do telefonu
        this.testProvider.onInit =true;
        this.NFC.addNdefListener(() => {
            console.log("Nasłuchiwanie znaczników zostało włączone");
            this.isNFCActive = true;
           }, (err) => {
             console.log("Brak włączonego NFC!");
             this.showConfirm();
           }).subscribe((event) => {
            //wydarzenia nastepujące po prawidłowym odczycie tagu
             this.tagID = event.tag.id; // ID tagu
             this.decodeTag = this.NFC.bytesToHexString(event.tag.id); //ID tagu zapisane w hex
             

             if(this.decodeTag == "040ac26a3b2b81")
             {
                let headers = new Headers();
                //headers.append('Authorization','Basic MTIzNDU2OjEyMzQ1Ng==')
                headers.append('Content-Type', 'application/json');

               /* let dataToSend ={
                    groupId: "ogolna",
                    content: this.getContent(this.testProvider.message)
                };*/
                let dataToSend ={
                    message: this.testProvider.message
                };

                if(!this.isAlert)//zeby nie wysyłać wiadomosci kiedy jest wyswietlone powiadomienie
                {
                 //this.http.post('http://'+this.testProvider.adresServera+':'+this.testProvider.port,JSON.stringify(dataToSend), {headers: headers})
                 //this.http.put('https://'+this.testProvider.adresServera+':'+this.testProvider.port+'/general',JSON.stringify(dataToSend),{headers:headers})
                 //this.http.put('https://nefico.tele.pw.edu.pl:8080/general',JSON.stringify(dataToSend),{headers:headers})
                 this.http.post('http://'+this.testProvider.adresServera+':'+this.testProvider.port,JSON.stringify(dataToSend), {headers: headers})
                 .map(res => res.text())
                 .subscribe(data => {
                        this.showAlert('Powiadomienie',data);
                    }, (err)=>{
                        this.showAlert('Nie udało się wysłać wiadomości!',err);
                    });
                }

             }
             else
             {
                this.showAlert('Brak uprawnień!','Nie masz wystarczających uprawnień aby wysłać wiadomość.');
             }
           });
    }

    isNFCisActive(){
        return this.isNFCActive;
    }

    isNFCUnactive(){
        return !this.isNFCActive;
    }
    
    getContent(myContent: string){
        return "<div class=\"mdl-demo mdl-color--grey-100 mdl-color-text--grey-700 mdl-base\"><div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\"><header class=\"mdl-layout__header mdl-layout__header--scroll mdl-color--primary\"><div class=\"mdl-layout--large-screen-only mdl-layout__header-row\">"
        +"</div><div class=\"mdl-layout--large-screen-only mdl-layout__header-row\"><h3>Serwer Wiadomości</h3>"
        +"</div><div class=\"mdl-layout--large-screen-only mdl-layout__header-row\">"
        +"</div><div class=\"mdl-layout__tab-bar mdl-js-ripple-effect mdl-color--primary-dark\">"
        +"<a href=\"#overview\" class=\"mdl-layout__tab is-active\">Wiadomość</a></div></header>"
        +"<main class=\"mdl-layout__content\"><div class=\"mdl-layout__tab-panel is-active\" id=\"overview\">"
        +"<section class=\"section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp\">"
        +"<div class=\"mdl-card mdl-cell mdl-cell--12-col\"><div class=\"mdl-card__supporting-text\"><h4>Wiadomość</h4>"
        +myContent+"</div></div></section></div></main></div><script defer src=\"https://code.getmdl.io/1.3.0/material.min.js\"></script></div>"
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