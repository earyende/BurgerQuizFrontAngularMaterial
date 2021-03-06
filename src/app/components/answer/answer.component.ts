import { Component, OnInit } from '@angular/core';
import {Question} from '../../models/model.question';
import { ActivatedRoute, Router } from '@angular/router';
import {QuizInstance} from '../../models/model.quiz-instance';
import { QuizInstanceService } from '../../services/quiz-instance.service';
import { ChoiceResult } from '../../models/model.choice-result';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  i:number=0;
  nombreReponse:number=0;
  num_question: number;
  idinstance: number;
  
  choiceResults:ChoiceResult[]=[];
  question:Question=new Question();
  quizInstance : QuizInstance=new QuizInstance();
  errorMessage: string;
  displayedColumns: string[] = ['choix','nombre'];

  constructor(private quizInstanceService :QuizInstanceService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.num_question = parseInt(params.num_question);
      this.idinstance = parseInt(params.id_instance);
      this.getQuizInstance();
    });
    
  }

  getQuizInstance(){
    this.quizInstanceService.getOne(this.idinstance)
      .subscribe((data: QuizInstance) => {
        this.quizInstance = data;
        this.question=this.quizInstance.quiz.questions[this.num_question];
        for (let choice of this.question.choices) {
            this.choiceResults[this.i]=new ChoiceResult();
            this.choiceResults[this.i].value=choice.value;
            this.nombreReponse=0;
            for(let answerChoice of choice.answers){                
                for(let answerQuizIns of this.quizInstance.answers){
                  if(answerChoice.id == answerQuizIns.id){
                    this.nombreReponse++;
                  }
                }
            }
          this.choiceResults[this.i].nombreRep=this.nombreReponse;
          this.i++;
        }
      }
    )
    this.i=0;
  }

  questionSuivante(){
    if(this.quizInstance.quiz.questions.length-1 == this.num_question){
      this.router.navigate(['/subscription']);
    }else{
      this.num_question++;
      this.router.navigate([`/presentateur/${this.idinstance}/reponses/${this.num_question}`]);
    }
  }

  typeQuestion(){
    if(this.question.typequestion == "qcm"){
      console.log("type question : "+this.question.typequestion+ " true")
      return true;
    }else{
      console.log("type question : "+this.question.typequestion+ " false")
      return false;
    }
  }
  
  rafraichir(){
    this.getQuizInstance();
  }
}
