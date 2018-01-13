import { Injectable } from '@angular/core';

@Injectable()
export class TestProvider {

 public message: any = "";
 public adresServera: string;
 public port: number; 
 public key: string;
 public IdGroup: string;
 public onInit: boolean = false;

 constructor() {

 }

 setMessage(message) {
   this.message = message;
 }
}