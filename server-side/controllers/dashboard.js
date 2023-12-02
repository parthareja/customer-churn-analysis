export const testRoute = (req, res) => {
  res.send("reached final endpoint");
};

export const excelUpload = async (req, res) => {
  const file_name = req.file.originalname.slice(0, -4);
  await axios
  res.json("File " + file_name +  " written to disk");
}