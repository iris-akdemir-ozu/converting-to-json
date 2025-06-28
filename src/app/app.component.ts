import { Component } from "@angular/core"

// Interface to define the structure of our data
interface TableData {
  [key: string]: any // This allows dynamic properties
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "CSV to JSON Converter"

  // This will store our converted JSON data in memory
  jsonData: TableData[] = []

  // This will store the column headers from CSV
  tableHeaders: string[] = []

  // Search functionality
  searchTerm = ""

  /**
   * This method is called when CSV is successfully converted to JSON
   * @param result - The converted data from CSV uploader component
   */
  onCsvConverted(result: any): void {
    console.log("CSV converted successfully:", result)

    // Store the JSON data in memory for backend usage
    this.jsonData = result.result

    // Store the headers for table display
    this.tableHeaders = result.properties

    // Log the data that would be sent to backend
    console.log("Data ready for backend:", this.jsonData)
  }

  /**
   * This method is called when there's an error in CSV conversion
   * @param error - Error message
   */
  onConversionError(error: string): void {
    console.error("CSV conversion failed:", error)
    alert("Error: " + error)

    // Clear data on error
    this.jsonData = []
    this.tableHeaders = []
  }


  /**
   * This method is called when the user clears/removes the selected file
   */
  onFileClear(): void {
    console.log("File selection cleared - resetting table data")

    // Clear all data to return to initial state
    this.jsonData = []
    this.tableHeaders = []
    this.searchTerm = ""

    console.log("Table data cleared successfully")
  }
  /**
   * Method to simulate sending data to backend
   * In a real application, you would make an HTTP request here
   */
  sendToBackend(): void {
    if (this.jsonData.length === 0) {
      alert("No data to send. Please upload a CSV file first.")
      return
    }

    // This is where you would make your HTTP request to the backend
    console.log("Sending to backend:", this.jsonData)
    alert("Data would be sent to backend (check console for details)")
  }
}
