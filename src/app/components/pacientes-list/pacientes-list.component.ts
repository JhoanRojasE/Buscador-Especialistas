import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistasService } from '../../services/especialistas.service';
import { Departamento, Ciudad, Paciente } from '../../models/interfaces';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes-list.component.html',
  styleUrls: ['./pacientes-list.component.css']
})
export class PacientesListComponent implements OnInit {
  private service = inject(EspecialistasService);
  private cdr = inject(ChangeDetectorRef);

  departamentos: Departamento[] = [];
  cities: Ciudad[] = [];
  pacientes: Paciente[] = [];
  filtered: Paciente[] = [];

  fDept = '';
  fCity = '';
  fEstado = '';
  fBusqueda = '';

  get cityOptions(): Ciudad[] {
    if (!this.fDept) return this.cities;
    const dept = this.departamentos.find(d => d.nombre === this.fDept);
    return dept ? this.cities.filter(c => c.departamento_id === dept.id) : this.cities;
  }

  ngOnInit() {
    this.service.loadAll().subscribe(([deps, cities, , , pacientes]) => {
      this.departamentos = deps;
      this.cities = cities;
      this.pacientes = pacientes;
      this.filtered = [...pacientes];
      this.cdr.detectChanges();
    });
  }

  onDeptChange() {
    this.fCity = '';
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.pacientes];
    if (this.fDept) {
      const dept = this.departamentos.find(d => d.nombre === this.fDept);
      if (dept) {
        const cityIds = this.cities.filter(c => c.departamento_id === dept.id).map(c => c.id);
        result = result.filter(p => cityIds.includes(p.ciudad_id));
      }
    }
    if (this.fCity) {
      const city = this.cities.find(c => c.nombre === this.fCity);
      if (city) result = result.filter(p => p.ciudad_id === city.id);
    }
    if (this.fEstado) result = result.filter(p => p.estado === this.fEstado);
    if (this.fBusqueda.trim()) {
      const q = this.fBusqueda.toLowerCase().trim();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.apellido.toLowerCase().includes(q) ||
        p.numero_documento.includes(q)
      );
    }
    this.filtered = result;
    this.cdr.detectChanges();
  }

  getCiudad(id: number): string {
    return this.cities.find(c => c.id === id)?.nombre ?? '-';
  }

  clearFilters() {
    this.fDept = ''; this.fCity = '';
    this.fEstado = ''; this.fBusqueda = '';
    this.applyFilters();
  }
}