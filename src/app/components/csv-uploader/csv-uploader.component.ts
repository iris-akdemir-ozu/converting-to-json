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
    const lines = csvContent.split(/[\r\n]+/).filter((line) => line.trim() !== "")

    if (lines.length === 0) {
      throw new Error("CSV file is empty")
    }

    // First line contains headers/properties
    const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""))

    // Convert remaining lines to JSON objects
    const jsonArray: any[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((value) => value.trim().replace(/"/g, ""))

      if (values.length === headers.length) {
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header] = values[index] || ""
        })
        jsonArray.push(obj)
      }
    }

    return {
      properties: headers,
      result: jsonArray,
    }
  }
}
