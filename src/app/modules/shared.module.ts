import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterTextPipe } from '../pipes/semester-text.pipe';
import { ApplicationStatusTextPipe } from '../pipes/application-status-text.pipe';
import { CourseShortToFullPipe } from '../pipes/course-short-to-full.pipe';
import { RomanNumeralPipe } from '../pipes/roman-numeral.pipe';

@NgModule({
  declarations: [SemesterTextPipe, ApplicationStatusTextPipe, CourseShortToFullPipe, RomanNumeralPipe],
  exports: [SemesterTextPipe, ApplicationStatusTextPipe, CourseShortToFullPipe, RomanNumeralPipe],
  imports: [CommonModule],
})
export class SharedModule {}
