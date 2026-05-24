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
  @Input() single = false;

  @Input() instituciones: Institucion[] = [];
  @Input() especialistas: Especialista[] = [];
  @Input() pacientes: Paciente[] = [];

  showInstituciones = false;
  showEspecialistas = false;
  showPacientes = false;

  toggleInstituciones(e: MouseEvent) { e.stopPropagation(); this.showInstituciones = !this.showInstituciones; }
  toggleEspecialistas(e: MouseEvent) { e.stopPropagation(); this.showEspecialistas = !this.showEspecialistas; }
  togglePacientes(e: MouseEvent) { e.stopPropagation(); this.showPacientes = !this.showPacientes; }

  // Rangos edad pacientes
  ageGroups = [
    { key: 'infancia', label: 'Infancia', range: '0-11' },
    { key: 'adolescencia', label: 'Adolescencia', range: '12-17' },
    { key: 'juventud', label: 'Juventud', range: '18-26' },
    { key: 'adultez', label: 'Adultez', range: '27-59' },
    { key: 'mayores', label: 'Mayores', range: '60+' }
  ];

  getAgeGroupWomen(key: string): number {
    return (this.stats as any)?.ageStats?.[key]?.women ?? 0;
  }

  getAgeGroupMen(key: string): number {
    return (this.stats as any)?.ageStats?.[key]?.men ?? 0;
  }

  // Rangos experiencia especialistas
  expGroups = [
    { key: 'junior', label: '0 - 2 años' },
    { key: 'semi', label: '2 - 5 años' },
    { key: 'senior', label: '5 - 9 años' },
    { key: 'experto', label: '9+ años' }
  ];

  expGroup(anos: number): string {
    if (anos <= 2) return 'junior';
    if (anos <= 5) return 'semi';
    if (anos <= 9) return 'senior';
    return 'experto';
  }

  get expStats(): Record<string, { women: number; men: number }> {
    const result: Record<string, { women: number; men: number }> = {
      junior: { women: 0, men: 0 },
      semi: { women: 0, men: 0 },
      senior: { women: 0, men: 0 },
      experto: { women: 0, men: 0 }
    };
    this.especialistas.forEach(e => {
      const g = this.expGroup(e.experiencia_anos);
      if (e.genero === 'Mujer') result[g].women++;
      else if (e.genero === 'Hombre') result[g].men++;
    });
    return result;
  }

  getExpWomen(key: string): number { return this.expStats[key]?.women ?? 0; }
  getExpMen(key: string): number { return this.expStats[key]?.men ?? 0; }
}