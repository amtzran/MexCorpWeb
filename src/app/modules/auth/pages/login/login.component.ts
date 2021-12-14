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

  myform: FormGroup = this.formBuilder.group ({
    email: ['manuel.mdz.rom@swopyn.com', [Validators.required, Validators.email] ],
    password: ['1234567890', [Validators.required, Validators.minLength(6)] ]
  })

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  login(){

    const {email, password} = this.myform.value
    this.authService.login(email, password)
      .subscribe(result => {
        if (result.access){
          this.router.navigate(['./customer'])
        }
        else {
          this.dialog.open(CredentialsComponent, {
            width: '250px',
            data: {...result}
          });
        }
      })

  }

}
