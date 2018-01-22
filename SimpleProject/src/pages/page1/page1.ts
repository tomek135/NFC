import { Component } from '@angular/core';
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
    providers: []
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
            this.showAlert('Autoryzacja poprawna!','ID Grupy: ' + this.testProvider.groupId);
            },(noMatch)=>{
            console.log("Wystąpił problem "+JSON.stringify(noMatch));
            })
        }

    selectTemplate(){
        this.navCtrl.push(Page3);
    }


    sendMessage(){

                let headers = new Headers();
                headers.append('Authorization','Basic '+ this.testProvider.key);
                headers.append('Content-Type', 'application/json');

                let dataToSend ={
                    groupId: this.testProvider.groupId,
                    content: this.getContent(this.testProvider.message)
                };

                if(!this.isAlert)//zeby nie wysyłać wiadomosci kiedy jest wyswietlone powiadomienie
                {
                 this.http.put('https://nefico.tele.pw.edu.pl:8080/general',JSON.stringify(dataToSend),{headers:headers})
                 .timeout(1000)
                 .map(res => res.text())
                 .subscribe(data => {
                        this.showAlert('Powiadomienie','Wiadomość została wysłana');
                    }, (err)=>{
                        this.showAlert('Nie udało się wysłać wiadomości!',err);
                    });
                }
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