import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  downloadPdf() {
    const doc = new jsPDF();

    // Get the HTML content to be converted to PDF
    const content = document.getElementById('formContent')!;

    // Use jsPDF's html method to capture the content
    doc.html(content, {
      callback: (doc) => {
        // Save the generated PDF
        doc.save('ojt-exit-poll.pdf');
      },
      x: 10,
      y: 10,
      width: 180,  // Optional: adjust the width as needed
      windowWidth: 800 // Optional: Adjust if the HTML content is wide
    });
  }
}
