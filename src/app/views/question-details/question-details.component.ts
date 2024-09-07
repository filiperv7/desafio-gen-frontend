import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-question-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-details.component.html',
  styleUrl: './question-details.component.css',
})
export class QuestionDetailsComponent implements OnInit {
  question: any;
  errorMessage: string | null = null;
  showReply: boolean = false;
  newAnswer: string = '';

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuestion();
  }

  loadQuestion() {
    const questionId = Number(this.route.snapshot.paramMap.get('id'));

    this.questionsService.getQuestionById(questionId).subscribe({
      next: (result: any) => {
        this.question = result?.data?.question;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar a pergunta';
      },
    });
  }

  goBack() {
    this.router.navigate(['/questions']);
  }

  toggleReply() {
    this.showReply = !this.showReply;
  }

  submitAnswer() {
    if (this.newAnswer.trim()) {
      const createAnswerInput = {
        content: this.newAnswer.trim(),
        question_id: this.question.id,
      };

      this.questionsService.createAnswer(createAnswerInput).subscribe({
        next: (response) => {
          this.newAnswer = '';
          this.showReply = false;

          window.location.reload();
        },
        error: (error) => {
          this.errorMessage = 'Erro ao enviar a resposta.';
        },
      });
    }
  }
}
