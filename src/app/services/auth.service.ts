import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, BehaviorSubject } from "rxjs"
import { tap } from "rxjs/operators"

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: User
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000/api"
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    this.loadUserFromStorage()
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, {
        username,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.token && response.user) {
            this.setSession(response.token, response.user)
          }
        }),
      )
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.token && response.user) {
            this.setSession(response.token, response.user)
          }
        }),
      )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUserSubject.next(user)
  }

  private loadUserFromStorage(): void {
    const token = this.getToken()
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        this.currentUserSubject.next(user)
      } catch (error) {
        console.error("Error parsing user from storage:", error)
        this.logout()
      }
    }
  }
}
