import { Injectable } from '@angular/core';
import {CanActivate, CanLoad, Router} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {AuthServiceService} from "../auth/services/auth-service.service";

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return true
   /* return this.authService.validateToken()
      .pipe(
        tap( valid =>{
          if (!valid) {
            this.router.navigateByUrl('/auth').then(r => console.log(r))
          }
        })
      )*/
  }
  canLoad(): Observable<boolean> | boolean {
    return true

 /* return this.authService.validateToken()
      .pipe(
        tap( valid =>{
          if (!valid) {
            this.router.navigateByUrl('/auth').then(r => console.log(r))
          }
        })
      )*/

  }

}
