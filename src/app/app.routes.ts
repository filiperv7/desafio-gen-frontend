import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
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
];
