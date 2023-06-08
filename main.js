function customFilterAndSearch(
  value, // value of the column filter input / table search input, should come from the table's `customFilterAndSearch`
  rowData, // data of a table row, should come from table's `customFilterAndSearch`
  columnField, // name of the table column field
  filtersArray, // all the filters saved from table in a react state -> `useState([])`
  searchTerm, // value of the table search input saved in a react state -> `useState("")`
  lookupColumnFields = [], // array of strings; all the (necessary) fields that should be included for searching based on `searchTerm`, example: ["name", "surname", "birth"]
  FILTER_CONDITION // the condition for Filter to return `true` as in accepted row for display
) {
  
  if (rowData !== null && typeof rowData === "object" ) throw "rowData needs to be an object";

  if (lookupColumnFields.length === 0)
    lookupColumnFields = [...Object.keys(rowData)];

  // CONDITION FOR FILTER SEARCH:

  const termExistsOnRow = (field) => {
    let searchTermIsFoundInRow = null;
    const fieldValue = rowData[field];
    
    if (filterValue === null) return false;
    
    if (typeof fieldValue === "string") {
      const isTrue = fieldValue
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (isTrue) {
        return (searchTermIsFoundInRow = fieldValue);
      }
    }
    if (typeof fieldValue === "number") {
      const isTrue = fieldValue.toString().includes(searchTerm);
      if (isTrue) {
        return (searchTermIsFoundInRow = fieldValue);
      }
    }
    if (Array.isArray(fieldValue)) {
      const isTrue = fieldValue
        .map((field) => field.toLowerCase())
        .includes(searchTerm.toLowerCase());
      if (isTrue) {
        return (searchTermIsFoundInRow = fieldValue);
      }
    }
    if (typeof fieldValue === "object") {
      Object.keys(fieldValue)
        .forEach(termExistsOnRow);


}
    return searchTermIsFoundInRow ? true : false;
  };

  const columFilterValue = filtersArray.find(
    (filter) => filter.column.field === columnField
  )?.value;

  if (FILTER_CONDITION && columFilterValue) {
    // FLTER SEARCH

    const termExistsInAnyCell = lookupColumnFields.some(termExistsOnRow);

    // examples of FILTER_CONDITION:
    // rowData[columnField].includes(value);
    // or
    // rowData[columnField].length > value.length;

    const conditionForFilteringisTrue = termExistsInAnyCell && FILTER_CONDITION;

    return conditionForFilteringisTrue ? true : false;
  } else {
    // TABLE SEARCH
    // const conditionForSearch = rowData[columnField].includes(searchTerm);
    const conditionForSearch = termExistsOnRow(columnField);

    return conditionForSearch ? true : false;
  }
}
