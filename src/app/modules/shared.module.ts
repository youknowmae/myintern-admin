import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterTextPipe } from '../pipes/semester-text.pipe';
import { ApplicationStatusTextPipe } from '../pipes/application-status-text.pipe';

@NgModule({
  declarations: [SemesterTextPipe, ApplicationStatusTextPipe],
  exports: [SemesterTextPipe, ApplicationStatusTextPipe],
  imports: [CommonModule],
})
export class SharedModule {}
