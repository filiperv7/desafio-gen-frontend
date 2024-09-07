import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';

type searchInput = {
  filter_tag_ids?: number[];
  only_mine?: boolean;
};

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
  questions: any[] = [];
  errorMessage: string | null = null;
  onlyMine: boolean | undefined;
  filterTagIds: number[] = [];
  tags: any[] = [];
  showModal: boolean = false;

  constructor(
    private questionsService: QuestionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
}
