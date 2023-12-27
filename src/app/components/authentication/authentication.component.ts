import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { startAuthentication } from '@simplewebauthn/browser';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class AuthenticationComponent {

  username = '';
  message = ''

  constructor(private authSrv: AuthService) { }

  async authenticate() {
    // Step 1: Register the user with a username

    try {
      const response: any = await this.authSrv.getAuthenticationOptions(this.username).toPromise();
      console.log(response);
      if (response.status) {
        try {
          // Pass the options to the authenticator and wait for a response
          this.message = response.msg
          console.log(response.data);
          const assRes = await startAuthentication(response.data);
        
          this.verifyAuthentication(assRes);
        } catch (error) {
          // Some basic error handling
          this.message = 'Error at start auth.'
          throw error;
        }

      } else {
        console.error('User registration failed:', response.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }

  }

  verifyAuthentication(response: any) {
    try {
      response['username'] = this.username;
      this.authSrv.verifyAuthenticationResponse(response).subscribe(
        (response: any) => {
          console.log('verify auth response: ', response);
          if (response.status) {
            this.message = response.msg;
            this.authSrv.isAuthenticatedSignal.set(true);
          } else {

          }
        }
      )
    } catch (error) {

    }
  }


}
