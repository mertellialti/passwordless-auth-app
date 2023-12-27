import { Component, NgModule } from '@angular/core';
import { startRegistration } from '@simplewebauthn/browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormControl, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CreateAccountRequest } from 'src/app/models/account/requests/create/create-account-request';
import { Account } from 'src/app/models/account/account';
import { AccountService } from 'src/app/services/account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HttpClientModule
  ]
})
export class RegistrationComponent {

  message: string = 'Message';
  userName: string = '';
  isRegistrationOptionsPhase: boolean = false;
  userId: any;

  constructor(
    private authSrv: AuthService,
    private accountSrv: AccountService,
    private readonly router: Router

  ) { }

  // Step 1: Register the user with a username
  async registerUser() {
    try {
      const request = new CreateAccountRequest();
      const account = new Account();
      account.username = this.userName;
      request.account = account;

      const response: any = await this.accountSrv.createUser(request).toPromise();
      console.log(response);
      if (response.status) {
        this.message = response.msg
        this.userId = response.data;
        // User registration successful, now get registration options
        await this.getRegistrationOptions(response.data);
      } else {
        console.error('User registration failed:', response.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }


  // Step 2: Get registration options from the server
  async getRegistrationOptions(userId: string) {
    try {
      const optionsResponse: any = await this.authSrv.generateRegistrationOptions(userId).toPromise();
      console.log('Options response: ',optionsResponse);
      this.message = optionsResponse.msg
      if (optionsResponse.status) {
        const registrationOptions = optionsResponse.data;
        // Now, you can use the registrationOptions to initiate FIDO2 registration
        if (optionsResponse.status) {
          const registrationOptions = optionsResponse.data;
          // Now, you can use the registrationOptions to initiate FIDO2 registration
          const a = await this.startFido2Registration(registrationOptions);
          console.log('start fido registration: ',a);
        } else {
          console.error('Failed to get registration options:', optionsResponse.error);
        }
      }
    }
    catch (error) {
      console.error('Error while getting registration options:', error);
    }
  }

  // Step 3: Initiate FIDO2 registration
  async startFido2Registration(registrationOptions: any) {
    try {
      // Assuming you have a function startRegistration that initiates FIDO2 registration
      const registrationResponse = await startRegistration(registrationOptions);      
      console.log('registration response: ',registrationResponse)
      // After FIDO2 registration, you will receive a response containing the registration data

      // Now, you can send this response to the server for verification
      const b = await this.verifyFido2Registration(registrationResponse);
      console.log('verify fido 2 registration: ',b);
    } catch (error) {
      console.error('FIDO2 registration error:', error);
    }
  }

  // Step 4: Verify FIDO2 registration on the server
  async verifyFido2Registration(registrationResponse: any) {
    try {
      registrationResponse['userId'] = this.userId;
      console.log(registrationResponse);
      const verificationResponse: any = await this.authSrv.verifyRegistrationResponse(registrationResponse).toPromise();
      console.log('verification response: ', verificationResponse);
      if (verificationResponse.data.verified) {
        // FIDO2 registration successful
        console.log('FIDO2 registration successful');
        this.router.navigate(['home','login'])
        // You can perform any additional actions here, such as logging the user in
      } else {
        console.error('FIDO2 registration failed:', verificationResponse.error);
      }
    } catch (error) {
      console.error('FIDO2 registration verification error:', error);
    }
  }
}
