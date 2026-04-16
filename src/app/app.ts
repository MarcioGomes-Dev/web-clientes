import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    Navbar,
    RouterOutlet //Permitir fazer o efeito da SPA - SINGLE PAGE
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
