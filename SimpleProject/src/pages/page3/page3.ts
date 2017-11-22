import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Http} from '@angular/http';
import { Page1 } from '../page1/page1';
import {TestProvider} from '../testProvider/TestProvider';
@Component({
  selector: 'page-page3',
  templateUrl: 'page3.html',
})
export class Page3 {
  constructor(public alertCtrl: AlertController, public http: Http, public navParams: NavParams, public navController: NavController, public testProvider: TestProvider) {
    this.getTemplates();
    }
  showEdition: boolean = false;
  templates: string[][];
  isNoTemplate: boolean = false;
  data: string;
  public selectTemplate: string;
  public selectOption: string;
  public selectOptionAdd: string;
  public allMessage: string;
  SelectedValue: string;
  jsonobject: any;
  callback;


    getTemplates(){
      this.http.get('http://192.168.0.101:3000/templates.json')
      .timeout(3000)
      .map(res => res.text())
      .subscribe(dataTemplate =>{
        this.jsonobject = JSON.parse(dataTemplate.toString());
          this.isNoTemplate = false;
          //this.showSelectItems();
    }, (err)=>{
     this.showAlert("Nie udało się pobrać danych z serwera",err);
     this.isNoTemplate = true;
      });
  }

    showSelectItems(){
      this.templates = new Array(this.jsonobject.length);
     console.log("dlugosc :" +this.jsonobject.length);
     for(var i = 0; i < this.jsonobject.length; i++) {
         var obj = this.jsonobject[i].select;
         console.log("dlugosc obiektu :" +obj.length);
         this.templates[i] = new Array(obj.length);
          for(var j =0; j< obj.length;j++){
            this.templates[i][j] = obj[j].value;
          console.log("wartosc : "+obj[j].value);
          
         }
        }
    }


    przekazwiadomosc(callback){
     this.allMessage = isDefined(this.selectTemplate)+isDefined(this.selectOption)+isDefined(this.selectOptionAdd);
      console.log("Wiadomość "+ this.allMessage);

      this.testProvider.setMessage(this.allMessage);
      this.navController.pop();
    }



    isNoTemplates(){
      return this.isNoTemplate;
    }

    showSelectValue(SelectedValue){
      console.log("A "+ SelectedValue);
    }

    itemSelected(templateName: string) {
    
    this.showEdition = true;
    console.log("Selected Item", templateName);
    /*let alert = this.alertCtrl.create({
    title: 'Edition',
    inputs: [
      {
        value: templateName,
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          console.log('data:', data);
          this.templates.templateName = data;
          this.sendChangeToServer();
        }
      }
    ]
  });
  alert.present();*/

  }

  sendChangeToServer(){
  }

  showAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

}
function isDefined(variable: string ){
  if(variable != undefined)
  return variable+" ";
  else
  return "";
}
