import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';

@Component({
  selector: 'app-login-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})

export class LoginScreen implements OnInit {

  //Inyectamos los servicios que se utilizarán en el componente.
  public router = inject(Router);

  //Se definen las variables globales que se utilizarán en el componente.
  public username: string = '';
  public password: string = '';
  public load: boolean = false;
  public errors: any = {};
  public typeInput: string = 'password';

  constructor() { }

  ngOnInit(): void {
  }

  public login() {}

  public showPassword() {}

  public registrar() {}

  public olvideContrasena() {}

}
