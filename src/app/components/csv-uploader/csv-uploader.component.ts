import { Component, EventEmitter, Output } from "@angular/core";
import { CsvConverterService, CsvOptions } from 'src/app/services/csv-converter.service';

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
  trimWhitespace = true

  constructor(private csvService: CsvConverterService) {}

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
    { value: "carriage-return", label: "Carriage Return(\\r)"},
    {value: "crlf", label: "Carriage Return + Newline (\\r\\n)"},
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
  async onFileSelect(event: any): Promise<void> {
    const files = event.target.files
    // const fileTypes = ["csv"] // Only accept CSV files

    if (files && files.length > 0) {
      const file = files[0]
      this.selectedFile = file
      this.isProcessing = true
      try {
        const jsonResult = await this.csvService.convertFileToJson(file, this.getOptions());
        this.isProcessing = false;
        this.onConvert.emit(jsonResult);
        this.onOptionsChange.emit(this.getOptions());
      } catch (error) {
        this.isProcessing = false;
        this.onError.emit("Error reading file: " + error);
        this.clearSelection();
      }
    }
  }

  getOptions(): CsvOptions {
    return {
      hasHeader: this.hasHeader,
      skipEmptyLines: this.skipEmptyLines,
      selectedDelimiter: this.selectedDelimiter,
      doubleQuoteWrap: this.doubleQuoteWrap,
      selectedRowDelimiter: this.selectedRowDelimiter,
      rowPrefix: this.rowPrefix,
      rowSuffix: this.rowSuffix,
      selectedEncoding: this.selectedEncoding,
      selectedQuoteOption: this.selectedQuoteOption,
      trimWhitespace: this.trimWhitespace,
    };
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
      trimWhitespace: this.trimWhitespace,
    }
    this.onOptionsChange.emit(options)
  }
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


  private async processSelectedFile(): Promise<void> {
    if (this.selectedFile && !this.isProcessing) {
      this.isProcessing = true;
      try {
        const jsonResult = await this.csvService.convertFileToJson(this.selectedFile, this.getOptions());
        this.isProcessing = false;
        this.onConvert.emit(jsonResult);
        this.onOptionsChange.emit(this.getOptions());
      } catch (error) {
        this.isProcessing = false;
        this.onError.emit("Error reading file: " + error);
        this.clearSelection();
      }
    }
  }
  
  // Then, all event handlers become:
  onHeaderCheckboxChange(): void { this.processSelectedFile(); }
  onSkipEmptyLinesChange(): void { this.processSelectedFile(); }
  onDelimiterChange(): void { this.processSelectedFile(); }
  onRowDelimiterChange(): void { this.processSelectedFile(); }
  onRowPrefixChange(): void { this.processSelectedFile(); }
  onRowSuffixChange(): void { this.processSelectedFile(); }
  onDoubleQuoteWrapChange(): void {
    this.selectedQuoteOption = this.doubleQuoteWrap ? "double" : "none";
    this.processSelectedFile();
  }
  onQuoteOptionChange(): void {
    this.doubleQuoteWrap = this.selectedQuoteOption === "double";
    this.processSelectedFile();
  }
  onEncodingChange(): void { this.processSelectedFile(); }
  onTrimWhitespaceChange(): void { this.processSelectedFile(); }
  
}
