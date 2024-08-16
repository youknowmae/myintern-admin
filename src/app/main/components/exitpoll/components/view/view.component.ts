import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';

interface ExitPoll {
  user: any,
  short_answer: any,
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

  exitPollDetails: ExitPoll = {
    user: {},
    short_answer: [

    ],
    training_objectives: [

    ],
    likert: '',
    long_answer: ''
  }

  constructor(
    private us: UserService,
  ) {
    this.getExitPollDetails()
  }

  getExitPollDetails() {
    var exitPollDetails = this.us.getStudentExitPoll();

    this.exitPollDetails.user = exitPollDetails.user
    
    this.exitPollDetails.likert = exitPollDetails.exit_poll_short_answer.pop().answer

    //short answers
    exitPollDetails.exit_poll_short_answer.forEach((item: any) => {
      this.exitPollDetails.short_answer.push({
        answer: item.answer
      })
    });
    //training objective
    exitPollDetails.exit_poll_training_objective.forEach((item: any) => {
      this.exitPollDetails.training_objectives.push({
        training_objective: item.training_objective,
        achievement_level: item.achievement_level
        })
    });
    
    this.exitPollDetails.long_answer = exitPollDetails.exit_poll_long_answer.answer
  }

}
