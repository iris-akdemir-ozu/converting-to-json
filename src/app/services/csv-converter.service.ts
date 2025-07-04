import { Injectable } from '@angular/core';
import { convertToUTF8 } from 'src/app/utils/encoding-maps';

export interface CsvOptions {
    hasHeader: boolean;
    skipEmptyLines: boolean;
    selectedDelimiter: string;
    doubleQuoteWrap: boolean;
    selectedRowDelimiter: string;
    rowPrefix: string;
    rowSuffix: string;
    selectedEncoding: string;
    selectedQuoteOption: string;
    trimWhitespace: boolean;
  }


  @Injectable({ providedIn: 'root' })
export class CsvConverterService {
  async convertFileToJson(file: File, options: CsvOptions): Promise<any> {
    const arrayBuffer = await file.arrayBuffer();
    const csvContent = convertToUTF8(arrayBuffer, options.selectedEncoding);
    return this.parseCsvToJson(csvContent, options);
  }

  hasPrefixAndSuffix(options: CsvOptions): boolean {
    return options.rowPrefix.trim() !== "" && options.rowSuffix.trim() !== ""
  }

  quoteCharacter(options: CsvOptions): string {
    switch (options.selectedQuoteOption) {
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
  isQuoteHandlingEnabled(options: CsvOptions): boolean {
    return options.selectedQuoteOption !== "none"
  }

private parseCsvToJson(csvContent: string, options: CsvOptions): any {
    let allLines: string[]

    // Priority 1: Use prefix/suffix if both are provided
    if (this.hasPrefixAndSuffix(options)) {
      console.log(`Using prefix/suffix parsing: "${options.rowPrefix}" ... "${options.rowSuffix}"`)
      const prefixSuffixPattern = new RegExp(
        `${this.escapeRegExp(options.rowPrefix)}(.*?)${this.escapeRegExp(options.rowSuffix)}`,
        "gs", // Added 's' flag to make . match newlines as well
      )
      const matches = csvContent.match(prefixSuffixPattern)
      if (matches) {
        allLines = matches.map((match) => {
          // Remove prefix and suffix from each match
          return match.substring(options.rowPrefix.length, match.length - options.rowSuffix.length)
        })
        console.log(`Found ${allLines.length} rows using prefix/suffix`)
      } else {
        console.log("No matches found with prefix/suffix pattern")
        allLines = []
      }
    }
    // Priority 2: Use row delimiter if no prefix/suffix
    else if (options.selectedRowDelimiter === "newline") {
      console.log("Using newline row delimiter")
      allLines = csvContent.split(/\n/)
    } else if (options.selectedRowDelimiter === "carriage-return") {
      console.log("Using carriage return row delimiter")
      allLines = csvContent.split(/\r/)
    } else if (options.selectedRowDelimiter === "crlf") {
      console.log("Using carriage return + newline row delimiter")
      allLines = csvContent.split(/\r\n/)
    } else {
      console.log(`Using custom row delimiter: "${options.selectedRowDelimiter}"`)
      // Handle custom row delimiter
      const rowDelimiter = options.selectedRowDelimiter === "\t" ? "\t" : options.selectedRowDelimiter
      allLines = csvContent.split(rowDelimiter)
    }

    if (allLines.length === 0) {
      throw new Error("No data found in file with current parsing settings")
    }

    let headers: string[]
    let dataLines: string[] = []

    // First, determine headers
    if (options.hasHeader) {
      headers = this.parseCSVLine(allLines[0], options)
      console.log("Parsed headers:", headers) // Debug log
      dataLines = allLines.slice(1)
      if (options.trimWhitespace) {
        headers = headers.map(header => header.trim())
      }
    } else {
      // Generate generic column names based on the first non-empty row's number of columns
      const firstDataRow = allLines.find((line) => line.trim() !== "")
      if (!firstDataRow) {
        throw new Error("No data found in CSV file")
      }
      const firstRowValues = this.parseCSVLine(firstDataRow, options)
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
      if (options.skipEmptyLines && this.isEmptyRow(line, options)) {
        continue // Skip this row
      }

      // Process the row
      const values = this.parseCSVLine(line, options)

      // Ensure we have the right number of columns (pad with empty strings if needed)
      while (values.length < headers.length) {
        values.push("")
      }

      // Only include rows that have the expected number of columns (or fewer)
      if (values.length >= headers.length) {
        const obj: any = {}
        headers.forEach((header, index) => {
          let value = values[index] || ""
          // Apply trim whitespace if enabled
          if (options.trimWhitespace) {
            value = value.trim()
          }
         obj[header] = value
        })
        jsonArray.push(obj)
      }
    }

    return {
      properties: headers,
      result: jsonArray,
    }
  }

  private parseCSVLine(line: string, options: CsvOptions): string[] {
    console.log("Parsing line:", line, "with doubleQuoteWrap:", options.doubleQuoteWrap) // Debug log

    if (!this.isQuoteHandlingEnabled) {
      // Simple split - preserve ALL characters including quotes
      const result = line.split(options.selectedDelimiter)
      return result
    }

    // Complex parsing for quote handling
    const result: string[] = []
    let current = ""
    let inQuotes = false
    let i = 0
    const quoteChar = this.quoteCharacter(options)

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
      } else if (char === options.selectedDelimiter && !inQuotes) {
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
  private isEmptyRow(line: string, options: CsvOptions): boolean {
    if (!this.isQuoteHandlingEnabled) {
      // Simple check for non-quote-wrap mode
      const values = line.split(options.selectedDelimiter)
      const hasContent = values.some((value) => {
        const trimmed = value.trim()
        // Consider empty if it's empty, just quotes, or just whitespace
        return trimmed !== "" && trimmed !== '""' && trimmed !== "''"
      })
      return !hasContent
    } else {
      // Parse the line using the same logic as data parsing for quote-wrap mode
      const values = this.parseCSVLine(line, options)
      // Check if all values are empty after parsing
      const hasContent = values.some((value) => value.trim() !== "")
      return !hasContent
    }
  }
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }
}