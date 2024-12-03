import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  shortAnswerQuestions = [
    'a. My scope of work is directly related to the academic program I am pursuing.',
    'b. I was given an orientation on the company organization and operations.',
    'c. I was given a job description on my specific duties and reporting relationships.',
    'd. My office/work hours were clear and convenient for me.',
    'e. I felt safe and secure in my work location and environment.',
    'f. I had no difficulty going to and from work.',
    'g. The company provided me with allowance, stipend, or subsidy indicate if _ _ _ meal or _ _ _ cash. If cash, how much? _ _ _/day'
  ];

  exitPollDetails: any;
  isGenerating: boolean = false

  constructor(private us: UserService) {
    this.getExitPollDetails();
  }

  getExitPollDetails() {
    this.exitPollDetails = this.us.getStudentExitPoll();
    if (this.exitPollDetails) {
      this.exitPollDetails.industry_partner.full_address =
        `${this.exitPollDetails.industry_partner.street} ${this.exitPollDetails.industry_partner.barangay} 
        ${this.exitPollDetails.industry_partner.municipality}, ${this.exitPollDetails.industry_partner.province}`;
      console.log(this.exitPollDetails);
    }
  }

  async downloadPdf() {
    
    if(this.isGenerating) {
      return
    }

    this.isGenerating = true

    console.log('generating')

    const contentIds = [
    'formContent0', 
    'formContent1', 
    'formContent2', 
    'formContent3',
    'formContent4',
    'formContent5',
  ]; 

    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size
    
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const imgWidth = pdfWidth - 25.4; 
    const xOffset = (pdfWidth - imgWidth) / 2; // Center horizontally
    const startPosition = 25.4; // Start 1 inch from top
    const bottomMargin = 25.4
  
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
    pdf.save('ojt-exit-poll.pdf');
  }
  
  
}
