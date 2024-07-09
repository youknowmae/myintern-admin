import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrl: './add-announcement.component.scss'
})
export class AddAnnouncementComponent {
formDetails: FormGroup = this.fb.group({
  title: [null, Validators.required],
  description: [null, Validators.required],
})
  
  constructor(
    private ref: MatDialogRef<AddAnnouncementComponent>,
    private fb: FormBuilder
  ) {

  }
  closepopup() {
    this.ref.close();
  }

  submit() {
    console.log('test')
    this.ref.close();
  }
}
