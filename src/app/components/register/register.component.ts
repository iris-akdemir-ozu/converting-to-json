import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  username = ""
  email = ""
  password = ""
  confirmPassword = ""
  isLoading = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/dashboard"])
    }
  }

  onSubmit(): void {
    // Validation
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = "Please fill in all fields"
      return
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match"
      return
    }

    if (this.password.length < 6) {
      this.errorMessage = "Password must be at least 6 characters long"
      return
    }

    this.isLoading = true
    this.errorMessage = ""
    this.successMessage = ""

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log("Registration successful:", response)
        this.isLoading = false
        if (response.success) {
          // Clear the form
          this.username = ""
          this.email = ""
          this.password = ""
          this.confirmPassword = ""

          // Show success message and redirect to login
          this.successMessage = "Registration successful! Redirecting to login..."

          // Logout to clear any stored session and redirect to login
          this.authService.logout()

          setTimeout(() => {
            this.router.navigate(["/login"])
          }, 2000)
        } else {
          this.errorMessage = response.message || "Registration failed"
        }
      },
      error: (error) => {
        console.error("Registration failed:", error)
        this.isLoading = false
        this.errorMessage = error.error?.message || "Registration failed. Please try again."
      },
    })
  }

  goToLogin(): void {
    this.router.navigate(["/login"])
  }
}
