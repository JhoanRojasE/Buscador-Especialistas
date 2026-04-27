// import { Component, OnInit, HostListener, NgZone, inject } from '@angular/core';
import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistasService } from '../../services/especialistas.service';
import { CardComponent } from '../card/card.component';
import { Departamento, Ciudad, Especialista, Institucion, CardStats } from '../../models/interfaces';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  private service = inject(EspecialistasService);
  private cdr = inject(ChangeDetectorRef);

  departamentos: Departamento[] = [];
  cities: Ciudad[] = [];
  specialists: Especialista[] = [];
  instituciones: Institucion[] = [];

  filteredDepartamentos: string[] = [];
  filteredCities: string[] = [];
  filteredSpecialties: string[] = [];

  departmentInput = '';
  cityInput = '';
  specialtyInput = '';

  showDeptList = false;
  showCityList = false;
  showSpecList = false;

  cityDisabled = true;

  selectedDepartamento: Departamento | null = null;
  selectedCity: Ciudad | null = null;

  loading = false;
  groupedCards: { stats: CardStats; list: Especialista[] }[] = [];
  detailStats: CardStats | null = null;
  detailList: Especialista[] = [];
  detailInstituciones: Institucion[] = [];
  viewMode: 'grid' | 'detail' | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.input-group')) {
      this.showDeptList = false;
      this.showCityList = false;
      this.showSpecList = false;
    }
  }

  ngOnInit() {
    this.service.loadAll().subscribe(([deps, cities, specs, insts]) => {
      this.departamentos = deps;
      this.cities = cities;
      this.specialists = specs;
      this.instituciones = insts;
      this.filteredSpecialties = [...new Set(specs.map(s => s.especialidad))];
    });
  }

  onDeptInput() {
    const v = this.departmentInput.toLowerCase();
    this.filteredDepartamentos = this.departamentos
      .map(d => d.nombre)
      .filter(n => n.toLowerCase().includes(v));
    this.showDeptList = true;
  }

  onDeptFocus() {
    setTimeout(() => {
      this.filteredDepartamentos = this.departamentos.map(d => d.nombre);
      this.showDeptList = true;
    }, 0);
  }

  selectDept(nombre: string, event: MouseEvent) {
    event.stopPropagation();
    this.departmentInput = nombre;
    this.selectedDepartamento = this.departamentos.find(d => d.nombre === nombre) || null;
    this.showDeptList = false;
    this.cityDisabled = false;
    this.cityInput = '';
    this.selectedCity = null;
    const filtered = this.cities.filter(
      c => Number(c.departamento_id) === Number(this.selectedDepartamento?.id)
    );
    this.filteredCities = filtered.map(c => c.nombre);
  }

  onCityInput() {
    const v = this.cityInput.toLowerCase();
    const base = this.cities
      .filter(c => Number(c.departamento_id) === Number(this.selectedDepartamento?.id))
      .map(c => c.nombre);
    this.filteredCities = base.filter(n => n.toLowerCase().includes(v));
    this.showCityList = true;
  }

  onCityFocus() {
    setTimeout(() => {
      const base = this.cities
        .filter(c => Number(c.departamento_id) === Number(this.selectedDepartamento?.id))
        .map(c => c.nombre);
      this.filteredCities = base;
      this.showCityList = true;
    }, 0);
  }

  selectCity(nombre: string, event: MouseEvent) {
    event.stopPropagation();
    this.cityInput = nombre;
    this.selectedCity = this.cities.find(c => c.nombre === nombre) || null;
    this.showCityList = false;
  }

  onSpecInput() {
    const v = this.specialtyInput.toLowerCase();
    const all = [...new Set(this.specialists.map(s => s.especialidad))];
    this.filteredSpecialties = all.filter(n => n.toLowerCase().includes(v));
    this.showSpecList = true;
  }

  onSpecFocus() {
    setTimeout(() => {
      this.filteredSpecialties = [...new Set(this.specialists.map(s => s.especialidad))];
      this.showSpecList = true;
    }, 0);
  }

  selectSpec(nombre: string, event: MouseEvent) {
    event.stopPropagation();
    this.specialtyInput = nombre;
    this.showSpecList = false;
  }

  search() {
    if (!this.selectedDepartamento || !this.selectedCity) {
      alert('Debes seleccionar departamento y ciudad');
      return;
    }

    this.loading = true;
    this.viewMode = null;
    this.cdr.detectChanges();

    setTimeout(() => {
      const data = this.specialists.filter(
        e => Number(e.ciudad_id) === Number(this.selectedCity!.id)
      );

      if (this.specialtyInput) {
        const filtered = data.filter(e => e.especialidad === this.specialtyInput);
        if (filtered.length === 0) {
          this.loading = false;
          this.cdr.detectChanges();
          alert('No hay especialistas para esta especialidad en la ciudad seleccionada');
          return;
        }
        this.detailStats = this.buildStats(filtered, this.specialtyInput);
        this.detailList = filtered;
        this.detailInstituciones = this.getInstitucionesForList(filtered);
        this.viewMode = 'detail';
      } else {
        if (data.length === 0) {
          this.loading = false;
          this.cdr.detectChanges();
          alert('No hay datos para esta ciudad');
          return;
        }
        const grouped: Record<string, Especialista[]> = {};
        data.forEach(e => {
          if (!grouped[e.especialidad]) grouped[e.especialidad] = [];
          grouped[e.especialidad].push(e);
        });
        this.groupedCards = Object.keys(grouped).map(spec => ({
          stats: this.buildStats(grouped[spec], spec),
          list: grouped[spec]
        }));
        this.viewMode = 'grid';
      }
    
      this.loading = false;
      this.cdr.detectChanges();
    }, 400);
  }

  selectCard(item: { stats: CardStats; list: Especialista[] }) {
    this.detailStats = item.stats;
    this.detailList = item.list;
    this.detailInstituciones = this.getInstitucionesForList(item.list);
    this.viewMode = 'detail';
  }

  getInstitucionesForList(list: Especialista[]): Institucion[] {
    const ids = new Set(list.map(e => e.institucion_id));
    return this.instituciones.filter(i => ids.has(i.id));
  }

  buildStats(list: Especialista[], titulo: string): CardStats {
    const instIds = new Set(list.map(e => e.institucion_id));
    const instsEnEspecialidad = this.instituciones.filter(i => instIds.has(i.id));
    const ips = instsEnEspecialidad.filter(i => i.tipo === 'IPS').length;
    const profesionales = instsEnEspecialidad.filter(i => i.tipo === 'Profesional Médico').length;

    return {
      titulo,
      total: list.length,
      women: list.filter(e => e.genero === 'Mujer').length,
      men: list.filter(e => e.genero === 'Hombre').length,
      active: list.filter(e => e.estado === 'Activo').length,
      inactive: list.filter(e => e.estado === 'Inactivo').length,
      instituciones: ips + profesionales,
      ips,
      profesionales
    };
  }
}