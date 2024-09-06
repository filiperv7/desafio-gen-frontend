import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GraphQLError } from 'graphql';
import { ContainerComponent } from '../../components/container/container.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    ContainerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nickName: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { nickName, password } = this.loginForm.value;

      this.authService.login(nickName, password).subscribe(
        (result) => {
          const token = result?.data?.login?.access_token;
          if (token) {
            localStorage.setItem('token', `Bearer ${token}`);

            this.router.navigate(['/questions']);
          }
        },
        (error: { graphQLErrors?: GraphQLError[] }) => {
          const graphQLErrors = error?.graphQLErrors || [];
          this.errorMessage = graphQLErrors.map((e) => e.message).join(', ');
        }
      );
    }
  }
}
