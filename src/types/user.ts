export interface User {
  id?: string;  // Make optional for Profile compatibility
  uid: string;
  email: string;
  nombre?: string;  // Make optional for compatibility
  apellido?: string;  // Make optional for compatibility
  telefono: string | number;  // Allow both for Profile compatibility
  createdAt?: string;  // Make optional for compatibility
  updatedAt?: string;  // Make optional for compatibility
  // Profile-compatible properties to enable interoperability  
  primerNombre?: string;  // Make optional for User compatibility
  segundoNombre?: string;
  primerApellido?: string;  // Make optional for User compatibility
  segundoApellido?: string;
  codigoTelefonico?: number;
  fechaNacimiento?: string;
  genero?: string;
  documento?: string;
  tipoDocumento?: string;
  ingresosMensuales?: number;
  egresosMensuales?: number;
  situacionLaboral?: string;
  evaluado?: boolean;
  aprobado?: boolean;
  estado?: string;
  fullTelefono?: number;
}