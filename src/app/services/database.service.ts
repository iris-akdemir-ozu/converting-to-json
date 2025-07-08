import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  private apiUrl = "http://localhost:3000/api"

  constructor(private http: HttpClient) {}
  saveCsvData(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/csv-data`, { data })
  }

  getCsvData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/csv-data`)
  }
  deleteAllData(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/csv-data`)
  }
}
