import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Http} from '@angular/http';

@Component({
  selector: 'page-page3',
  templateUrl: 'page3.html',
})
export class Page3 {
  constructor(public alertCtrl: AlertController, public http: Http) {
    this.getTemplates();
    }
  showEdition: boolean = false;
  templates: any;
  isNoTemplate: boolean = false;

    getTemplates(){
      this.http.get('http://192.168.0.101:8080/templates.json')
      .timeout(3000)
      .map(res => res.text())
      .subscribe(dataTemplate =>{
          this.templates = JSON.parse(dataTemplate.toString());
          this.isNoTemplate = false;
    }, (err)=>{
     this.showAlert("Nie udało się pobrać danych z serwera",err);
     this.isNoTemplate = true;
      });
  }

    isNoTemplates(){
      return this.isNoTemplate;
    }

    itemSelected(templateName: string) {

    this.showEdition = true;
    console.log("Selected Item", templateName);
    let alert = this.alertCtrl.create({
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
  alert.present();

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
