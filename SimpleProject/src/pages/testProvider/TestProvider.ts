import { Injectable } from '@angular/core';

@Injectable()
export class TestProvider {

 public message: any = "";
 public adresServera: string;
 public port: number; 
 public key: string;
 public groupId: string;

 constructor() {}

 setMessage(message) {
   this.message = message;
 }
}