const validOperators = [
  "equals",
  "not",
  "in",
  "notIn",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "mode",
  "search",
  "has",
  "hasEvery",
  "hasSome",
];

function isMultiValOp(paramOp) {
  return (
    /in/.test(paramOp) ||
    paramOp === "in" ||
    paramOp === "notIn" ||
    paramOp === "hasEvery" ||
    paramOp === "hasSome"
  );
}

const defaultAutoDetectTypes = [
  { fieldPattern: /^is/, dataType: "bool" },
  { fieldPattern: /_date$/, dataType: "date" },
  { valuePattern: /^[0-9]+$/, dataType: "int" },
  { valuePattern: /^[0-9]*\.[0-9]+$/, dataType: "float" },
  { valuePattern: /^(true|false|yes|no)$/i, dataType: "bool" },
  { valuePattern: /^[0-9][0-9-: ]+$/, dataType: "date" },
];

const defaultDataTypeConverters = {
  string(str) {
    return str;
  },
  int(str) {
    const i = parseInt(str, 10);
    return Number.isNaN(i) ? undefined : i;
  },
  float(str) {
    const i = parseFloat(str);
    return Number.isNaN(i) ? undefined : i;
  },
  date(str) {
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? undefined : d;
  },
  bool(str) {
    // no, false, 0 => false. Others, (including '', eg, for checkboxes) is considered true.
    return !/^n|^f/i.test(str) || str === "0";
  },
};

export default function (params, fieldsArg, validate) {
  const fields = fieldsArg || {};
  const errors = [];
  const filter = {};

  const autoDetectTypes = defaultAutoDetectTypes;
  const dataTypeConverters = defaultDataTypeConverters;

  Object.entries(params).forEach((ele) => {
    const paramSpec = ele[0];
    if (paramSpec.startsWith("__")) return;

    const paramParts = paramSpec.split("__");
    const paramName = paramParts[0];
    let paramOp;

    // Determine and validate the operator, or default to eq
    if (paramParts.length > 1) {
      // We have an explicitly specified operator with the parameter
      paramOp = paramParts[1];
      if (validOperators.indexOf(paramOp) === -1) {
        errors.push(`Invalid operator: ${paramOp}`);
        paramOp = "equals";
      }
    } else {
      paramOp = "equals";
    }

    /*
     * Split a single value into an array of values if the operator is a multi-valued one.
     * Also convert a single value to an array so that we can deal with it consistently,
     * while further processing each value.
     */
    let paramValues = ele[1];
    if (!Array.isArray(paramValues)) {
      if (isMultiValOp(paramOp)) {
        // Split the paramValue on a comma, eg, country__in=US,UK
        paramValues = paramValues.split(",");
      } else {
        // make it an array with one element
        paramValues = [paramValues];
      }
    }

    /*
     * Find the data type of the parameter/field. If we have to validate
     */
    let dataTypeT = "string";
    if (fields[paramName]) {
      if (fields[paramName].dataType) {
        dataTypeT = fields[paramName].dataType;
      }
    } else {
      if (validate) {
        errors.push(`Missing field spec: ${paramName}`);
      }
      for (let i = 0; i < autoDetectTypes.length; i += 1) {
        const ad = autoDetectTypes[i];
        if (
          (ad.valuePattern && ad.valuePattern.test(paramValues[0])) ||
          (ad.fieldPattern && ad.fieldPattern.test(paramName))
        ) {
          dataTypeT = ad.dataType;
          break;
        }
      }
    }

    /*
     * Data type conversions
     */
    const converter = dataTypeConverters[dataTypeT];
    try {
      paramValues = paramValues.map(converter);
    } catch (e) {
      paramValues = [undefined];
    }
    if (paramValues.some((v) => v === undefined)) {
      errors.push(`Error converting to ${dataTypeT}: ${params[paramSpec]}`);
    }

    /**
     * Form the filter, the operator tells us how to deal with the paramValues.
     */
    const value =
      paramValues.length > 1 || isMultiValOp(paramOp)
        ? paramValues
        : paramValues[0];

    if (!filter[paramName]) {
      filter[paramName] = {
        [paramOp]: value,
      };
    } else {
      filter[paramName] = {
        ...filter[paramName],
        [paramOp]: value,
      };
    }
  });

  let limit = 10;
  let skip = 0;
  if (params.__limit) {
    limit = parseInt(params.__limit, 10);
  }
  if (params.__page) {
    const page = parseInt(params.__page, 10) || 0;
    skip = page * limit;
  }

  const sort = {};
  const sortFieldStr = params.__sort ? params.__sort : "-createdAt";
  const sortSpecs =
    typeof sortFieldStr === "string" ? sortFieldStr.split(",") : sortFieldStr;
  sortSpecs.forEach((s) => {
    let direction = "asc";
    let sortField = s;
    if (s.substr(0, 1) === "-") {
      // eg -age
      sortField = s.substr(1);
      direction = "desc";
    }
    if (validate && !fields[sortField]) {
      errors.push(`Invalid sort field: ${sortField}`);
    }
    sort[sortField] = direction;
  });

  if (errors.length > 0) throw errors;

  return {
    filter,
    sort,
    limit,
    skip,
  };
};
