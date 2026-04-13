export interface Departamento {
  id: number;
  nombre: string;
}

export interface Ciudad {
  id: number;
  nombre: string;
  departamento_id: number;
}

export interface Especialista {
  nombre: string;
  titulo: string;
  edad: number;
  genero: string;
  especialidad: string;
  experiencia: number;
  graduacion: string;
  tipoAfiliacion: string;
  afiliacion: string;
  estado: string;
  ciudad_id: number;
}

export interface CardStats {
  titulo: string;
  total: number;
  women: number;
  men: number;
  active: number;
  inactive: number;
  eps: number;
  ips: number;
  consultorio: number;
}