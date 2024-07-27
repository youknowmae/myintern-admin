import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-template',
  templateUrl: './preview-template.component.html',
  styleUrl: './preview-template.component.scss'
})
export class PreviewTemplateComponent { 
  fileName: string = '';
  pdfSource: SafeResourceUrl

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<PreviewTemplateComponent>,
    private sanitizer: DomSanitizer
  ) { 
    this.fileName = this.data.name
    this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdf);
    console.log(this.pdfSource)
  }
  closepopup() {
    this.ref.close(null);
  }
}
