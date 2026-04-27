import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TitleByPathPipe } from '../../pipes/title-by-path.pipe';
import { filter } from 'rxjs';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleByPathPipe],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  activeRoute = '';
  menuOpen = false;

  navItems = [
    { path: '/panel/buscador',      label: 'Buscador',      icon: 'search' },
    { path: '/panel/especialistas', label: 'Especialistas', icon: 'medical_services' },
    { path: '/panel/instituciones', label: 'Instituciones', icon: 'business' },
    { path: '/panel/pacientes',     label: 'Pacientes',     icon: 'people' }
  ];

  ngOnInit() {
    this.activeRoute = this.router.url;
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.activeRoute = e.urlAfterRedirects;
      this.menuOpen = false;
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.logout();
  }

  get userEmail(): string {
    return this.auth.getUser()?.email ?? '';
  }
}