import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import {
  Departamento,
  Ciudad,
  Especialista,
  Institucion,
  Paciente,
  Consultorio
} from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class EspecialistasService {
  private http = inject(HttpClient);

  loadAll(): Observable<[
    Departamento[],
    Ciudad[],
    Especialista[],
    Institucion[],
    Paciente[],
    Consultorio[]
  ]> {
    return forkJoin([
      this.http.get<Departamento[]>('/assets/departamentos_v2.json'),
      this.http.get<Ciudad[]>('/assets/ciudades_v2.json'),
      this.http.get<Especialista[]>('/assets/especialistas_v2.json'),
      this.http.get<Institucion[]>('/assets/instituciones_v1.json'),
      this.http.get<Paciente[]>('/assets/pacientes_v1.json'),

      // 🔥 NUEVO
      this.http.get<Consultorio[]>('/assets/consultorios_v1.json')
    ]);
  }
}