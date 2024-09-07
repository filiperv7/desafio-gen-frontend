import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionFormComponent } from '../../components/question-form/question-form.component';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-new-question',
  standalone: true,
  imports: [QuestionFormComponent],
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css'],
})
export class NewQuestionComponent {
  constructor(
    private questionsService: QuestionsService,
    private router: Router
  ) {}

  createQuestion(data: any) {
    this.questionsService.createQuestion(data).subscribe({
      next: (response) => {
        this.router.navigate(['/questions']);
      },
      error: (error) => {
        console.error('Erro ao criar pergunta', error);
      },
    });
  }
}
