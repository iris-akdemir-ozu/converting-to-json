import { Component, EventEmitter, Output } from "@angular/core"

// Interface for CSV parsing options
interface CsvOptions {
  hasHeader: boolean
  skipEmptyLines: boolean
  selectedDelimiter: string
  doubleQuoteWrap: boolean
}

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
  @Output() onOptionsChange = new EventEmitter<CsvOptions>()

  // Track selected file and upload state
  selectedFile: File | null = null
  isProcessing = false
  hasHeader = true // default to true
  skipEmptyLines = true // default to true (skip empty lines)
  selectedDelimiter = "," 
  doubleQuoteWrap = true

  // Delimiter options for the dropdown
  delimiterOptions = [
    { value: ",", label: "Comma (,)" },
    { value: ";", label: "Semicolon (;)" },
    { value: "|", label: "Pipe (|)" },
    { value: ":", label: "Colon (:)" },
    { value: "\t", label: "Tab" },
  ]

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
        this.onError.emit("Please select a valid file!")
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
   * Emits the current options to parent component
   */
  private emitOptions(): void {
    const options: CsvOptions = {
      hasHeader: this.hasHeader,
      skipEmptyLines: this.skipEmptyLines,
      selectedDelimiter: this.selectedDelimiter,
      doubleQuoteWrap: this.doubleQuoteWrap,
    }
    this.onOptionsChange.emit(options)
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
        this.emitOptions() // Emit current options after successful conversion
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
      headers = this.parseCSVLine(allLines[0])
      console.log("Parsed headers:", headers) // Debug log
      dataLines = allLines.slice(1)
    } else {
      // Generate generic column names based on the first non-empty row's number of columns
      const firstDataRow = allLines.find((line) => line.trim() !== "")
      if (!firstDataRow) {
        throw new Error("No data found in CSV file")
      }
      const firstRowValues = this.parseCSVLine(firstDataRow)
      headers = firstRowValues.map((_, idx) => `column${idx + 1}`)
      dataLines = allLines
    }

    // Convert data lines to JSON objects
    const jsonArray: any[] = []

    for (const line of dataLines) {
      // Skip completely blank lines first
      if (line.trim() === "") {
        continue
      }

      // Check if we should skip this line based on empty row detection
      if (this.skipEmptyLines && this.isEmptyRow(line)) {
        continue // Skip this row
      }

      // Process the row
      const values = this.parseCSVLine(line)

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

    return {
      properties: headers,
      result: jsonArray,
    }
  }

  /**
   * Parses a single CSV line, handling quoted values properly
   * @param line - The CSV line to parse
   * @returns Array of parsed values
   */
  private parseCSVLine(line: string): string[] {
    console.log("Parsing line:", line, "with doubleQuoteWrap:", this.doubleQuoteWrap) // Debug log

    if (!this.doubleQuoteWrap) {
      // Simple split - preserve ALL characters including quotes
      const result = line.split(this.selectedDelimiter)
      return result
    }

    // Complex parsing for quote handling
    const result: string[] = []
    let current = ""
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"' && !inQuotes) {
        // Start of quoted section - don't include the opening quote
        inQuotes = true
      } else if (char === '"' && inQuotes) {
        if (nextChar === '"') {
          // Escaped quote (double quote) - include one quote in the result
          current += '"'
          i++ // Skip next quote
        } else {
          // End of quoted section - don't include the closing quote
          inQuotes = false
        }
      } else if (char === this.selectedDelimiter && !inQuotes) {
        // Delimiter outside quotes - end of field
        result.push(current)
        current = ""
      } else {
        // Regular character
        current += char
      }
      i++
    }

    // Add the last field
    result.push(current)
    return result
  }

  /**
   * Helper method to check if a row is empty
   * @param line - The CSV line to check
   * @returns true if the row is empty or contains only empty quoted values/delimiters/whitespace
   */
  private isEmptyRow(line: string): boolean {
    if (!this.doubleQuoteWrap) {
      // Simple check for non-quote-wrap mode
      const values = line.split(this.selectedDelimiter)
      const hasContent = values.some((value) => {
        const trimmed = value.trim()
        // Consider empty if it's empty, just quotes, or just whitespace
        return trimmed !== "" && trimmed !== '""' && trimmed !== "''"
      })
      return !hasContent
    } else {
      // Parse the line using the same logic as data parsing for quote-wrap mode
      const values = this.parseCSVLine(line)
      // Check if all values are empty after parsing
      const hasContent = values.some((value) => value.trim() !== "")
      return !hasContent
    }
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

  // Called when the delimiter selection changes
  onDelimiterChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }

  // Called when the double quote wrap checkbox is toggled
  onDoubleQuoteWrapChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }
}
