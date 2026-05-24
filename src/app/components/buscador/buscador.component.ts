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

  departamentos: Departamento[] = [];
  cities: Ciudad[] = [];
  specialists: Especialista[] = [];
  instituciones: Institucion[] = [];
  pacientes: Paciente[] = [];

  departmentInput = '';
  cityInput = '';
  specialtyInput = '';

  selectedDepartamento: Departamento | null = null;
  selectedCity: Ciudad | null = null;

  cityDisabled = true;

  filteredDepartamentos: string[] = [];
  filteredCities: string[] = [];
  filteredSpecialties: string[] = [];

  showDeptList = false;
  showCityList = false;
  showSpecList = false;
  showSearchTypeList = false;

  searchType: 'especialidades' | 'pacientes' | 'instituciones' | 'general' = 'especialidades';

  searchTypeOptions = [
    { value: 'especialidades', label: 'Especialistas' },
    { value: 'pacientes', label: 'Pacientes' },
    { value: 'instituciones', label: 'Instituciones' },
    { value: 'general', label: 'Información General' }
  ];

  loading = false;
  viewMode: 'grid' | 'detail' | null = null;

  groupedCards: any[] = [];

  detailStats: CardStats | null = null;
  detailList: Especialista[] = [];
  detailInstituciones: Institucion[] = [];
  detailPacientes: Paciente[] = [];

  ngOnInit() {
    this.service.loadAll().subscribe(([deps, cities, specs, insts, pacientes]) => {
      this.departamentos = [{ id: 0, nombre: 'TODOS', codigo_dane: '00' }, ...deps];
      this.cities = cities;
      this.specialists = specs;
      this.instituciones = insts;
      this.pacientes = pacientes;
      this.filteredSpecialties = [...new Set(specs.map(s => s.especialidad))];
      this.cdr.detectChanges();
    });
  }

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

  toggleSearchTypeDropdown() { this.showSearchTypeList = !this.showSearchTypeList; }

  selectSearchType(option: any, event: MouseEvent) {
    event.stopPropagation();
    this.searchType = option.value;
    this.showSearchTypeList = false;
    this.specialtyInput = '';
    this.viewMode = null;
    this.groupedCards = [];
  }

  getSearchTypeLabel(value: string): string {
    return this.searchTypeOptions.find(o => o.value === value)?.label || '';
  }

  onDeptInput() {
    const v = this.departmentInput.toLowerCase();
    this.filteredDepartamentos = this.departamentos.map(d => d.nombre).filter(n => n.toLowerCase().includes(v));
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

    const base = this.selectedDepartamento?.id === 0
      ? this.cities
      : this.cities.filter(c => c.departamento_id === this.selectedDepartamento?.id);
    this.filteredCities = base.map(c => c.nombre);
  }

  onCityInput() {
    const v = this.cityInput.toLowerCase();
    const base = this.selectedDepartamento?.id === 0
      ? this.cities
      : this.cities.filter(c => c.departamento_id === this.selectedDepartamento?.id);
    this.filteredCities = base.map(c => c.nombre).filter(n => n.toLowerCase().includes(v));
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

  filterByLocation(item: { ciudad_id: number }): boolean {
    if (this.selectedDepartamento?.id === 0) return true;
    const cityIds = this.cities
      .filter(c => c.departamento_id === this.selectedDepartamento!.id)
      .map(c => c.id);
    return this.selectedCity
      ? item.ciudad_id === this.selectedCity.id
      : cityIds.includes(item.ciudad_id);
  }

  ageGroup(age: number): string {
    if (age <= 11) return 'infancia';
    if (age <= 17) return 'adolescencia';
    if (age <= 26) return 'juventud';
    if (age <= 59) return 'adultez';
    return 'mayores';
  }

  buildPacientesStats(data: Paciente[], titulo: string): CardStats {
    const women = data.filter(p => p.genero === 'Mujer');
    const men = data.filter(p => p.genero === 'Hombre');
    const groups = ['infancia', 'adolescencia', 'juventud', 'adultez', 'mayores'];

    const ageStats: Record<string, { women: number; men: number }> = {};
    groups.forEach(g => { ageStats[g] = { women: 0, men: 0 }; });

    data.forEach(p => {
      const g = this.ageGroup(p.edad);
      if (p.genero === 'Mujer') ageStats[g].women++;
      else if (p.genero === 'Hombre') ageStats[g].men++;
    });

    return {
      titulo,
      total: data.length,
      women: women.length,
      men: men.length,
      active: data.filter(p => p.estado === 'Activo').length,
      inactive: data.filter(p => p.estado !== 'Activo').length,
      ageStats,
      type: 'pacientes'
    } as any;
  }

  search() {
    if (!this.selectedDepartamento) {
      alert('Selecciona un departamento');
      return;
    }

    this.loading = true;
    this.viewMode = null;
    this.groupedCards = [];
    this.detailList = [];
    this.detailInstituciones = [];
    this.detailPacientes = [];
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

        this.viewMode = 'grid';
      }

      // ===================== PACIENTES
      else if (this.searchType === 'pacientes') {
        const data = this.pacientes.filter(p => this.filterByLocation(p));

        this.detailStats = this.buildPacientesStats(data, 'Pacientes');
        this.detailPacientes = data;
        this.viewMode = 'detail';
      }

      // ===================== INSTITUCIONES — agrupa por especialidad
      else if (this.searchType === 'instituciones') {
        const instsEnZona = this.instituciones.filter(i => this.filterByLocation(i));

        // Colectar todas las especialidades cubiertas por estas instituciones
        const especialidadesCubiertas: Record<string, Institucion[]> = {};

        instsEnZona.forEach(inst => {
          // Los especialistas que pertenecen a esta institución
          const specs = this.specialists.filter(s => s.institucion_id === inst.id);
          const especialidades = [...new Set(specs.map(s => s.especialidad))];

          especialidades.forEach(esp => {
            if (!especialidadesCubiertas[esp]) especialidadesCubiertas[esp] = [];
            // Agregar institución si no está ya
            if (!especialidadesCubiertas[esp].find(i => i.id === inst.id)) {
              especialidadesCubiertas[esp].push(inst);
            }
          });
        });

        this.groupedCards = Object.keys(especialidadesCubiertas).map(esp => {
          const insts = especialidadesCubiertas[esp];
          const ips = insts.filter(i => i.tipo === 'IPS').length;
          const profs = insts.filter(i => i.tipo === 'Profesional Médico').length;
          return {
            stats: {
              titulo: esp,
              total: insts.length,
              ips,
              profesionales: profs,
              instituciones: insts.length,
              active: insts.filter(i => i.estado === 'Activo').length,
              inactive: insts.filter(i => i.estado !== 'Activo').length,
              type: 'instituciones_esp'
            },
            list: [],
            instituciones: insts
          };
        });

        this.viewMode = 'grid';
      }

      // ===================== GENERAL
      else if (this.searchType === 'general') {
  const instsEnZona     = this.instituciones.filter(i => this.filterByLocation(i));
  const specsEnZona     = this.specialists.filter(s => this.filterByLocation(s));
  const pacientesEnZona = this.pacientes.filter(p => this.filterByLocation(p));
  const especialidades  = new Set(specsEnZona.map(s => s.especialidad));

  const ips   = instsEnZona.filter(i => i.tipo === 'IPS');
  const profs = instsEnZona.filter(i => i.tipo === 'Profesional Médico');

  this.detailStats = {
    titulo:        this.selectedCity?.nombre || this.selectedDepartamento?.nombre || 'General',
    total:         pacientesEnZona.length,
    women:         pacientesEnZona.filter(p => p.genero === 'Mujer').length,
    men:           pacientesEnZona.filter(p => p.genero === 'Hombre').length,
    active:        pacientesEnZona.filter(p => p.estado === 'Activo').length,
    inactive:      pacientesEnZona.filter(p => p.estado !== 'Activo').length,
    instituciones: instsEnZona.length,
    ips:           ips.length,
    profesionales: profs.length,
    medicos:       specsEnZona.length,
    especialidadesCount: especialidades.size,
    instsActivas:   instsEnZona.filter(i => i.estado === 'Activo').length,
    instsInactivas: instsEnZona.filter(i => i.estado !== 'Activo').length,
    ipsActivas:     ips.filter(i => i.estado === 'Activo').length,
    ipsInactivas:   ips.filter(i => i.estado !== 'Activo').length,
    profsActivos:   profs.filter(i => i.estado === 'Activo').length,
    profsInactivos: profs.filter(i => i.estado !== 'Activo').length,
    type:          'general'
  } as any;

  this.detailPacientes     = pacientesEnZona;
  this.detailInstituciones = instsEnZona;
  this.detailList          = specsEnZona;
  this.viewMode            = 'detail';
}

      this.loading = false;
      this.cdr.detectChanges();
    }, 300);
  }

  selectCard(item: any) {
    this.detailStats = item.stats;

    if (this.searchType === 'especialidades') {
      this.detailList = item.list;
      this.detailInstituciones = this.getInstitucionesForList(item.list);
    }

    if (this.searchType === 'instituciones') {
      this.detailInstituciones = item.instituciones || [];
      this.detailList = [];
    }

    if (this.searchType === 'general') {
      this.detailPacientes = item.pacientes || [];
      this.detailInstituciones = item.instituciones || [];
      this.detailList = item.list || [];
    }

    this.viewMode = 'detail';
    this.cdr.detectChanges();
  }

  getInstitucionesForList(list: Especialista[]): Institucion[] {
    const ids = new Set(list.map(e => e.institucion_id));
    return this.instituciones.filter(i => ids.has(i.id));
  }

  buildStats(list: Especialista[], titulo: string): CardStats {
    const instIds = new Set(list.map(e => e.institucion_id));
    const insts = this.instituciones.filter(i => instIds.has(i.id));
    const ips = insts.filter(i => i.tipo === 'IPS').length;
    const profs = insts.filter(i => i.tipo === 'Profesional Médico').length;

    return {
      titulo,
      total: list.length,
      women: list.filter(e => e.genero === 'Mujer').length,
      men: list.filter(e => e.genero === 'Hombre').length,
      active: list.filter(e => e.estado === 'Activo').length,
      inactive: list.filter(e => e.estado !== 'Activo').length,
      instituciones: insts.length,
      ips,
      profesionales: profs,
      type: 'especialidades'
    };
  }
}