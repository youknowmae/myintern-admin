import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { ExitpollComponent } from '../../exitpoll.component';

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

  exitPollDetails: any = {
    short_answer: [

    ],
    training_objectives: [

    ],
    likert: null,
    long_answer: ''
  }

  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')

      if(!id) {
        return
      }
      
      this.getExitPollDetails(parseInt(id))
    });
  }

  getExitPollDetails(id: number) {
    this.ds.get('exit-poll/', id).subscribe(
      exitPollDetails=> {        
        //likert
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
        
        this.exitPollDetails.long_answer = exitPollDetails.exit_poll_long_answer[0].answer
      },
      error => {
        console.error(error)
      }
    )
  }

}
