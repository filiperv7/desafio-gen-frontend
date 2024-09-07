import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { DecodeTokenService } from '../../services/decode-token.service';
import { QuestionsService } from '../../services/questions.service';

type searchInput = {
  filter_tag_ids?: number[];
  only_mine?: boolean;
};

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
  userId: number | undefined;
  questions: any[] = [];
  errorMessage: string | null = null;
  onlyMine: boolean | undefined;
  filterTagIds: number[] = [];
  tags: any[] = [];
  showModal = false;
  showDeleteModal = false;
  questionToDeleteId: number | null = null;

  constructor(
    private questionsService: QuestionsService,
    private decodeTokenService: DecodeTokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.decodeTokenService.decodeToken();

    this.getQuestions();
    this.getTags();
  }

  toggleMyQuestions(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.onlyMine = true;
      this.filterTagIds = [];
    } else {
      this.onlyMine = undefined;
    }

    const checkbox = document.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    if (checkbox) checkbox.checked = isChecked;

    this.getQuestions();
  }

  toggleTag(tagId: number) {
    if (this.onlyMine) {
      this.onlyMine = undefined;
      const checkbox = document.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      if (checkbox) checkbox.checked = false;
    }

    const index = this.filterTagIds.indexOf(tagId);
    if (index === -1) {
      this.filterTagIds.push(tagId);
    } else {
      this.filterTagIds.splice(index, 1);
    }

    this.getQuestions();
  }

  getTags() {
    this.questionsService.getTags().subscribe({
      next: (result: any) => {
        this.tags = result?.data?.tags;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar tags';
      },
    });
  }

  getQuestions() {
    let searchInput: searchInput | undefined =
      this.onlyMine !== undefined
        ? { only_mine: this.onlyMine }
        : this.filterTagIds.length > 0
        ? {
            filter_tag_ids: this.filterTagIds,
          }
        : undefined;

    this.questionsService.getQuestions(searchInput).subscribe({
      next: (result: any) => {
        this.questions = result?.data?.questions;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar perguntas';
      },
    });
  }

  canEditOrDelete(questionUserId: number): boolean {
    return this.userId === questionUserId;
  }

  openModal() {
    this.showModal = true;
  }

  confirmExit() {
    localStorage.removeItem('token');
    this.showModal = false;
    this.router.navigate(['/']);
  }

  cancelExit() {
    this.showModal = false;
  }

  openDeleteModal(questionId: number) {
    this.questionToDeleteId = questionId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.questionToDeleteId = null;
  }

  confirmDelete() {
    if (this.questionToDeleteId !== null) {
      this.questionsService.removeQuestion(this.questionToDeleteId).subscribe({
        next: () => {
          this.questions = this.questions.filter(
            (question) => question.id !== this.questionToDeleteId
          );

          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Erro ao excluir pergunta', error);
          this.errorMessage = 'Erro ao excluir pergunta';
        },
      });
    }
  }
}
