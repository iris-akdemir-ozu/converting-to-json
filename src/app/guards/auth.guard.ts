/**
 * security bouncer for Angular routes. checks:
 * permission for visiting the page
 * permission for visiting child routes
 * permission for leaving the page
 * permission for loading the module
 * control page access purpose
 * 
 * ## Summary

- **Guard**: Runs **once** when user navigates to a route
- **Interceptor**: Runs **every time** an HTTP request is made
- **Order**: Guard → Component → HTTP Request → Interceptor


Think of it like this:

- **Guard** = Bouncer at the door (checks once when you enter)
- **Interceptor** = Waiter who brings your orders (works every time you order something)
 */

import { Injectable } from "@angular/core"
import { CanActivate, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true
    } else {
      this.router.navigate(["/login"])
      return false
    }
  }
}
