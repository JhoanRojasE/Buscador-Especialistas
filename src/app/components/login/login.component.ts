import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = false;

  login() {
    if (!this.email || !this.password) {
      this.error = 'Ingresa tu correo y contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (success: boolean) => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/panel']);
        } else {
          this.error = 'Correo o contraseña incorrectos';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al verificar credenciales';
      }
    });
  }
}