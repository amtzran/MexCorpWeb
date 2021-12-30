import {Injectable} from '@angular/core';
import * as moment from "moment"

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
    return `${local[0]} ${local[1]}`;
  }

  // Format Input Angular Type Example: "2020-07-13T00:00:00-05:00".
  getFormatDateSetInputRangePicker(date: string){
    return moment(date).format()
  }

}
