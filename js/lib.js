var lib = {};

lib.loadInitState = function(){
  var initComics = init_state.comics;
  var initEmployees = init_state.employees;
  localStorage.setItem("comics", JSON.stringify(initComics));
  localStorage.setItem("employees", JSON.stringify(initEmployees));
};

lib.showMenu = function(username){
  var menuTemplate = '<div id="menu"><ul><li class="menuitem">username <a href="#logout">(salir)</a></li><li class="menuitem"><a href="#listAll">Listar comics</a></li><li class="menuitem"><a href="#addUser">Crear Usuario</a></li><li class="menuitem"><a href="#addComic">Crear comic</a></li></ul></div>';

  var content = menuTemplate.replace('username', username);
  $( content ).insertBefore( $('#maincontent') );
};

lib.showSearchBar = function(){
  var searchTemplate = '<div id="searchbar"><input type="text" placeholder="Buscar..."></div>'

  $('#maincontent').prepend(searchTemplate);
};

lib.showComics = function(comicsArr){
  var comicTemplate = '<div class="comic"><div class="cover"><a href="#showComic-comicId-"><img src="imgurl" alt="comic cover"></a></div><div class="name">comicname</div><div class="year">comicyear</div><div class="house">comichouse</div><div class="moreinfo"><a href="#showComic-comicId-">more...</a></div></div>';
  comicsArr.forEach( function(comic){
    var content = comicTemplate.replace('imgurl',comic.imgurl);
    content = content.replace('comicname', comic.name);
    content = content.replace('comichouse', comic.house);
    content = content.replace('comicyear', comic.year);
    content = content.replace(/-comicId-/g, comic.id);
    $('#maincontent').append(content);
  })
};

lib.showComicInfo = function(comic){
  var singleComicTemplate = '<div id="comicinfo"><div class="info"><img src="imageurl" alt="comic_cover_image"><div class="title"><strong>Título:</strong> comicname</div><div class="house"><strong>Publicador:</strong> comichouse</div><div class="year"><strong>Año:</strong> comicyear</div><div class="description">comicdescription</div></div><div class="comments"></div></div>';
  var content = singleComicTemplate.replace('imageurl', comic.imgurl);
  content = content.replace('comicname', comic.name);
  content = content.replace('comicyear', comic.year);
  content = content.replace('comichouse', comic.house);
  content = content.replace('comicdescription', comic.description);
  $('#maincontent').append(content);
  if(comic.comments){
    this.showComicComments(comic.comments);
  }
  $('#maincontent').append('<a href="#listAll">Volver al listado</a>');

};

lib.showComicComments = function(commentsArr){
  var commentsTemplate = '<div class="singlecomment"><div class="user">commentuser</div><div class="commentcontent">commenttext</div></div>';
  commentsArr.forEach( function(comment){
    var content = commentsTemplate.replace('commentuser', comment.user);
    content = content.replace('commenttext', comment.comment);
    $('#comicinfo .comments').append(content);
  });
};


lib.showSearchResult = function(inputVal){
  var searchFields = ["name","house","year"];
  var regex = new RegExp(inputVal, "i");
  var comicsToShow = $.grep(lib.listedComics, function(obj){
    var i = 0;
    while (i < searchFields.length) {
      if (obj[searchFields[i]].search(regex) >= 0 ){
        return obj;
      }
      i++;
    }
  });
  this.showComics(comicsToShow);
};

lib.showLoginForm = function(){
  var formTemplate = '<div id="loginform"><form><div class="form-input"><input name="username" type="text" placeholder="email"></div><div class="form-input"><input name="password" type="password" placeholder="constraseña"></div><input type="submit" value="Login"></form></div>';

  $('#maincontent').append(formTemplate);
};

lib.showNewUserForm = function(){
  var formTemplate = '<div id="newuserform"><form><div class="form-input"><input name="userfirstname" type="text" placeholder="nombre" /></div><div class="form-input"><input name="userlastname" type="text" placeholder="apellidos" /></div><div class="form-input"><input name="email" type="email" placeholder="email" /></div><div class="form-input"><input name="password" type="password" placeholder="contraseña" /></div><input type="button" value="Cancelar" /><input type="submit" value="Crear"></form></div>';

  $('#maincontent').append(formTemplate);
};

lib.showNewComicForm = function(){
  var formTemplate = '<div id="newcomicform"><form><div class="form-input"><input name="comicname" type="text" placeholder="nombre" /></div><div class="form-input"><input name="comichouse" type="text" placeholder="publicador" /></div><div class="form-input"><input name="comicyear" type="text" placeholder="año" /></div><div class="form-input"><input name="comiccoverimg" type="text" placeholder="cover url" /></div><div class="form-input"><textarea name="comicdescription"  placeholder="descripción"></textarea></div><input type="button" value="Cancelar" /><input type="submit" value="Crear"></form></div>';

  $('#maincontent').append(formTemplate);
};


lib.validateUser = function(useremail){
  return this.employees.filter(function( employee ) {
    return employee.email == useremail;
  })[0];
};

lib.validateHash = function(hash){
  allowedViews = ['#logout', '#listAll', '#addUser', '#addComic'];
  var allowed = (allowedViews.indexOf(hash) >= 0 || hash.match(/#showComic[1-9][0-9]*$/) != null);
  if (!allowed){
      window.location.hash = '#listAll';
      window.location.reload();
  }
};

lib.addUser = function(newUser){
  var newEmployeesLength = this.employees.push(newUser);
  localStorage.setItem("employees", JSON.stringify(this.employees));
};

lib.addComic = function(newComic){
  var newComicsLength = this.comics.unshift(newComic);
  localStorage.setItem("comics", JSON.stringify(this.comics));
};
