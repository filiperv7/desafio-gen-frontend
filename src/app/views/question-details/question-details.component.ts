import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';

@Component({
  selector: 'app-question-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-details.component.html',
  styleUrl: './question-details.component.css',
})
export class QuestionDetailsComponent implements OnInit {
  question: any;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService
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
}
