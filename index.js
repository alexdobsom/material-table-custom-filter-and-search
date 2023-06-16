export function customFilterAndSearch(
  /** value of the column filter input / table search input, should come from the table's `customFilterAndSearch` */
  value = "",
  /** data of a table row, should come from table's `customFilterAndSearch` */
  rowData = {},
  /** name of the table column field */
  columnField = "",
  /** all the filters saved from table in a react state -> `useState([])` */
  filters = [],
  /** value of the table search input saved in a react state -> `useState("")` */
  searchTerm = "",
  /** array of strings; all the (necessary) fields that should be included for searching based on `searchTerm`, example: ["name", "surname", "birth"] */
  lookupRowData = [],
  /** the condition for Filter to return `true` as in accepted row for display */
  CONDITION,
  /** wheater to enable console log for debug */
  debug = false
) {
  // CLEAN UP:
  if (!value)
    throw "material-table-custom-filter-and-search says: \nNo value provided as a first function argument!";

  if (rowData === null && typeof rowData !== "object")
    throw "material-table-custom-filter-and-search says: \nrowData needs to be an object!";

  if (lookupRowData.length === 0) {
    lookupRowData = [...Object.keys(rowData)];
    searchTerm = searchTerm?.toLowerCase();
  }
  debug & console.table(arguments);
  // EXISTANCE OF THE TERM IN ROWDATA:
  const valueExistsInRowData = (field) => {
    const fieldValue = rowData[field];
    // console.log("field", field, rowData[field]);

    if (!fieldValue) return false;

    if (typeof fieldValue === "string") {
      const isTrue = fieldValue.toLowerCase().includes(value.toLowerCase());
      return Boolean(isTrue);
    }
    if (typeof fieldValue === "number") {
      const isTrue = fieldValue.toString().includes(value.toLowerCase());
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
  const columFilterValue = filters?.find(
    (filter) => filter.column.field === columnField
  )?.value;

  function termExistsInRow() {
    return lookupRowData.some(valueExistsInRowData);
  }

  // ACTION TO EXECUTE
  if (columFilterValue && searchTerm) {
    // console.log(
    //   "%cFILTER SEARCHING...",
    //   "color: white; font-weight: 700; background: green",
    //   value
    // );
    const conditionForFilteringisTrue = termExistsInRow() && Boolean(CONDITION);
    return conditionForFilteringisTrue ? true : false;
  } else if (columFilterValue) {
    const conditionForFilteringisTrue = Boolean(CONDITION);
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
