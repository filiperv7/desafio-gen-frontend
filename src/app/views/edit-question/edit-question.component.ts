import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphQLError } from 'graphql';
import { QuestionFormComponent } from '../../components/question-form/question-form.component';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-edit-question',
  standalone: true,
  imports: [QuestionFormComponent],
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css'],
})
export class EditQuestionComponent implements OnInit {
  questionId: number | undefined;
  question: any;
  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestion();
  }

  loadQuestion() {
    if (this.questionId) {
      this.questionsService.getQuestionById(this.questionId).subscribe({
        next: (response) => {
          this.question = response.data.question;
        },
        error: (error) => {
          console.error('Erro ao carregar pergunta', error);
        },
      });
    }
  }

  updateQuestion(data: any) {
    this.questionsService
      .updateQuestion({ id: this.questionId, ...data })
      .subscribe({
        next: (response) => {
          this.router.navigate(['/questions']);
        },
        error: (error: { graphQLErrors?: GraphQLError[] }) => {
          const graphQLErrors = error?.graphQLErrors || [];
          this.errorMessage = graphQLErrors.map((e) => e.message).join(', ');
        },
      });
  }
}
