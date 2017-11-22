import { Component } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Http} from '@angular/http';
import { Device } from '@ionic-native';
import { Headers } from '@angular/http';
import { AlertController, NavController } from 'ionic-angular';
import { map } from 'rxjs/operator/map';
import { timeout} from 'rxjs/operator/timeout';
import { DomSanitizer } from '@angular/platform-browser';
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

    public message: string; //szablon
    public newmessage: string;
    htmlVariable: string;
    testRadioOpen: boolean;
    testRadioResult;
    flaga: boolean = false;
    isNFCActive: boolean;
    public NFCInfo: string;
    public tagID: string;
    public decodeTag: string;
    public info: string;
    public status: string;
    templates: any;
    public temp: string;
    public adresSerwera: string;
    public port: number;
    isAlert: boolean = false;
    pushPage : any;
    

    constructor(public alertCtrl: AlertController,public navCtrl: NavController, private NFC: NFC, private ndef: Ndef, public http: Http ,public sanitizer: DomSanitizer, public testProvider: TestProvider) {
            this.listenNFC();
    }

    changeMessage(){
        this.testProvider.setMessage(this.message);
    }

    wybierzSzablon(){
        console.log("dddd");
        this.navCtrl.push(Page3);
    }

    checkWord(){
        var liczbaslow : number = 0;
        var liczbaslowtablica :any  = this.testProvider.message.split(" ");
        this.newmessage = "";
        for (var i =0 ; i<liczbaslowtablica.length;i++){
            if(liczbaslowtablica[i]=="w")
            {
                //tutej jakis boolean
                //this.htmlVariable = '<span class="highlight">' + liczbaslowtablica[i] + '</span>';
                liczbaslowtablica[i] = '<a href="#" onclick="replaceword()"> ' + liczbaslowtablica[i] +  '</a>';

                console.log(liczbaslowtablica[i]);
            }
            this.newmessage += liczbaslowtablica[i]+" " ;
        }
    }

    replaceword() {
        console.log("liczbashghi");
        let alert = this.alertCtrl.create();
        alert.setTitle('Wybierz słowo');
    
        alert.addInput({
          type: 'radio',
          label: 'Blue',
          value: 'blue',
          checked: true
        });
    
        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            this.testRadioOpen = false;
            this.testRadioResult = data;
          }
        });
        alert.present();
       
    }
    

    listenNFC(){
        //Funkcja wywolująca sie gdy przyłożymy tag do telefonu
        this.NFC.addNdefListener(() => {
            console.log("Tag wykryty");
            this.isNFCActive = true;
           }, (err) => {
             console.log("Wystąpił błąd przy czytaniu tagu");
             this.showConfirm();
           }).subscribe((event) => {
            //wydarzenia nastepujące po prawidłowym odczycie tagu
             this.tagID = event.tag.id; // ID tagu
             this.decodeTag = this.NFC.bytesToHexString(event.tag.id); //ID tagu zapisane w hex
             

             if(this.decodeTag == "040ac26a3b2b81")
             {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');

                let dataToSend ={
                    message: this.testProvider.message
                };

                if(!this.isAlert)//zeby nie wysyłać wiadomosci kiedy jest wyswietlone powiadomienie
                {
                 this.http.post('http://'+this.adresSerwera+':'+this.port,JSON.stringify(dataToSend), {headers: headers})
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
    
    doRadio() { 
        if(!this.isAlert)
        {
            this.http.get('http://'+this.adresSerwera+':'+this.port+'/templates.json')
                .timeout(3000)
                .map(res => res.text())
                .subscribe(dataTemplate =>{
                    try{
                    var jsonobject = JSON.parse(dataTemplate.toString());
                    let alert = this.alertCtrl.create();
                    alert.setTitle('Szablon wiadomości');
                    for(let i in jsonobject)
                    {
                        if (jsonobject[i].id == 1 )
                        {
                            alert.addInput({
                                type: 'radio',
                                label: jsonobject[i].template,
                                value: jsonobject[i].template,
                                checked: true
                            });
                        }
                        else{
                            alert.addInput({
                                type: 'radio',
                                label: jsonobject[i].template,
                                value: jsonobject[i].template
                            });
                        }
                    }

                    alert.addButton('Cancel');
                    alert.addButton({
                        text: 'Ok',
                        handler: data => {
                            this.testRadioOpen = false;
                            this.testRadioResult = data;
                            this.testProvider.message = data;
                        }
                    });
            
                    alert.present().then(() => {
                        this.testRadioOpen = true;
                    }); 
                    }catch(err){
                        this.showAlert('Powiadomienie','Wystąpił błąd podczas wyświetlania szablonów: '+err);
                    }
                
                
                }, (err)=>{
                        this.showAlert('Nie udało się pobrać szablonów z serwera: ','Przekroczono czas oczekiwania: ' +err);
                    
                });
        }
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