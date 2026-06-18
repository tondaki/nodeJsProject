const Controller = require("../controller");
module.exports = new (class extends Controller {
  async updload(req, res) {
    return this.response({
      res,
      msg: "Upload Success",
      data: req.file,
    });
  }
})();
