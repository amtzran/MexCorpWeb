import { Component, OnInit } from '@angular/core';
import {Door, DoorType} from "../../interfaces/door.interface";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DoorService} from "../../services/door.service";
import {switchMap} from "rxjs";
import {ConfirmComponent} from "../../components/confirm/confirm.component";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [
  ]
})
export class AddComponent implements OnInit {

  //initialize Doo
  door: Door = {
    name: '',
    observations: '',
    door_type: 0,
    customer: 0,
  }

  // Id Customer
  idCustomer!: string | null;
  idDoor!: string | null;
  private sub : any;

  // Fill Select Door Types
  doorTypes: DoorType [] = []

  // form reactive Values
  myForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    observations: ['', []],
    door_type: ['', []],
  })


  constructor(
    private formBuilder: FormBuilder,
    private doorService: DoorService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    // Door Types init
    this.doorService.getDoorTypes()
      .subscribe(doorTypes => {
        this.doorTypes = doorTypes.results
      } )

    if (!this.router.url.includes('add')) {
      this.activateRoute.params
        .pipe(
          switchMap(({ id }) => this.doorService.getDoorById( id ))
        )
        .subscribe(door => {
          this.door = door
          this.myForm.get('name')?.setValue(door.name)
          this.myForm.get('observations')?.setValue(door.observations)
          this.myForm.get('door_type')?.setValue(door.door_type)
        } )
    }

  }
  save(){
    if (this.door.id)
    {
      this.doorService.updateDoor(this.door.id,this.myForm.value)
        .subscribe(door => {
          if (door.id) {
            this.showSnackBar('Registro Actualizado')
            this.router.navigateByUrl(`/door/customer/${door.customer}`)
          }
          else this.showSnackBar('Algo salió mal')
        })
    }
    else {
      // Add
      let url = this.router.url.split('/')
      this.myForm.addControl('customer', new FormControl( url[3] ))
      this.doorService.addDoor(this.myForm.value)
        .subscribe(door => {
          if (door.id) {
            this.router.navigateByUrl(`/door/customer/${door.customer}`)
            this.showSnackBar('Registro Creado')
          }
          else this.showSnackBar('Algo salió mal')
        })
    }

  }

  delete(){
    // Show Dialog
    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250',
      data: this.door
    })

    dialog.afterClosed().subscribe(
      ( result ) => {
        if ( result ) {
          this.doorService.deleteDoor(this.door.id!)
            .subscribe(resp => {
              let url = this.router.url.split('/')
              this.router.navigateByUrl(`/door/customer/${url[3]}`)
              this.showSnackBar('Registro Eliminado')
            })
        }
      })

  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000
    })
  }

}
