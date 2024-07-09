import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  formDetails: FormGroup = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
  })
    
    constructor(
      private ref: MatDialogRef<ViewComponent>,
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
