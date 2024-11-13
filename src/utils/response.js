const wrapper = require("./wrapper");

const sendResponse = async (result, res) => {
  return result.err
    ? wrapper.response(res, "fail", result)
    : wrapper.response(
        res,
        "success",
        result,
        "Your Request Has Been Processed",
      );
};

module.exports = {
  sendResponse,
};
