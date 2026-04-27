export interface Departamento {
  id: number;
  nombre: string;
  codigo_dane: string;
}

export interface Ciudad {
  id: number;
  nombre: string;
  codigo_dane: string;
  departamento_id: number;
}

export interface Institucion {
  id: number;
  nombre: string;
  tipo: string;
  nit: string;
  correo: string;
  telefono_contacto: string | null;
  celular_contacto: string;
  direccion: string;
  ciudad_id: number;
  representante_legal: string;
  correo_representante: string;
  fecha_afiliacion: string;
  fecha_vencimiento_contrato: string;
  estado: string;
  calificacion_promedio: number;
  total_calificaciones: number;
  tiempo_respuesta_promedio_horas: number;
}

export interface Especialista {
  id: number;
  nombre: string;
  titulo: string;
  genero: string;
  fecha_nacimiento: string;
  edad: number;
  numero_documento: string;
  tipo_documento: string;
  registro_medico: string;
  correo: string;
  celular: string;
  ciudad_residencia_id: number;
  ciudad_id: number;
  especialidad: string;
  institucion_id: number;
  fecha_graduacion: string;
  universidad: string;
  experiencia_anos: number;
  fecha_vinculacion: string;
  estado: string;
  total_consultas: number;
  calificacion_promedio: number;
  total_calificaciones: number;
  tiempo_consulta_promedio_min: number;
  disponibilidad_horas_semana: number;
}

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  edad: number;
  genero: string;
  correo: string | null;
  celular: string;
  telefono_fijo: string | null;
  direccion: string;
  ciudad_id: number;
  departamento_id: number;
  estrato: number;
  zona: string;
  grupo_sanguineo: string;
  alergias: string | null;
  antecedentes_personales: string | null;
  total_consultas: number;
  inasistencias: number;
  ultima_consulta: string;
  estado: string;
  roles: string[];
}

export interface CardStats {
  titulo: string;
  total: number;
  women: number;
  men: number;
  active: number;
  inactive: number;
  instituciones: number;
  ips: number;
  profesionales: number;
}