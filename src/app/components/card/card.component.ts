import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CardStats,
  Institucion,
  Especialista,
  Paciente
} from '../../models/interfaces';

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
  @Input() consultorios: any[] = [];
  showConsultorios = false;

  toggleConsultorios(event: MouseEvent) {
    event.stopPropagation();
    this.showConsultorios = !this.showConsultorios;
  }

  showInstituciones = false;
  showEspecialistas = false;
  showPacientes = false;
  showConsultoriosList = false;

  toggleInstituciones(e: MouseEvent) {
    e.stopPropagation();
    this.showInstituciones = !this.showInstituciones;
  }

  toggleEspecialistas(e: MouseEvent) {
    e.stopPropagation();
    this.showEspecialistas = !this.showEspecialistas;
  }

  togglePacientes(e: MouseEvent) {
    e.stopPropagation();
    this.showPacientes = !this.showPacientes;
  }
}