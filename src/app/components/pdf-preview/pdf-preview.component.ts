import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrl: './pdf-preview.component.scss'
})
export class PdfPreviewComponent {
  fileName: string = '';
  pdfSource: SafeResourceUrl

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<PdfPreviewComponent>,
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
