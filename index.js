export function customFilterAndSearch(
  value, // value of the column filter input / table search input, should come from the table's `customFilterAndSearch`
  rowData, // data of a table row, should come from table's `customFilterAndSearch`
  columnField, // name of the table column field
  filtersArray, // all the filters saved from table in a react state -> `useState([])`
  searchTerm, // value of the table search input saved in a react state -> `useState("")`
  lookupColumnFields = [], // array of strings; all the (necessary) fields that should be included for searching based on `searchTerm`, example: ["name", "surname", "birth"]
  FILTER_CONDITION // the condition for Filter to return `true` as in accepted row for display
) {
  // CLEAN UP:
  if (rowData === null && typeof rowData !== "object")
    throw "rowData needs to be an object";

  if (lookupColumnFields.length === 0) {
    lookupColumnFields = [...Object.keys(rowData)];
    searchTerm = searchTerm?.toLowerCase();
  }

  // EXISTANCE OF THE TERM IN ROWDATA:
  const valueExistsInRowData = (field) => {
    const fieldValue = rowData[field];
    // console.log("field", field, rowData[field]);

    if (!fieldValue) return false;

    if (typeof fieldValue === "string") {
      const isTrue = fieldValue.toLowerCase().includes(value);
      return Boolean(isTrue);
    }
    if (typeof fieldValue === "number") {
      const isTrue = fieldValue.toString().includes(value);
      return Boolean(isTrue);
    }
    if (Array.isArray(fieldValue)) {
      fieldValue.forEach(valueExistsInRowData);
    }
    if (typeof fieldValue === "object") {
      Object.keys(fieldValue).forEach(valueExistsInRowData);
    }
  };

  // RULE FOR USING COLUMN INPUT:
  const columFilterValue = filtersArray?.find(
    (filter) => filter.column.field === columnField
  )?.value;

  function termExistsInRow() {
    return lookupColumnFields.some(valueExistsInRowData);
  }

  // ACTION TO EXECUTE
  if (columFilterValue && searchTerm) {
    // console.log(
    //   "%cFILTER SEARCHING...",
    //   "color: white; font-weight: 700; background: green",
    //   value
    // );
    const conditionForFilteringisTrue =
      termExistsInRow() && Boolean(FILTER_CONDITION);
    return conditionForFilteringisTrue ? true : false;
  } else if (columFilterValue) {
    const conditionForFilteringisTrue = Boolean(FILTER_CONDITION);
    return conditionForFilteringisTrue ? true : false;
  } else if (searchTerm) {
    // console.log(
    //   "%cJUST SEARCHING...",
    //   "color: white; font-weight: 700; background-color: red",
    //   value
    // );
    return termExistsInRow() ? true : false;
  } else {
    return true;
  }
}
