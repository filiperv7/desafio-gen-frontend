import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { EditQuestionComponent } from './views/edit-question/edit-question.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { NewQuestionComponent } from './views/new-question/new-question.component';
import { QuestionDetailsComponent } from './views/question-details/question-details.component';
import { QuestionsComponent } from './views/questions/questions.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'questions',
    component: QuestionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'questions/:id',
    component: QuestionDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-question',
    component: NewQuestionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-question/:id',
    component: EditQuestionComponent,
    canActivate: [AuthGuard],
  },
];
