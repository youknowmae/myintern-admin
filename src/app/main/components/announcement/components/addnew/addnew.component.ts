import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addnew',
  templateUrl: './addnew.component.html',
  styleUrl: './addnew.component.scss'
})
export class AddnewComponent {
  constructor(
    private ref: MatDialogRef<AddnewComponent>
  ) {

  }
  closepopup() {
    this.ref.close();
  }
}
