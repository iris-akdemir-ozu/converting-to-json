/**
 * An **interceptor** is like a **middleware** that sits between your Angular app and HTTP requests/responses. 
 * Think of it as a "checkpoint" that can examine and modify every HTTP request
 *  before it's sent and every response before it reaches your component.
 * Think of an interceptor like a **security guard at a building**:

- **Outgoing (Request)**: Guards check everyone leaving, add visitor badges, verify ID
- **Incoming (Response)**: Guards check everyone entering, remove badges, log visits

modifying HTTP request/responses
 */


import { Injectable } from "@angular/core"
import type { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http"
import type { Observable } from "rxjs"
import { AuthService } from "../services/auth.service"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken()

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
      })
      return next.handle(authReq)
    }

    return next.handle(req)
  }
}
