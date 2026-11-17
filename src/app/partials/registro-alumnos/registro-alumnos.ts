import { Component, Input, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { AlumnosService } from '../../services/alumnos-service';
//Importar la interfaz de datos del alumno
import { DatosAlumno } from '../../interfaces/usuarios.interfaces';
import { NotificationService } from '../../services/tools/notification-service';

@Component({
  selector: 'app-registro-alumnos',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos implements OnInit {

  @Input() rol: string = '';
  @Input() datos_user: DatosAlumno = {} as DatosAlumno;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de alumnos para poder registrar y actualizar los datos del alumno
  private alumnosService = inject(AlumnosService);
  //Inyectar el servicio de notificaciones para mostrar mensajes al usuario
  private notificationService = inject(NotificationService);


  //Declarar las variables para el formulario de registro
  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  //Variables para el campo de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor() { }

  ngOnInit(): void {
    //Se inicializa el objeto alumno con el esquema del alumno
    this.alumno = this.alumnosService.esquemaAlumno();
    this.alumno.rol = 'alumno';
    console.log('Datos del alumno:', this.alumno);
  }

  public regresar(): void {
    this.location.back();
  }

  public showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar() {
    // Lógica para validar si el usuario alumno trae datos o no en los campos del formulario
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    console.log('Errores de validación:', this.errors);

    // Si hay errores de validación, no se procede con el registro o actualización
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Lógica para registrar o actualizar los datos del alumno
    this.alumnosService.registrarAlumno(this.alumno).subscribe(
      (response) => {
        //Dentro del response se puede obtener el mensaje de éxito o error del backend, así como los datos del alumno registrado
        console.log('Respuesta del backend:', response);
        this.notificationService.success('Alumno registrado correctamente');
        this.regresar();
      }, (error) => {
        console.error('Error al registrar el alumno:', error);
        this.notificationService.error('Error al registrar el alumno');
      }
    );
  }

  public actualizar() {

  }

  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
