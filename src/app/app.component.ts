import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private authService: AuthService) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.authService.currentUser.next(JSON.parse(storedUser));
      this.authService.isUserLoggedIn = true;
    }
  }
}
