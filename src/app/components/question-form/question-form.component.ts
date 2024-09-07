import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestionsService } from '../../services/questions.service';
import { ContainerComponent } from '../container/container.component';

export type Tag = {
  id?: number;
  tag_name: string;
};

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
  ],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css'],
})
export class QuestionFormComponent implements OnInit, OnChanges {
  @Input() question: any;
  @Input() isEditMode: boolean = false;
  @Input() message: string | undefined;
  @Output() submitForm = new EventEmitter<any>();

  questionForm!: FormGroup;
  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  maxTags: number = 3;
  searchTerm: string = '';
  errorMessage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private questionsService: QuestionsService
  ) {}

  ngOnInit(): void {
    this.loadTags();

    this.questionForm = this.fb.group({
      title: [this.question?.title || '', Validators.required],
      description: [this.question?.description || '', Validators.required],
      tags: [[], Validators.required],
    });

    if (this.isEditMode && this.question) {
      this.selectedTags = this.question.tags || [];
      this.questionForm.patchValue({
        tags: this.selectedTags,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.isEditMode) {
      this.selectedTags =
        this.question?.tags?.map((tag: { tag_name: string }) => ({
          tag_name: tag.tag_name,
        })) || [];
      this.questionForm.patchValue({
        title: this.question?.title || '',
        description: this.question?.description || '',
        tags: this.selectedTags,
      });
    }

    if (changes['message']) {
      this.errorMessage = this.message;
    }
  }

  loadTags() {
    this.questionsService.getTagsDropDown().subscribe((tags) => {
      this.tags = tags;
    });
  }

  addTag(tags: any) {
    this.selectedTags = tags;

    this.questionForm.get('tags')?.setValue(this.selectedTags);
  }

  createTag(tagName: string) {
    if (this.searchTerm.trim() === '') return;

    const newTag: Tag = { id: undefined, tag_name: tagName };

    this.tags.push(newTag);

    if (this.selectedTags.length < this.maxTags) {
      this.selectedTags.push(newTag);
    }

    this.questionForm.get('tags')?.setValue(this.selectedTags);
  }

  onSearch(event: any) {
    this.searchTerm = event.term;
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;

      formValue.tags = this.selectedTags.map((tag) => ({
        tag_name: tag.tag_name,
      }));

      this.submitForm.emit(formValue);
    }
  }
}
