import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from '../infrastructure/presentation/shared/components/menu/nav-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent], 
  template: `
    <app-nav-menu></app-nav-menu> 
    
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background-color: #f5f7fa; }
    main { padding: 20px; }
  `]
})
export class AppComponent { }