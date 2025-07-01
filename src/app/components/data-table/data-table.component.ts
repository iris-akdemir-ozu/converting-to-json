import { Component, Input } from "@angular/core"

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
})
export class DataTableComponent {
  // Input properties from parent component
  @Input() data: any[] = []
  @Input() headers: string[] = []
  @Input() searchTerm = ""
  @Input() hasHeader = true // New input to know if file has header
  @Input() showQuotes = false // New input to know if quotes should be visible

  /**
   * Get filtered data based on search term
   * @returns Filtered array of data
   */
  get filteredData(): any[] {
    if (!this.searchTerm) {
      return this.data
    }

    return this.data.filter((item) => {
      return Object.values(item).some((value) => String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
    })
  }
}
