import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

import { AppComponent } from "./app.component"
import { CsvUploaderComponent } from "./components/csv-uploader/csv-uploader.component"
import { DataTableComponent } from "./components/data-table/data-table.component"
import { SearchFilterPipe } from "./pipes/search-filter.pipe"

@NgModule({
  declarations: [AppComponent, CsvUploaderComponent, DataTableComponent, SearchFilterPipe],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
