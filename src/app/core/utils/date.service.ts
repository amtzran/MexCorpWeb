import { Injectable } from '@angular/core';
import * as moment from "moment"
import * as tz from "moment-timezone"

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() {
    moment().locale('es')
  }

  getFormatDate(date: string) {
    return moment(new Date(date)).format('DD-MM-YYYY').toString();
  }
  /*FormData Fechas*/
  getFormatDataDate(date: any) {
    return moment(new Date(date)).format('YYYY-MM-DD').toString();
  }
  getFormatDateInput(date: any) {
    const [day, month, year] = date.split('-');
    return moment([year, (Number(month) - 1),  (Number(day) + 1), 0, 0, 0, 0]).format('YYYY-MM-DD');
  }
  formatDateToUTC(date: any){
    return moment().utc(date).format('DD-MM-YYYYTHH:mm');
  }
  formatDateUTC(date: any){
    return moment(new Date(date)).format('DD-MM-YYYYTHH:mm');
  }
  formatDateLocal(date:string){
    let local = date.split('T')
    let newString = `${local[0]} ${local[1]}`
    return newString;
  }

}
