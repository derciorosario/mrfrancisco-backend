
const upload = async function(req, res) {
    res.send(req.file.filename);
}
module.exports={
      upload,
}