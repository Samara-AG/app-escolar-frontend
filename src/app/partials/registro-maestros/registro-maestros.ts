import { Component, Input, OnInit, inject} from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Location } from '@angular/common';
import { MaestrosService } from '../../services/maestros-service';
//Importar la interfaz de datos del maestro
import { DatosMaestro } from '../../interfaces/usuarios.interfaces';


@Component({
  selector: 'app-registro-maestros',
  imports: [
    ... SHARED_IMPORTS
  ],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {

  @Input() rol: string = '';
  @Input() datos_user: DatosMaestro = {} as DatosMaestro;

  //Inyectar el servicio Location para poder regresar a la página anterior
  private location = inject(Location);
  //Inyectar el servicio de maestros para poder registrar y actualizar los datos del maestro
  private maestrosService = inject(MaestrosService);


  //Declarar las variables para el formulario de registro
  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  //Variables para el campo de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  //Opciones para el select de área de investigación
  public areas: string[] = [
    'Desarrollo Web',
    'Programación',
    'Bases de datos',
    'Redes',
    'Matemáticas',
    'Inteligencia Artificial'
  ];

  //Lista de materias que puede impartir el maestro
  public materias: string[] = [
    'Aplicaciones Web',
    'Programación',
    'Bases de datos',
    'Tecnologías Web',
    'Minería de datos',
    'Desarrollo móvil',
    'Estructuras de datos',
    'Administración de redes',
    'Ingeniería de software',
    'Administración de S.O.'
  ];

  constructor() { }

  ngOnInit(): void {
    //Se inicializa el objeto maestro con el esquema del maestro
    this.maestro = this.maestrosService.esquemaMaestro();
    console.log('Datos del maestro:', this.maestro);
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

  //Agrega o quita la materia del arreglo según el checkbox
  public checkboxChange(event: Event, materia: string): void {
    const marcado = (event.target as HTMLInputElement).checked;
    if (marcado) {
      this.maestro.materias_json.push(materia);
    } else {
      this.maestro.materias_json = this.maestro.materias_json.filter((m: string) => m !== materia);
    }
  }

  //Revisa si la materia ya está seleccionada (para mantener marcado el checkbox al editar)
  public revisarSeleccion(materia: string): boolean {
    return this.maestro.materias_json.includes(materia);
  }

  public registrar(){
    // Lógica para validar si el usuario maestro trae datos o no en los campos del formulario
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    console.log('Errores de validación:', this.errors);

    // Si hay errores de validación, no se procede con el registro o actualización
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    //Lógica para registrar o actualizar los datos del maestro
    // TODO: Aquí se debe implementar la lógica para registrar o actualizar los datos del maestro en el backend, utilizando el servicio de maestros.

  }

  public actualizar(){

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
