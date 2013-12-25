exports.index = function(req, res){
    //res.render('index.html');
    res.sendfile('/home/nhk/WebstormProjects/ReadingRoom/app/index.html');
};

exports.awesomeThings = function(reg,res){
    res.send(["Ilia", "Alexander"]);
};

exports.addReader = function(reg,res){
  res.send("New reader added");
};

exports.editReader = function(reg,res){
  res.send("Reader edited");
};

exports.deleteReader = function(reg,res){
  res.send("Reader deleted");
};

exports.addBook = function(reg,res){
  res.send("New book added");
};

exports.editBook = function(reg,res){
  res.send("Book edited");
};

exports.deleteBook = function(reg,res){
  res.send("Book deleted");
};