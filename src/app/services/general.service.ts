import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';
import { Injectable } from '@angular/core';
import { pagination } from '../model/pagination.model';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  makeToast(
    title: string,
    icon: SweetAlertIcon = 'success',
    position: SweetAlertPosition = 'top-end'
  ) {
    Swal.fire({
      icon,
      title,
      toast: true,
      position,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  }

  makeAlert(title: string, text: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      title,
      text,
      icon,
      timer: 3000,
      showConfirmButton: false,
    });
  }

  async confirmationAlert(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string = 'Yes',
    type: 'destructive' | 'confirmation' = 'destructive'
  ) {
    let alert: Promise<boolean> = Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'No',
      confirmButtonColor: type === 'destructive' ? '#AB0E0E' : '#527853',
      cancelButtonColor: '#777777',
      heightAuto: false,
    }).then((res: any) => {
      if (res.value) {
        return true;
      }
      return false;
    });

    return alert;
  }

  getPaginationDetails(
    materials: any,
    currentPage: number,
    perPage: number = 24
  ) {
    var pagination: pagination = <pagination>{};

    pagination.current_page = currentPage;

    pagination.total = materials.length;
    pagination.from = (currentPage - 1) * perPage;
    pagination.to =
      pagination.from + perPage > pagination.total
        ? pagination.total
        : pagination.from + perPage;
    pagination.last_page = Math.ceil(pagination.total / perPage);

    pagination.per_page = perPage;

    return pagination;
  }
}
