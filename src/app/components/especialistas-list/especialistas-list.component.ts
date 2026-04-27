import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistasService } from '../../services/especialistas.service';
import { Departamento, Ciudad, Especialista, Institucion } from '../../models/interfaces';

@Component({
  selector: 'app-especialistas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialistas-list.component.html',
  styleUrls: ['./especialistas-list.component.css']
})
export class EspecialistasListComponent implements OnInit {
  private service = inject(EspecialistasService);
  private cdr = inject(ChangeDetectorRef);

  departamentos: Departamento[] = [];
  cities: Ciudad[] = [];
  specialists: Especialista[] = [];
  instituciones: Institucion[] = [];
  filtered: Especialista[] = [];

  fDept = '';
  fCity = '';
  fEspecialidad = '';
  fInstitucion = '';
  fEstado = '';

  get especialidades(): string[] {
    return [...new Set(this.specialists.map(e => e.especialidad))].sort();
  }

  get cityOptions(): Ciudad[] {
    if (!this.fDept) return this.cities;
    const dept = this.departamentos.find(d => d.nombre === this.fDept);
    return dept ? this.cities.filter(c => c.departamento_id === dept.id) : this.cities;
  }

  ngOnInit() {
    this.service.loadAll().subscribe(([deps, cities, specs, insts]) => {
      this.departamentos = deps;
      this.cities = cities;
      this.specialists = specs;
      this.instituciones = insts;
      this.filtered = [...specs];
      this.cdr.detectChanges();
    });
  }

  onDeptChange() {
    this.fCity = '';
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.specialists];
    if (this.fDept) {
      const dept = this.departamentos.find(d => d.nombre === this.fDept);
      if (dept) {
        const cityIds = this.cities.filter(c => c.departamento_id === dept.id).map(c => c.id);
        result = result.filter(e => cityIds.includes(e.ciudad_id));
      }
    }
    if (this.fCity) {
      const city = this.cities.find(c => c.nombre === this.fCity);
      if (city) result = result.filter(e => e.ciudad_id === city.id);
    }
    if (this.fEspecialidad) result = result.filter(e => e.especialidad === this.fEspecialidad);
    if (this.fInstitucion) {
      const inst = this.instituciones.find(i => i.nombre === this.fInstitucion);
      if (inst) result = result.filter(e => e.institucion_id === inst.id);
    }
    if (this.fEstado) result = result.filter(e => e.estado === this.fEstado);
    this.filtered = result;
    this.cdr.detectChanges();
  }

  getInstitucion(id: number): string {
    return this.instituciones.find(i => i.id === id)?.nombre ?? '-';
  }

  getCiudad(id: number): string {
    return this.cities.find(c => c.id === id)?.nombre ?? '-';
  }

  clearFilters() {
    this.fDept = ''; this.fCity = ''; this.fEspecialidad = '';
    this.fInstitucion = ''; this.fEstado = '';
    this.applyFilters();
  }
}