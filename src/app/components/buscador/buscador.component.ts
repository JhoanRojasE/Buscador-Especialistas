import {
  Component,
  OnInit,
  HostListener,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EspecialistasService } from '../../services/especialistas.service';
import { CardComponent } from '../card/card.component';

import {
  Departamento,
  Ciudad,
  Especialista,
  Institucion,
  Paciente,
  Consultorio,
  CardStats
} from '../../models/interfaces';

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

  // =========================
  // DATA
  // =========================
  departamentos: Departamento[] = [];
  cities: Ciudad[] = [];
  specialists: Especialista[] = [];
  instituciones: Institucion[] = [];
  pacientes: Paciente[] = [];
  consultorios: Consultorio[] = [];

  // =========================
  // FILTROS
  // =========================
  departmentInput = '';
  cityInput = '';
  specialtyInput = '';

  selectedDepartamento: Departamento | null = null;
  selectedCity: Ciudad | null = null;

  cityDisabled = true;

  // =========================
  // DROPDOWNS
  // =========================
  filteredDepartamentos: string[] = [];
  filteredCities: string[] = [];
  filteredSpecialties: string[] = [];

  showDeptList = false;
  showCityList = false;
  showSpecList = false;
  showSearchTypeList = false;

  // =========================
  // TIPO BUSQUEDA
  // =========================
  searchType: 'especialidades' | 'pacientes' | 'instituciones' | 'general' = 'especialidades';

  searchTypeOptions = [
    { value: 'especialidades', label: 'Especialistas' },
    { value: 'pacientes', label: 'Pacientes' },
    { value: 'instituciones', label: 'Instituciones' },
    { value: 'general', label: 'Información General' }
  ];

  // =========================
  // RESULTADOS
  // =========================
  loading = false;
  viewMode: 'grid' | 'detail' | null = null;

  groupedCards: any[] = [];

  detailStats: CardStats | null = null;
  detailList: Especialista[] = [];
  detailInstituciones: Institucion[] = [];
  detailPacientes: Paciente[] = [];
  detailConsultorios: Consultorio[] = [];

  // =========================
  // INIT
  // =========================
  ngOnInit() {
    this.service.loadAll().subscribe(
      ([deps, cities, specs, insts, pacientes, consultorios]) => {

        this.departamentos = [
          { id: 0, nombre: 'TODOS', codigo_dane: '00' },
          ...deps
        ];

        this.cities = cities;
        this.specialists = specs;
        this.instituciones = insts;
        this.pacientes = pacientes;
        this.consultorios = consultorios;

        this.filteredSpecialties = [...new Set(specs.map(s => s.especialidad))];
      }
    );
  }

  // =========================
  // CLICK FUERA
  // =========================
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.input-group')) {
      this.showDeptList = false;
      this.showCityList = false;
      this.showSpecList = false;
      this.showSearchTypeList = false;
    }
  }

  // =========================
  // SELECT TIPO
  // =========================
  toggleSearchTypeDropdown() {
    this.showSearchTypeList = !this.showSearchTypeList;
  }

  selectSearchType(option: any, event: MouseEvent) {
    event.stopPropagation();
    this.searchType = option.value;
    this.showSearchTypeList = false;
  }

  getSearchTypeLabel(value: string): string {
    return this.searchTypeOptions.find(o => o.value === value)?.label || '';
  }

  // =========================
  // DEPARTAMENTO
  // =========================
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

    const filtered = this.selectedDepartamento?.id === 0
      ? this.cities
      : this.cities.filter(c => c.departamento_id === this.selectedDepartamento?.id);

    this.filteredCities = filtered.map(c => c.nombre);
  }

  // =========================
  // CIUDAD
  // =========================
  onCityInput() {
    const v = this.cityInput.toLowerCase();

    const base = this.selectedDepartamento?.id === 0
      ? this.cities
      : this.cities.filter(c => c.departamento_id === this.selectedDepartamento?.id);

    this.filteredCities = base
      .map(c => c.nombre)
      .filter(n => n.toLowerCase().includes(v));

    this.showCityList = true;
  }

  onCityFocus() {
    setTimeout(() => {
      const base = this.selectedDepartamento?.id === 0
        ? this.cities
        : this.cities.filter(c => c.departamento_id === this.selectedDepartamento?.id);

      this.filteredCities = base.map(c => c.nombre);
      this.showCityList = true;
    }, 0);
  }

  selectCity(nombre: string, event: MouseEvent) {
    event.stopPropagation();

    this.cityInput = nombre;
    this.selectedCity = this.cities.find(c => c.nombre === nombre) || null;

    this.showCityList = false;
  }

  // =========================
  // ESPECIALIDAD
  // =========================
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

  // =========================
  // FILTRO GENERAL
  // =========================
  filterByLocation(item: any): boolean {

    if (this.selectedDepartamento?.id === 0) return true;

    const cityIds = this.cities
      .filter(c => c.departamento_id === this.selectedDepartamento!.id)
      .map(c => c.id);

    return this.selectedCity
      ? item.ciudad_id === this.selectedCity.id
      : cityIds.includes(item.ciudad_id);
  }

  // =========================
  // SEARCH
  // =========================
  search() {

    if (!this.selectedDepartamento) {
      alert('Selecciona un departamento');
      return;
    }

    this.loading = true;
    this.viewMode = null;

    // 🔥 LIMPIAR TODO
    this.groupedCards = [];
    this.detailList = [];
    this.detailInstituciones = [];
    this.detailPacientes = [];
    this.detailConsultorios = [];

    this.cdr.detectChanges();

    setTimeout(() => {

      // ===================== ESPECIALIDADES
      if (this.searchType === 'especialidades') {

        const data = this.specialists.filter(e => this.filterByLocation(e));

        if (this.specialtyInput) {

          const filtered = data.filter(e => e.especialidad === this.specialtyInput);

          this.detailStats = this.buildStats(filtered, this.specialtyInput);
          this.detailList = filtered;
          this.detailInstituciones = this.getInstitucionesForList(filtered);

          this.viewMode = 'detail';
          this.loading = false;
          this.cdr.detectChanges();
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

        if (this.groupedCards.length === 1) {
          this.selectCard(this.groupedCards[0]);
          return;
        }

        this.viewMode = 'grid';
      }

      // ===================== PACIENTES
      else if (this.searchType === 'pacientes') {

        const data = this.pacientes.filter(p => this.filterByLocation(p));

        const stats: CardStats = {
          titulo: 'Pacientes',
          total: data.length,
          women: data.filter(p => p.genero === 'Mujer').length,
          men: data.filter(p => p.genero === 'Hombre').length,
          active: data.filter(p => p.estado === 'Activo').length,
          inactive: data.filter(p => p.estado !== 'Activo').length,
          type: 'pacientes'
        };

        this.detailStats = stats;
        this.detailPacientes = data;
        this.viewMode = 'detail';
      }

      // ===================== INSTITUCIONES
      else if (this.searchType === 'instituciones') {

        const data = this.instituciones.filter(i => this.filterByLocation(i));

        this.groupedCards = data.map(inst => {

          const medicos = this.specialists.filter(s => s.institucion_id === inst.id);

          return {
            stats: {
              titulo: inst.nombre,
              total: 1,
              tipoInstitucion: inst.tipo,
              estado: inst.estado,
              type: 'instituciones'
            },
            list: medicos,
            institucion: inst
          };
        });

        if (this.groupedCards.length === 1) {
          this.selectCard(this.groupedCards[0]);
          return;
        }

        this.viewMode = 'grid';
      }

      // ===================== GENERAL
      else if (this.searchType === 'general') {

        const cities = this.selectedCity
          ? [this.selectedCity]
          : this.selectedDepartamento?.id === 0
            ? this.cities
            : this.cities.filter(c => c.departamento_id === this.selectedDepartamento!.id);

        this.groupedCards = cities.map(city => {

          const pacientes = this.pacientes.filter(p => p.ciudad_id === city.id);
          const instituciones = this.instituciones.filter(i => i.ciudad_id === city.id);
          const consultorios = this.consultorios.filter(c => c.ciudad_id === city.id);

          return {
            stats: {
              titulo: city.nombre,
              total: pacientes.length,
              pacientes: pacientes.length,
              women: pacientes.filter(p => p.genero === 'Mujer').length,
              men: pacientes.filter(p => p.genero === 'Hombre').length,
              active: pacientes.filter(p => p.estado === 'Activo').length,
              inactive: pacientes.filter(p => p.estado !== 'Activo').length,
              instituciones: instituciones.length,
              ips: instituciones.filter(i => i.tipo === 'IPS').length,
              profesionales: instituciones.filter(i => i.tipo === 'Profesional Médico').length,
              consultorios: consultorios.length,
              type: 'general'
            },
            list: [],
            pacientes,
            instituciones,
            consultorios
          };
        });

        this.viewMode = 'grid';
      }

      this.loading = false;
      this.cdr.detectChanges();

    }, 300);
  }

  // =========================
  // DETALLE
  // =========================
  selectCard(item: any) {

    this.detailStats = item.stats;

    if (this.searchType === 'pacientes') {
      this.detailPacientes = item.list || item.pacientes || [];
    }

    if (this.searchType === 'instituciones') {
      this.detailInstituciones = item.institucion ? [item.institucion] : [];
      this.detailList = item.list || [];
    }

    if (this.searchType === 'especialidades') {
      this.detailList = item.list;
      this.detailInstituciones = this.getInstitucionesForList(item.list);
    }

    if (this.searchType === 'general') {
      this.detailPacientes = item.pacientes || [];
      this.detailInstituciones = item.instituciones || [];
      this.detailConsultorios = item.consultorios || [];
    }

    this.viewMode = 'detail';
  }

  // =========================
  // HELPERS
  // =========================
  getInstitucionesForList(list: Especialista[]): Institucion[] {
    const ids = new Set(list.map(e => e.institucion_id));
    return this.instituciones.filter(i => ids.has(i.id));
  }

  buildStats(list: Especialista[], titulo: string): CardStats {

    const instIds = new Set(list.map(e => e.institucion_id));
    const insts = this.instituciones.filter(i => instIds.has(i.id));

    return {
      titulo,
      total: list.length,
      women: list.filter(e => e.genero === 'Mujer').length,
      men: list.filter(e => e.genero === 'Hombre').length,
      active: list.filter(e => e.estado === 'Activo').length,
      inactive: list.filter(e => e.estado !== 'Activo').length,
      instituciones: insts.length,
      ips: insts.filter(i => i.tipo === 'IPS').length,
      profesionales: insts.filter(i => i.tipo === 'Profesional Médico').length,
      type: 'especialidades'
    };
  }
}