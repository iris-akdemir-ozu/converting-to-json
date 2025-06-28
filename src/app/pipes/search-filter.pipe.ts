import { Pipe, type PipeTransform } from "@angular/core"

@Pipe({
  name: "searchFilter",
})
export class SearchFilterPipe implements PipeTransform {
  /**
   * Filters array based on search term
   * @param items - Array to filter
   * @param searchText - Text to search for
   * @returns Filtered array
   */
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items
    }

    searchText = searchText.toLowerCase()

    return items.filter((item) => {
      return Object.values(item).some((value) => String(value).toLowerCase().includes(searchText))
    })
  }
}
