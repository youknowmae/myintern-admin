import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'applicationStatusText',
})
export class ApplicationStatusTextPipe implements PipeTransform {
  transform(status: number): string {
    if (status == 0) {
      return 'Pending';
    } else if (status == 1) {
      return 'Cancelled';
    } else if (status == 2) {
      return 'Declined';
    } else if (status == 3) {
      return 'Approved';
    } else if (status == 4) {
      return 'Declined';
    } else if (status == 5) {
      return 'For Interview'; //this is a minified version
    } else if (status == 6) {
      return 'Accepted';
    } else {
      return 'Invalid Status';
    }
  }
}
