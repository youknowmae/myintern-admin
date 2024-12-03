import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';

import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrl: './evaluation-view.component.scss'
})
export class EvaluationViewComponent {
  isSubmitting: boolean = false
  exitPollDetails: any = {
    user: '',
    industry_partner: {
      supervisor_position: '',
      immediate_supervisor: '',
      full_address: '',
      company_name: ''
    },
    total_hours_completed: ''
  }

  evaluation: any
  formDetails: FormGroup 
  certificate: any
  
  isGenerating: boolean = false
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private us: UserService,
    private ds: DataService,
    private dialogRef: MatDialog
  ) {
    this.formDetails = this.fb.group({
      knowledge: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
      ]),
      skills: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
      ]),
      attitude: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
      ]),
      suggestions: this.fb.group({
        strong_point: [null, [Validators.required, Validators.maxLength(256)]],
        utilized_effectively: [null, [Validators.required, Validators.maxLength(256)]],
        weak_point: [null, [Validators.required, Validators.maxLength(256)]],
        corrected_by: [null, [Validators.required, Validators.maxLength(256)]],
        other_comment: [null, [Validators.required, Validators.maxLength(256)]],
      }),
      further_employment: this.fb.group({
        response: [null, Validators.required],
        why: [null, [Validators.required, Validators.maxLength(256)]],
        if_not: this.fb.array([
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null), 
          this.fb.control(null),
        ])
      })
    })
  }

  ngOnInit() {
    this.getEvaluation()
    this.getCompletionCert()
  }

  getCompletionCert() {
    let evaluation = this.us.getStudentEvaluation()

    let id = evaluation.user_id
    this.ds.get('adviser/evaluation/certificate/', id).subscribe(
      response => {
        let certificate = response

        if(!certificate) {
          return
        }

        this.certificate = certificate        
      },
      error => {
        console.error(error)
      }
    )

  }

  getEvaluation() {
    let evaluation  = this.us.getStudentEvaluation()

    if(!evaluation) {
      this.router.navigate(['main/evaluation/list'])
    }

    this.evaluation = evaluation
    
    this.formDetails.patchValue({
      ...evaluation.evaluation
    })

    let further_employment =  this.formDetails.get('further_employment.response')?.value

    const ifNotArray = this.formDetails.get('further_employment.if_not') as FormArray;

    if (further_employment === '1') {
      ifNotArray.disable();  
    }
  }

  // previewFile(file: any) {
  //   console.log(file)
  //   this.dialogRef.open(PdfPreviewComponent, {
  //     data: { name: file.file_name, pdf: file.file_location},
  //     disableClose: true
  //   })
  // }

  async downloadPdf() {
    if(this.isGenerating) {
      return
    }

    this.isGenerating = true

    console.log('generating')

    const contentIds = [
    'formContent-2',
    'formContent-1',
    'formContent0',
    'formContent1', 
    'formContent2', 
    'formContent3',
    'formContent4',
    'formContent5',
    'formContent6',
    'formContent7',
    'formContent8',
    'formContent9',
  
  ]; // Add all the IDs you want to include in the PDF
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size
    
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const imgWidth = pdfWidth - 50.8; // 1in margin
    const xOffset = (pdfWidth - imgWidth) / 2; // Center horizontally
    const startPosition = 15; // Start 1 inch from top
    const bottomMargin = 10   
  
    let position = startPosition;
  
    for (const contentId of contentIds) {
      const content = document.getElementById(contentId);
      if (!content) {
        console.warn(`Element with ID '${contentId}' not found.`);
        continue;
      }
    
      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    
      // Check if the image fits on the current page
      if (position + imgHeight > pdfHeight - bottomMargin) { 
        pdf.addPage(); // Add a new page if the image overflows
        position = startPosition; // Reset to the top margin of the new page
      }
    
      pdf.addImage(imgData, 'PNG', xOffset, position, imgWidth, imgHeight);
      position += imgHeight; // Move the position down by the height of the image
    }
    
  
    this.isGenerating = false
    // Save the PDF
    pdf.save('STUDENT.EVALUATION.pdf');
    console.log('Saving...')
  }
}
