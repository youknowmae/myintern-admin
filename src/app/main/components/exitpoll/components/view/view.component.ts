import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';

interface ExitPoll {
  user: any,
  short_question: any,
  training_objectives: any,
  likert: any,
  long_answer: string
}
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})

export class ViewComponent {
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  shortAnswerQuestions = [
    'a. My scope of work is directly related to the academic program I am pursuing.',
    'b. I was given an orientation on the company organization and operations.',
    'c. I was given a job description on my specific duties and reporting relationships.',
    'd. My office/work hours were clear and convenient for me.',
    'e. I felt safe and secure in my work location and environment.',
    'f. I had no difficulty going to and from work.',
    'g. The company provided me with allowance, stipend, or subsidy indicate if _ _ _ meal or _ _ _ cash. If cash, how much? _ _ _/day'
  ]

  exitPollDetails: any

  constructor(
    private us: UserService,
  ) {
    this.getExitPollDetails()
  }

  getExitPollDetails() {
    var exitPollDetails = this.us.getStudentExitPoll();

    this.exitPollDetails = exitPollDetails

    this.exitPollDetails.industry_partner.full_address = exitPollDetails.industry_partner.street + ' ' + exitPollDetails.industry_partner.barangay + ' ' + exitPollDetails.industry_partner.municipality + ', ' + exitPollDetails.industry_partner.province

    console.log(this.exitPollDetails)
  }

}
