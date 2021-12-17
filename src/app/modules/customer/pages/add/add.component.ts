import { Component, OnInit } from '@angular/core';
import {Contract, Customer, ModelContract, TypeCustomer} from "../../interfaces/customer.interface";
import {CustomerServiceService} from "../../services/customer-service.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../components/confirm/confirm.component";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: []
})
export class AddComponent implements OnInit {

  // Interface Customer
  customer: Customer = {
    name:          '',
    reason_social: '',
    rfc:           '',
    phone:         '',
    email:         '',
    address:       '',
    city:          '',
    postal_code:   '',
    contract: 0,
    customer_type: 0,
    user: 1
    // created_at:    00:00:0000,
    // updated_at:    Date,
  }

  // Fill Selects Contracts and Type customer
  contracts: Contract[] = [];
  typeCustomers: TypeCustomer[] = []

  // form reactive Values
  myForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    reason_social: ['', []],
    rfc: ['', []],
    phone: ['', []],
    email: ['', []],
    address: ['', []],
    city: ['', []],
    postal_code: ['', []],
    contract: [0, []],
    customer_type: [0, []],
    user: [1, []],
  })

  constructor(
    private formBuilder: FormBuilder,
    private customerService : CustomerServiceService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Contracts init
    this.customerService.getContracts()
      .subscribe(contracts => {
        this.contracts = contracts.results
      } )

    // Type Customers
    this.customerService.getTypeCustomers()
      .subscribe(typeCustomers => {
        this.typeCustomers = typeCustomers.results
      } )

    // Verificate Route For Edit or Add
    if (this.router.url === '/customer/add') { return }

    this.activateRoute.params
      .pipe(
        switchMap(({ id }) => this.customerService.getCustomerById( id ))
      )
      .subscribe(customer => {
        this.customer = customer
        this.myForm.get('name')?.setValue(customer.name)
        this.myForm.get('reason_social')?.setValue(customer.reason_social)
        this.myForm.get('rfc')?.setValue(customer.rfc)
        this.myForm.get('phone')?.setValue(customer.phone)
        this.myForm.get('email')?.setValue(customer.email)
        this.myForm.get('address')?.setValue(customer.address)
        this.myForm.get('city')?.setValue(customer.city)
        this.myForm.get('postal_code')?.setValue(customer.postal_code)
        this.myForm.get('contract')?.setValue(customer.contract)
        this.myForm.get('customer_type')?.setValue(customer.customer_type)
      } )

  }

  save(){
    if (this.customer.id)
    {
      this.myForm.addControl('id', new FormControl(this.customer.id))
      this.customerService.updateCustomer(1,this.myForm.value)
        .subscribe(customer => {
          if (customer.id) {
            this.router.navigate(['/customer'])
            this.showSnackBar('Registro Actualizado')
          }
          else this.showSnackBar('Algo salió mal')
        })
    }
    else {
      // Add
      this.customerService.addCustomer(this.myForm.value)
        .subscribe(customer => {
          if (customer.id) {
            this.router.navigate(['/customer'])
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
      data: this.customer
    })

    dialog.afterClosed().subscribe(
      ( result ) => {
        if ( result ) {
          this.customerService.deleteCustomer(this.customer.id!)
            .subscribe(resp => {
              this.router.navigate(['/customer'])
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
