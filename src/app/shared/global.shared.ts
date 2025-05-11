import Swal, { SweetAlertIcon } from 'sweetalert2';
import moment from 'moment';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class GlobalMethods {
  
  public today: Date = new Date();

  public formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public formatDate(dt: Date, sw: string): string {
    return moment(dt).format(sw);
  }

  async confirmAlert(title: string, message: string, icon: SweetAlertIcon, confirmText: string = 'yes') {
    let ans: boolean = false
    ans = await Swal.fire({
      titleText: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '$d33',
      confirmButtonText: confirmText,
      heightAuto: false
    }).then((res: any)=>{
      if(res.value) {
        return true
      }
      return false;
    });
    return ans;
  }
}