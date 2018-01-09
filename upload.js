const fs = require('fs');
const path = require('path');

const uploadFile = (req, res) =>{
	if (!req.files) return res.status(400).send('No files were uploaded.');
	const {sampleFile} = req.files;
	console.log(sampleFile);
	fs.writeFile(path.join(__dirname, `/public/upload/`, sampleFile.name), sampleFile.data, (err) => res.json({err}));
}

module.exports = uploadFile;