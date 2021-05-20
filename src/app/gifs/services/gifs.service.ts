import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey : string = 'KZl20EuNBQyjWSATLltKv1PIrmbSp5B6';
  private servicioUrl : string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(): string[]{ 
    return[...this._historial];
  }

  constructor( private http: HttpClient ) {
    // Primera opción para parsear
    // if( localStorage.getItem( 'historial') ){
    //   this._historial = JSON.parse( localStorage.getItem( 'historial' )! ); 
    // } 
    this._historial = JSON.parse( localStorage.getItem( 'historial' )! ) || [];    
    this.resultados = JSON.parse( localStorage.getItem( 'ultimoResultado' )! ) || [];
  }

  buscarGifs( query: string = ''){
    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes(query) ) { 
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      // Grabar en localstorage
      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );

    }
    
    const params = new HttpParams()
                    .set('api_key', this.apiKey)
                    .set('limit', '10')
                    .set('q', query);

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
    .subscribe( ( resp ) => {
        this.resultados = resp.data;
        localStorage.setItem( 'ultimoResultado', JSON.stringify( resp.data ) );
        console.log( resp.data );
      });
  }

  // EJEMPLO 1 PETICIÓN AL API
  // buscarGifs( query: string = ''){
  //   query = query.trim().toLocaleLowerCase();

  //   if( !this._historial.includes(query) ) { 
  //     this._historial.unshift( query );
  //     this._historial = this._historial.splice(0,10);
  //   }
    
  //   fetch('https://api.giphy.com/v1/gifs/trending?api_key=KZl20EuNBQyjWSATLltKv1PIrmbSp5B6&q=drangon ball z&limit=10').then( resp => {
  //     resp.json().then( data => {
  //       console.log(data);
  //     });
  //   });

  //   console.log(this._historial);
  // }
 
  // EJEMPLO 2 PETICIÓN AL API
  // async buscarGifs( query: string = ''){
  //   query = query.trim().toLocaleLowerCase();

  //   if( !this._historial.includes(query) ) { 
  //     this._historial.unshift( query );
  //     this._historial = this._historial.splice(0,10);
  //   }
    
  //   const resp = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=KZl20EuNBQyjWSATLltKv1PIrmbSp5B6&q=drangon ball z&limit=10');
  //   const data = await resp.json();
  //   console.log(data);
  // }

}
