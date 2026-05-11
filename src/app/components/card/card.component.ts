import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStats, Institucion, Especialista, Paciente } from '../../models/interfaces';

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
  @Input() single    = false;

  @Input() instituciones: Institucion[] = [];
  @Input() especialistas: Especialista[] = [];
  @Input() pacientes: Paciente[]         = [];

  showInstituciones = false;
  showEspecialistas = false;
  showPacientes     = false;

  toggleInstituciones(e: MouseEvent) { e.stopPropagation(); this.showInstituciones = !this.showInstituciones; }
  toggleEspecialistas(e: MouseEvent) { e.stopPropagation(); this.showEspecialistas = !this.showEspecialistas; }
  togglePacientes(e: MouseEvent)     { e.stopPropagation(); this.showPacientes     = !this.showPacientes; }

  ageGroups = [
    { key: 'infancia',     label: 'Infancia',     range: '0-11'  },
    { key: 'adolescencia', label: 'Adolescencia', range: '12-17' },
    { key: 'juventud',     label: 'Juventud',     range: '18-26' },
    { key: 'adultez',      label: 'Adultez',      range: '27-59' },
    { key: 'mayores',      label: 'Mayores',      range: '60+'   }
  ];

  getAgeGroupWomen(key: string): number {
    return (this.stats as any)?.ageStats?.[key]?.women ?? 0;
  }

  getAgeGroupMen(key: string): number {
    return (this.stats as any)?.ageStats?.[key]?.men ?? 0;
  }
}