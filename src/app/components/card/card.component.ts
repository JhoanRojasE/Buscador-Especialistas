import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStats, Institucion, Especialista } from '../../models/interfaces';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() stats!: CardStats;
  @Input() clickable = false;
  @Input() single = false;
  @Input() instituciones: Institucion[] = [];
  @Input() especialistas: Especialista[] = [];

  showInstituciones = false;
  showEspecialistas = false;

  toggleInstituciones(event: MouseEvent) {
    event.stopPropagation();
    this.showInstituciones = !this.showInstituciones;
  }

  toggleEspecialistas(event: MouseEvent) {
    event.stopPropagation();
    this.showEspecialistas = !this.showEspecialistas;
  }
}