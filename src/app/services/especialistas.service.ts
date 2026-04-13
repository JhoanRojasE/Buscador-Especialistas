import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Departamento, Ciudad, Especialista } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class EspecialistasService {
  constructor(private http: HttpClient) {}

  loadAll(): Observable<[Departamento[], Ciudad[], Especialista[]]> {
    return forkJoin([
      this.http.get<Departamento[]>('assets/departamentos_v2.json'),
      this.http.get<Ciudad[]>('assets/ciudades_v2.json'),
      this.http.get<Especialista[]>('assets/especialistas_v2.json')
    ]);
  }
}