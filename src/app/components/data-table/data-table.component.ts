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

  // Limit display to first 10000 rows for performance
  private readonly MAX_DISPLAY_ROWS = 10000

  /**
   * Get data limited to first 1000 rows for display performance
   * @returns Limited array of data for display
   */
  get displayData(): any[] {
    return this.data.slice(0, this.MAX_DISPLAY_ROWS)
  }

  /**
   * Check if data is truncated for display
   * @returns True if data has more than 1000 rows
   */
  get isDataTruncated(): boolean {
    return this.data.length > this.MAX_DISPLAY_ROWS
  }

  /**
   * Get filtered data based on search term (limited to display data)
   * @returns Filtered array of display data
   */
  get filteredData(): any[] {
    if (!this.searchTerm) {
      return this.displayData
    }

    return this.displayData.filter((item) => {
      return Object.values(item).some((value) => String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
    })
  }

  /**
   * Get formatted JSON string for debugging (limited to display data)
   * @returns Formatted JSON string
   */
  getFormattedJson(): string {
    return JSON.stringify(this.filteredData, null, 2)
  }
}
