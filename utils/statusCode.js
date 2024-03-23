const CodeData = {
  OKE: {
    code: 200,
    message: "Oke",
  },
  NOT_FOUND: {
    code: 401,
    message: "Not found",
  },
  INTERNAL_ERROR: {
    code: 500,
    message: "Internal error",
  },
  NOT_FOUND_DOCUMENT: {
    code: 404,
    message: "Document not found",
  },
  PERMISSION_DENY: {
    code: 403,
    message: "Permission deny",
  },
  WORD_INVALID: {
    code: 1001,
    message: "Word submitted invalid",
  },
  ROOM_STATUS_INVALID: {
    code: 1002,
    message: "Room is not in waiting status to start new game",
  },
};

export const Code = CodeData;

export function getMessage(searchCode) {
  const entry = Object.values(CodeData).find(({ code }) => code === searchCode);
  return entry ? entry.message : "Code not found";
}
