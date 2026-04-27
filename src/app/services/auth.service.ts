import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

interface User {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'sistole_session';
  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>('/assets/users.json').pipe(
      map(users => {
        const match = users.find(u => u.email === email && u.password === password);
        if (match) {
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ email: match.email }));
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.SESSION_KEY);
  }

  getUser(): { email: string } | null {
    const data = sessionStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
}