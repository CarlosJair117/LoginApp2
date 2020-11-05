import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:'
  private apikey = 'AIzaSyCw1nTYbUz9UHNVWTLFzQr3K2IQDT7-qds';

  userToken: string;
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient) {
    
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login( usuario: UsuarioModel){

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        console.log('entra en el rxjs');
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
  }

  nuevoUsuario( usuario: UsuarioModel ){

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        console.log('entra en el rxjs');
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
  }

  private guardarToken(idToken: string ) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString())
  }

  leerToken() {

    if( localStorage.getItem('item') ) {
      this.userToken = localStorage.getItem('item');
    } else {
      this.userToken ='';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {

    if( this.userToken.length < 2){
      return false;
    } 

    const expira = Number( localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    
    if ( expiraDate > new Date()){
      return true;
    } else {
      return false;
    }
  }
}
