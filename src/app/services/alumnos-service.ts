import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ErrorsService } from './tools/errors-service';
import { ValidatorService } from './tools/validator-service';
import { DatosAlumno } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  //Inyectar los servicios para validaciones y errores
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Método para los headers de autenticación que sirven para enviar el token de sesión en las solicitudes HTTP
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  //Método para definir el esquema de validación para los datos del alumno
  public esquemaAlumno(): DatosAlumno {
    return {
      rol: '',
      matricula: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: '',
      curp: '',
      rfc: '',
      edad: '',
      telefono: '',
      ocupacion: ''
    };
  }

  public validarAlumno(data: DatosAlumno, editar: boolean){

    // Lógica de validación para los datos del alumno
    const error: any = {};

    // Letras con acentos, ñ, ü y espacios
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    //Validaciones
    if(!this.validatorService.required(data["matricula"])){
      error["matricula"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["matricula"])){
      error["matricula"] = "El formato es solo números";
    }else if(!this.validatorService.max(data["matricula"], 10)){
      error["matricula"] = this.errorService.max(10);
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }else if(!soloLetras.test(data["first_name"])){
      error["first_name"] = "Solo se permiten letras";
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }else if(!soloLetras.test(data["last_name"])){
      error["last_name"] = "Solo se permiten letras";
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }else if(!this.validatorService.min(data["password"], 8)){
        error["password"] = this.errorService.min(8);
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }else if(data["password"] !== data["confirmar_password"]){
        error["confirmar_password"] = "Las contraseñas no coinciden";
      }
    }

    if(!this.validatorService.required(data["fecha_nacimiento"])){
      error["fecha_nacimiento"] = this.errorService.required;
    }else if(new Date(data["fecha_nacimiento"]) > new Date()){
      error["fecha_nacimiento"] = "La fecha no puede ser futura";
    }

    // El CSS solo cambia lo visual, por eso se pasa a mayúsculas antes de validar
    const curp = String(data["curp"] ?? "").toUpperCase();
    if(!this.validatorService.required(data["curp"])){
      error["curp"] = this.errorService.required;
    }else if(curp.length !== 18){
      error["curp"] = "La CURP debe tener 18 caracteres";
    }else if(!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(curp)){
      error["curp"] = "El formato de la CURP no es válido";
    }

    const rfc = String(data["rfc"] ?? "").toUpperCase();
    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(rfc, 12)){
      error["rfc"] = this.errorService.min(12);
    }else if(!this.validatorService.max(rfc, 13)){
      error["rfc"] = this.errorService.max(13);
    }else if(!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc)){
      error["rfc"] = "El formato del RFC no es válido";
    }

    if(!this.validatorService.required(data["edad"])){
      error["edad"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["edad"])){
      error["edad"] = "El formato es solo números";
    }else if(Number(data["edad"]) < 15){
      error["edad"] = "La edad debe ser mayor o igual a 15";
    }

    // Se quitan los caracteres de la máscara para contar solo los dígitos
    const tel = String(data["telefono"] ?? "").replace(/\D/g, "");
    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }else if(tel.length !== 10){
      error["telefono"] = "El teléfono debe tener 10 dígitos";
    }

    if(!this.validatorService.required(data["ocupacion"])){
      error["ocupacion"] = this.errorService.required;
    }else if(!soloLetras.test(data["ocupacion"])){
      error["ocupacion"] = "Solo se permiten letras";
    }

    //Return JSON con los errores encontrados, si no hay errores el JSON estará vacío
    return error;
  }
}
