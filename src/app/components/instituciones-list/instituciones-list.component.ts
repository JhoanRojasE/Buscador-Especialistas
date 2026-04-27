import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistasService } from '../../services/especialistas.service';
import { Departamento, Ciudad, Institucion } from '../../models/interfaces';

interface InstitucionView extends Institucion {
  totalEspecialistas: number;
  ciudadNombre: string;
  departamentoNombre: string;
}

@Component({
  selector: 'app-instituciones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instituciones-list.component.html',
  styleUrls: ['./instituciones-list.component.css']
})
export class InstitucionesListComponent implements OnInit {
  private service = inject(EspecialistasService);
  private cdr = inject(ChangeDetectorRef);

  departamentos: Departamento[] = [];
  cities: Ciudad[] = [];
  instituciones: InstitucionView[] = [];
  filtered: InstitucionView[] = [];

  fDept = '';
  fCity = '';
  fTipo = '';
  fEstado = '';
  fOrden = '';

  get cityOptions(): Ciudad[] {
    if (!this.fDept) return this.cities;
    const dept = this.departamentos.find(d => d.nombre === this.fDept);
    return dept ? this.cities.filter(c => c.departamento_id === dept.id) : this.cities;
  }

  ngOnInit() {
    this.service.loadAll().subscribe(([deps, cities, specs, insts]) => {
      this.departamentos = deps;
      this.cities = cities;
      this.instituciones = insts.map(i => {
        const ciudad = cities.find(c => c.id === i.ciudad_id);
        const dept = ciudad ? deps.find(d => d.id === ciudad.departamento_id) : null;
        return {
          ...i,
          totalEspecialistas: specs.filter(e => e.institucion_id === i.id).length,
          ciudadNombre: ciudad?.nombre ?? '-',
          departamentoNombre: dept?.nombre ?? '-'
        };
      });
      this.filtered = [...this.instituciones];
      this.cdr.detectChanges();
    });
  }

  onDeptChange() {
    this.fCity = '';
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.instituciones];
    if (this.fDept) result = result.filter(i => i.departamentoNombre === this.fDept);
    if (this.fCity) result = result.filter(i => i.ciudadNombre === this.fCity);
    if (this.fTipo) result = result.filter(i => i.tipo === this.fTipo);
    if (this.fEstado) result = result.filter(i => i.estado === this.fEstado);
    if (this.fOrden === 'asc') result.sort((a, b) => a.totalEspecialistas - b.totalEspecialistas);
    else if (this.fOrden === 'desc') result.sort((a, b) => b.totalEspecialistas - a.totalEspecialistas);
    this.filtered = result;
    this.cdr.detectChanges();
  }

  clearFilters() {
    this.fDept = ''; this.fCity = ''; this.fTipo = '';
    this.fEstado = ''; this.fOrden = '';
    this.applyFilters();
  }
}