import { Component, EventEmitter, Output } from "@angular/core"

@Component({
  selector: "app-csv-uploader",
  templateUrl: "./csv-uploader.component.html",
  styleUrls: ["./csv-uploader.component.scss"],
})
export class CsvUploaderComponent {
  // Output events to communicate with parent component
  @Output() onConvert = new EventEmitter<any>()
  @Output() onError = new EventEmitter<string>()
  @Output() onFileClear = new EventEmitter<void>()

  // Track selected file and upload state
  selectedFile: File | null = null
  isProcessing = false
  hasHeader = true // default to true
  skipEmptyLines = true // default to true (skip empty lines)

  /**
   * Handles file selection and conversion
   * @param event - File input change event
   */
  onFileSelect(event: any): void {
    const files = event.target.files
    const fileTypes = ["csv"] // Only accept CSV files

    if (files && files.length > 0) {
      const file = files[0]
      const extension = file.name.split(".").pop()?.toLowerCase()
      const isValidFile = extension && fileTypes.includes(extension)

      if (isValidFile) {
        this.selectedFile = file
        this.isProcessing = true
        this.convertCsvToJson(file)
      } else {
        this.onError.emit("Please select a valid CSV file!")
        this.clearSelection()
      }
    }
  }

  /**
   * Clears the selected file and resets the input
   */
  clearSelection(): void {
    this.selectedFile = null
    this.isProcessing = false

    // Reset the file input
    const fileInput = document.getElementById("csvFileInput") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }

    // Emit clear event to parent component
    this.onFileClear.emit()
  }

  /**
   * Converts CSV file to JSON format
   * @param file - The CSV file to convert
   */
  private convertCsvToJson(file: File): void {
    const fileReader = new FileReader()

    fileReader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string
        const jsonResult = this.parseCsvToJson(csvContent)
        this.isProcessing = false
        this.onConvert.emit(jsonResult)
      } catch (error) {
        this.isProcessing = false
        this.onError.emit("Error reading file: " + error)
        this.clearSelection()
      }
    }

    fileReader.onerror = () => {
      this.isProcessing = false
      this.onError.emit("Error reading file")
      this.clearSelection()
    }

    fileReader.readAsText(file, "UTF-8")
  }

  /**
   * Parses CSV content and converts to JSON
   * @param csvContent - Raw CSV content as string
   * @returns Object with properties and result arrays
   */
  private parseCsvToJson(csvContent: string): any {
    const allLines = csvContent.split(/[\r\n]+/)

    if (allLines.length === 0) {
      throw new Error("CSV file is empty")
    }

    let headers: string[]
    let dataLines: string[] = []

    // First, determine headers
    if (this.hasHeader) {
      headers = allLines[0].split(",").map((header) => header.trim().replace(/"/g, ""))
      dataLines = allLines.slice(1)
    } else {
      // Generate generic column names based on the first non-empty row's number of columns
      const firstDataRow = allLines.find((line) => line.trim() !== "")
      if (!firstDataRow) {
        throw new Error("No data found in CSV file")
      }
      headers = firstDataRow.split(",").map((_, idx) => `column${idx + 1}`)
      dataLines = allLines
    }

    // Convert data lines to JSON objects
    const jsonArray: any[] = []

    for (const line of dataLines) {
      // Check if we should skip this line
      if (this.skipEmptyLines && this.isEmptyRow(line)) {
        continue // Skip this row
      }

      // If not skipping empty lines, or if the row has content, process it
      if (!this.skipEmptyLines || !this.isEmptyRow(line)) {
        const values = line.split(",").map((value) => value.trim().replace(/"/g, ""))

        // Ensure we have the right number of columns (pad with empty strings if needed)
        while (values.length < headers.length) {
          values.push("")
        }

        // Only include rows that have the expected number of columns (or fewer)
        if (values.length >= headers.length) {
          const obj: any = {}
          headers.forEach((header, index) => {
            obj[header] = values[index] || ""
          })
          jsonArray.push(obj)
        }
      }
    }

    return {
      properties: headers,
      result: jsonArray,
    }
  }

  /**
   * Helper method to check if a row is empty
   * @param line - The CSV line to check
   * @returns true if the row is empty or contains only commas/whitespace
   */
  private isEmptyRow(line: string): boolean {
    // tüm virgülleri/spaceleri sildikten sonra satır tamamen boşsa true döndürüyor
    const cleanedLine = line.replace(/[\s,]/g, "")
    return cleanedLine === ""
  }

  // Called when the header checkbox is toggled
  onHeaderCheckboxChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }

  // Called when the skip empty lines checkbox is toggled
  onSkipEmptyLinesChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }
}
