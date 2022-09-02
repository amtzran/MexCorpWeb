import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../services/groups.service";
import {ModalResponse} from "../../../../../core/utils/ModalResponse";
import {SharedService} from "../../../../../shared/services/shared.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {GooglePlaceDirective} from "ngx-google-places-autocomplete";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-dialog-add-group',
  templateUrl: './dialog-add-group.component.html',
  styleUrls: ['./dialog-add-group.component.css']
})
export class DialogAddGroupComponent implements OnInit {

  /*Formulario*/
  groupForm!: FormGroup;
  /* Variable to store file data */
  fileDataForm = new FormData();
  /* Show Image */
  imageFile: string | null | undefined = '';

  /*Titulo Modal*/
  title: string = 'Nuevo Grupo';

  /*Variables display errors modal*/
  showError!: boolean;
  submit!: boolean;
  @ViewChild("placesRef") placesRef!: GooglePlaceDirective;
  options: any = {
    types: [],
    componentRestrictions: { country: 'MX' }
  }
  //@ViewChild( 'map', { static: true} ) mapElement!: ElementRef;
  //map!: google.maps.Map;
  latitude!: number;
  longitude!: number;
  zoom!: number;
  geocoder!: google.maps.Geocoder;
  addressGoogle: any = '';
  circleDraggable: boolean = true;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<DialogAddGroupComponent>,
    private _groupService: GroupService,
    private mapsAPILoader: MapsAPILoader,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public group : {idGroup: number, edit: boolean, info: boolean}
  ) {
    this.geocoder = new google.maps.Geocoder();
  }

  ngOnInit(): void {

    /*Google Maps Marker Dragable*/
    this.circleDraggable = true;

    /*Formulario*/
    this.loadGroupForm();

    if(this.group.idGroup && this.group.edit){
      this.title = 'Editar Grupo';
      this.imageFile = null;
      this.groupForm.updateValueAndValidity();
    }

    if(this.group.idGroup && !this.group.edit){
      this.circleDraggable = false;
      this.title = 'Información del Grupo';
      this.spinner.show()
      this._groupService.getGroupById(this.group.idGroup).subscribe(
        res => {
          this.imageFile = res.data.logo
          this.spinner.hide()
        },
        (error => {
          this.spinner.hide()
          this.sharedService.errorDialog(error)
        })
      );
      this.groupForm.updateValueAndValidity();
    }

    if(this.group.idGroup) this.loadGroupById();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadMap()
    }, 1000);
  }

  loadMap(){
    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
      this.setCurrentLocation();
    });
  }

  /**
   * Get detail retrieve of one group.
   */
  loadGroupById(): void{
    this.spinner.show()
    this._groupService.getGroupById(this.group.idGroup).subscribe(response => {
      this.spinner.hide();
      delete response.data.id;
      delete response.data.is_active;
      delete response.data.created_at;
      delete response.data.updated_at;
      this.latitude = response.data.latitude!;
      this.longitude = response.data.longitude!;
      this.groupForm.setValue(response.data);
    }, (error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    } )
    )
  }

  /**
   * Load the form group.
   */
  loadGroupForm():void{
    this.groupForm = this.fb.group({
      name:[{value:null, disabled:this.group.info}, Validators.required],
      reason_social:[{value:'', disabled:this.group.info}, Validators.required],
      rfc:[{value:'', disabled:this.group.info}, Validators.required],
      phone:[{value:'', disabled:this.group.info}],
      email:[{value:'', disabled:this.group.info}, [Validators.required, Validators.email]],
      address: [{value:'', disabled:this.group.info}],
      city: [{value:'', disabled:this.group.info}],
      postal_code: [{value:'', disabled:this.group.info}],
      logo: [{value:'', disabled:this.group.info}],
      latitude: [{value:'', disabled:this.group.info}],
      longitude: [{value:'', disabled:this.group.info}],
      radius: [{value:'', disabled:this.group.info}, Validators.required],
    });
  }

  /**
   * Create a group.
   */
  addGroup(): void {
    this.validateForm();
    this.addAddress();
    this.createFormData(this.groupForm.value);
    this.spinner.show()
    this._groupService.postGroup(this.fileDataForm).subscribe(response => {
      this.sharedService.showSnackBar('Se ha agregado correctamente el grupo.');
      this.dialogRef.close(ModalResponse.UPDATE);
      this.spinner.hide()
    }, (error => {
      this.spinner.hide()
      this.sharedService.errorDialog(error)
    } ))
  }

  /**
   * Update a group.
   */
  updateGroup(): void {
    this.validateForm()
    this.addAddress();
    this.createFormData(this.groupForm.value);
    this.spinner.show()
    this._groupService.updateGroup(this.group.idGroup, this.fileDataForm).subscribe(response => {
      this.spinner.hide()
      this.sharedService.showSnackBar(`Se ha actualizado correctamente el grupo`);
      this.dialogRef.close(ModalResponse.UPDATE);
    }, (error => {
        this.spinner.hide()
        this.sharedService.errorDialog(error)
    }))
  }

  /* File onchange event */
  setFileLogo(e : any){
    this.groupForm.get('logo')?.setValue(e.target.files[0])
  }

  addAddress() : void {
    this.groupForm.patchValue({
      latitude: this.latitude,
      longitude: this.longitude
    });
    if (this.addressGoogle !== '') this.groupForm.get('address')?.setValue(this.addressGoogle);
  }

  public handleAddressChange(address: Address) {
    /*console.log(`Url: ${address.url}`)*/
    this.addressGoogle = address.formatted_address;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
  }

  public setCurrentLocation(){
    if ('geolocation' in navigator){
      if (this.group.idGroup && this.group.edit) {
        this.latitude = Number(this.groupForm.get('latitude')?.value);
        this.longitude = Number(this.groupForm.get('longitude')?.value);
        this.zoom = 17;
      }
      else {
        navigator.geolocation.getCurrentPosition(position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 17;
        });
      }

    }
  }

  markerDragEnd($event: any) {
    const latlng = {
      lat: parseFloat($event.latLng.lat()),
      lng: parseFloat($event.latLng.lng()),
    };

    this.geocoder.geocode({ location: latlng},
      (response) => {
        this.groupForm.get('address')?.patchValue(response[0].formatted_address);
        //console.log(response.results[0].formatted_address)
      })

    this.latitude = latlng.lat;
    this.longitude = latlng.lng;
  }

  /*Método que permite cambiar el radio(m) del circulo desde el mapa*/
  changeGeofence(event: any){
    console.log('changeGeofence');
    this.groupForm.get('radius')?.setValue(event);
  }

  /**
   * Method convert formGroup a DataForm and wor with files
   * @param formValue
   */
  createFormData(formValue:any){

    for(const key of Object.keys(formValue)){
      const value = formValue[key];
      if (value !== null) {
        if (key === 'logo') {
          if (typeof(value) !== 'object') {
            if (value.startsWith('https')) this.fileDataForm.append(key, '');
          }
          else this.fileDataForm.append(key, value);
        }
        else {
          this.fileDataForm.append(key, value);
        }
      }

    }

  }

  /**
   * Validate form in general
   */
  validateForm(){
    this.submit = true;
    if(this.groupForm.invalid){
      this.sharedService.showSnackBar('Los campos con * son obligatorios.');
      return
    }
  }

  /**
   * Validations
   * @param field
   */
  fieldInvalid(field: string) {
    return this.groupForm.get(field)?.invalid &&
      this.groupForm.get(field)?.touched
  }

  /**
   * Close modal.
   */
  close(): void{
    this.dialogRef.close(ModalResponse.UPDATE);
  }

}
