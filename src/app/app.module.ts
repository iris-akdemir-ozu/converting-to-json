import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

import { AppComponent } from "./app.component"
import { CsvUploaderComponent } from "./components/csv-uploader/csv-uploader.component"
import { DataTableComponent } from "./components/data-table/data-table.component"
import { SearchFilterPipe } from "./pipes/search-filter.pipe";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component'
import { AppRoutingModule } from "./app-routing.module"

@NgModule({
  declarations: [AppComponent, CsvUploaderComponent, DataTableComponent, SearchFilterPipe, DashboardComponent, LoginComponent, RegisterComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
