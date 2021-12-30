import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthServiceService} from "../../services/auth-service.service";
import {MatDialog} from "@angular/material/dialog";
import {CredentialsComponent} from "../../componenets/credentials/credentials.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [``],
  styleUrls: ['../main/main.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;

  myForm: FormGroup = this.formBuilder.group ({
    email: ['', [Validators.required, Validators.email] ],
    password: ['', [Validators.required, Validators.minLength(6)] ]
    //email: ['manuel.mdz.rom@swopyn.com', [Validators.required, Validators.email] ],
    //password: ['1234567890', [Validators.required, Validators.minLength(8)] ]
  })

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // Validate Exists Token
    if (localStorage.getItem('access_token')) {
      this.loading = true;
      setTimeout(() => {
        this.router.navigate(['./dashboard/customer'])
      }, 1000)
    }

  }

  login(){

    const {email, password} = this.myForm.value
    this.authService.login(email, password)
      .subscribe(result => {

        if (result.message === 'Ya estás autenticado') {
          this.loading = true;
          setTimeout(() => {
            this.router.navigate(['./dashboard/customer'])
          }, 1000)
        }
        if (result.access_token){
          this.loading = true;
          setTimeout(() => {
            this.router.navigate(['./dashboard/customer'])
          }, 1000)
        }
        if (result.error) {
          this.dialog.open(CredentialsComponent, {
            width: '250px',
            data: {...result.error}
          });
        }
      })

  }

}
