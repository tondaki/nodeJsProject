const controller = require("../controller");
module.exports = new (class extends controller {
  async deleteUser(req, res) {
    const user = await this.User.findById(req.user._id);
    if (!user) {
      return this.response({
        res,
        code: 403,
        msg: "User not found",
      });
    }
    user.deleted = true;
    await user.save();
  }
  async getUsers(req, res) {
    const user = await this.User.findById(req.user._id);
    if (!user) {
      return this.response({
        res,
        code: 403,
        msg: "User not found",
      });
    }
    return this.response({
      res,
      data: user,
      msg: "getting user",
    });
  }
})();
