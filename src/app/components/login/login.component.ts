import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  email = ""
  password = ""
  isLoading = false
  errorMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/dashboard"])
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = "Please fill in all fields"
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log("Login successful:", response)
        this.isLoading = false
        if (response.success) {
          this.router.navigate(["/dashboard"])
        } else {
          this.errorMessage = response.message || "Login failed"
        }
      },
      error: (error) => {
        console.error("Login failed:", error)
        this.isLoading = false
        this.errorMessage = error.error?.message || "Login failed. Please try again."
      },
    })
  }

  goToRegister(): void {
    console.log('Navigating to register page'); // Debugging log
    this.router.navigate(["/register"])
  }
}
