import { Component, EventEmitter, Output } from "@angular/core"
import { convertToUTF8 } from "src/app/utils/encoding-maps"

// Interface for CSV parsing options
interface CsvOptions {
  hasHeader: boolean
  skipEmptyLines: boolean
  selectedDelimiter: string
  doubleQuoteWrap: boolean
  selectedRowDelimiter: string
  rowPrefix: string
  rowSuffix: string
  selectedEncoding: string
  selectedQuoteOption: string
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
  selectedRowDelimiter = "newline" // default to newline
  rowPrefix = ""
  rowSuffix = ""
  selectedEncoding = "utf-8"
  selectedQuoteOption = "none"

  // Delimiter options for the dropdown
  delimiterOptions = [
    { value: ",", label: "Comma (,)" },
    { value: ";", label: "Semicolon (;)" },
    { value: "|", label: "Pipe (|)" },
    { value: ":", label: "Colon (:)" },
    { value: "\t", label: "Tab" },
    { value: "/", label: "Slash (/)" },
    { value: "#", label: "Hash (#)" },
  ]

  // Row delimiter options for the dropdown
  rowDelimiterOptions = [
    { value: "newline", label: "Newline (\\n)" },
    { value: ",", label: "Comma (,)" },
    { value: ";", label: "Semicolon (;)" },
    { value: "|", label: "Pipe (|)" },
    { value: ":", label: "Colon (:)" },
    { value: "\t", label: "Tab" },
    { value: "/", label: "Slash (/)" },
    { value: "#", label: "Hash (#)" },
  ]
  // Encoding options for the dropdown
  encodingOptions = [
    { value: "utf-8", label: "UTF-8" },
    { value: "utf-8-bom", label: "UTF-8 with BOM" },
    { value: "windows-1254", label: "Windows-1254 (Turkish)" },
    { value: "iso-8859-9", label: "ISO-8859-9 (Turkish)" },
  ]

  // Quote handling options
  quoteOptions = [
    { value: "none", label: "None (No Quote Handling)" },
    { value: "single", label: "Single Quote (')" },
    { value: "double", label: 'Double Quote (")' },
  ]

  get hasPrefixAndSuffix(): boolean {
    return this.rowPrefix.trim() !== "" && this.rowSuffix.trim() !== ""
  }

  get quoteCharacter(): string {
    switch (this.selectedQuoteOption) {
      case "single":
        return "'"
      case "double":
        return '"'
      case "none":
      default:
        return ""
    }
  }
  //quote handling enabled mı değil mi
  get isQuoteHandlingEnabled(): boolean {
    return this.selectedQuoteOption !== "none"
  }

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
      selectedRowDelimiter: this.selectedRowDelimiter,
      rowPrefix: this.rowPrefix,
      rowSuffix: this.rowSuffix,
      selectedEncoding: this.selectedEncoding,
      selectedQuoteOption: this.selectedQuoteOption,
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
        const arrayBuffer = event.target?.result as ArrayBuffer

        // Use the proven Turkish encoding converter
        const csvContent = convertToUTF8(arrayBuffer, this.selectedEncoding)

        console.log(`Converted from ${this.selectedEncoding} to UTF-8:`, csvContent.substring(0, 200))
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

    fileReader.readAsArrayBuffer(file)
  }

  /**
   * Parses CSV content and converts to JSON
   * @param csvContent - Raw CSV content as string
   * @returns Object with properties and result arrays
   */
  private parseCsvToJson(csvContent: string): any {
    let allLines: string[]

    // Priority 1: Use prefix/suffix if both are provided
    if (this.hasPrefixAndSuffix) {
      console.log(`Using prefix/suffix parsing: "${this.rowPrefix}" ... "${this.rowSuffix}"`)
      const prefixSuffixPattern = new RegExp(
        `${this.escapeRegExp(this.rowPrefix)}(.*?)${this.escapeRegExp(this.rowSuffix)}`,
        "gs", // Added 's' flag to make . match newlines as well
      )
      const matches = csvContent.match(prefixSuffixPattern)
      if (matches) {
        allLines = matches.map((match) => {
          // Remove prefix and suffix from each match
          return match.substring(this.rowPrefix.length, match.length - this.rowSuffix.length)
        })
        console.log(`Found ${allLines.length} rows using prefix/suffix`)
      } else {
        console.log("No matches found with prefix/suffix pattern")
        allLines = []
      }
    }
    // Priority 2: Use row delimiter if no prefix/suffix
    else if (this.selectedRowDelimiter === "newline") {
      console.log("Using newline row delimiter")
      allLines = csvContent.split(/[\r\n]+/)
    } else {
      console.log(`Using custom row delimiter: "${this.selectedRowDelimiter}"`)
      // Handle custom row delimiter
      const rowDelimiter = this.selectedRowDelimiter === "\t" ? "\t" : this.selectedRowDelimiter
      allLines = csvContent.split(rowDelimiter)
    }

    if (allLines.length === 0) {
      throw new Error("No data found in file with current parsing settings")
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

    if (!this.isQuoteHandlingEnabled) {
      // Simple split - preserve ALL characters including quotes
      const result = line.split(this.selectedDelimiter)
      return result
    }

    // Complex parsing for quote handling
    const result: string[] = []
    let current = ""
    let inQuotes = false
    let i = 0
    const quoteChar = this.quoteCharacter

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === quoteChar && !inQuotes) {
        // Start of quoted section - don't include the opening quote
        inQuotes = true
      } else if (char === quoteChar && inQuotes) {
        if (nextChar === quoteChar) {
          // Escaped quote (double quote) - include one quote in the result
          current += quoteChar
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
    if (!this.isQuoteHandlingEnabled) {
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
  /**
   * Escapes special regex characters in a string
   * @param string - String to escape
   * @returns Escaped string
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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
  // Called when the row delimiter selection changes
  onRowDelimiterChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }

  // Called when row prefix changes
  onRowPrefixChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }

  // Called when row suffix changes
  onRowSuffixChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }

  // Called when the double quote wrap checkbox is toggled
  onDoubleQuoteWrapChange(): void {
    // Update the quote option based on checkbox
    this.selectedQuoteOption = this.doubleQuoteWrap ? "double" : "none"
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }

  // Called when the quote option selection changes
  onQuoteOptionChange(): void {
    // Update the backward compatibility flag
    this.doubleQuoteWrap = this.selectedQuoteOption === "double"
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }

  // Called when the encoding selection changes
  onEncodingChange(): void {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true
      this.convertCsvToJson(this.selectedFile)
    }
  }
}
