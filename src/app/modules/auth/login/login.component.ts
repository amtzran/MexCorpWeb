import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthServiceService} from "../services/auth-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
  .main-div mat-card{
    padding: 0;
  }
  .login-form {
    padding: 20px;
  }
  `]
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){
    this.formGroup = new FormGroup( {
      email: new  FormControl('', [Validators.required]),
      password : new  FormControl('', [Validators.required])
    });
  }
  loginProcess() {

    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value)
        .subscribe(result=>{
          if (result.access){
            this.router.navigate(['./customer'])
          }
          else {
            // TODO: Add modal error Credentials
          }
        })
    }

  }

}
