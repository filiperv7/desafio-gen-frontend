import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContainerComponent } from '../../components/container/container.component';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    ContainerComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nickName: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { nickName, email, name, position, password } =
        this.registerForm.value;

      this.registerService
        .register(nickName, email, name, position, password)
        .subscribe(
          (response) => {
            console.log('Registration successful', response);
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Registration failed', error);
            this.errorMessage = 'Registration failed. Please try again.';
          }
        );
    }
  }
}
