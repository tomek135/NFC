import { Injectable } from '@angular/core';

@Injectable()
export class TestProvider {

 public message: any = "";

 constructor() {

 }

 setMessage(message) {
   this.message = message;
 }
}