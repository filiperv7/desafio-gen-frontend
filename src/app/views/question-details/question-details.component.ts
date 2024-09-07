import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswersService } from '../../services/answers.service';
import { DecodeTokenService } from '../../services/decode-token.service';
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
  userId: number | undefined;
  showReply: boolean = false;
  newAnswer: string = '';
  showModal: boolean = false;
  answerToDeleteId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private answersService: AnswersService,
    private decodeTokenService: DecodeTokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.decodeTokenService.decodeToken();

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

      this.answersService.createAnswer(createAnswerInput).subscribe({
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

  canDelete(answerUserId: number) {
    return this.userId === answerUserId;
  }

  showDeleteConfirmation(answerId: number) {
    this.answerToDeleteId = answerId;
    this.showModal = true;
  }

  confirmDelete() {
    if (this.answerToDeleteId !== null) {
      this.answersService.removeAnswer(this.answerToDeleteId).subscribe({
        next: () => {
          this.showModal = false;

          window.location.reload();
        },
        error: (error) => {
          this.errorMessage = 'Erro ao excluir a resposta.';
        },
      });
    }
  }

  cancelDelete() {
    this.showModal = false;
  }
}
