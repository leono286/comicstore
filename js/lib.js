var lib = {};

lib.loadInitState = function(){
  var initComics = init_state.comics;
  var initEmployees = init_state.employees;
  localStorage.setItem("comics", JSON.stringify(initComics));
  localStorage.setItem("employees", JSON.stringify(initEmployees));
};

lib.showMenu = function(username){
  var menuTemplate = '<div id="menu"><div id="store-logo"><img src="http://cdn2.comicsetc.com.au/skin/frontend/default/comics/images/logo-white-transparent-rotated.png" alt="comic-store-logo"/></div><ul><li class="menuitem user"> <i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i> username</li><li class="menuitem"><a href="#listAll"><i class="fa fa-list" aria-hidden="true"></i> Listar comics</a></li><li class="menuitem"><a href="#addUser"><i class="fa fa-user-plus" aria-hidden="true"></i> Crear usuario</a></li><li class="menuitem"><a href="#addComic"><i class="fa fa-plus" aria-hidden="true"></i> Crear comic</a></li><li class="menuitem"><a href="#logout"><i class="fa fa-user-times" aria-hidden="true"></i> Logout</a></li></ul></div>';

  var content = menuTemplate.replace('username', username);
  $( content ).insertBefore( $('#maincontent') );
};

lib.showSearchBar = function(){
  var searchTemplate = '<div id="searchbar"><label for="search-input"><i class="fa fa-search fa-2x" aria-hidden="true"></i><span class="sr-only">Search icons</span></label><input id="search-input" type="text" placeholder="Busca por título, año o publicador"></div>'

  $('#maincontent').prepend(searchTemplate);
};

lib.showComics = function(comicsArr){
  var comicTemplate = '<div class="comic"><div class="cover"><a href="#showComic-comicId-"><img src="imgurl" alt="comic cover"></a></div><div class="name">comicname</div><div class="house_year">comichouse - comicyear</div><div class="moreinfo"><a href="#showComic-comicId-"><i class="fa fa-plus" aria-hidden="true"></i> info</a></div></div>';
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
  var singleComicTemplate = '<div id="comicinfo"><div class="info"><img src="imageurl" alt="comic_cover_image"><div class="title"><strong>Título:</strong> comicname</div><div class="house"><strong>Publicador:</strong> comichouse</div><div class="year"><strong>Año:</strong> comicyear</div><div class="description"><strong>Descripción:</strong><br/>comicdescription</div></div><div class="comments"><strong>Comentarios:</strong></div></div>';
  var content = singleComicTemplate.replace('imageurl', comic.imgurl);
  content = content.replace('comicname', comic.name);
  content = content.replace('comicyear', comic.year);
  content = content.replace('comichouse', comic.house);
  content = content.replace('comicdescription', comic.description);
  $('#maincontent').append(content);
  if(comic.comments){
    this.showComicComments(comic.comments);
  } else {
      $('#comicinfo .comments').append('<p>No hay comentarios disponibles para este comic.</p>')
  }
  $('#maincontent').append('<a class="button" href="#listAll">Volver al listado</a>');

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
  var formTemplate = '<div id="loginform"><div id="store-logo"><img src="http://cdn2.comicsetc.com.au/skin/frontend/default/comics/images/logo-white-transparent-rotated.png" alt="comic-store-logo"/></div><form><div class="form-input"><input name="username" type="text" placeholder="email"></div><div class="form-input"><input name="password" type="password" placeholder="constraseña"></div><div class="form-controls"><input type="submit" value="Login"></div></form></div>';

  $('#maincontent').addClass('login').append(formTemplate);
};

lib.showNewUserForm = function(){
  var formTemplate = '<div id="newuserform"><form><div class="form-input"><input name="userfirstname" type="text" placeholder="nombre" /></div><div class="form-input"><input name="userlastname" type="text" placeholder="apellidos" /></div><div class="form-input"><input name="email" type="email" placeholder="email" /></div><div class="form-input"><input name="password" type="password" placeholder="contraseña" /></div><div class="form-controls"><input type="button" value="Cancelar" /><input type="submit" value="Crear"></div></form></div>';

  $('#maincontent').append(formTemplate);
};

lib.showNewComicForm = function(){
  var formTemplate = '<div id="newcomicform"><form><div class="form-input"><input name="comicname" type="text" placeholder="nombre" /></div><div class="form-input"><input name="comichouse" type="text" placeholder="publicador" /></div><div class="form-input"><input name="comicyear" type="text" placeholder="año" /></div><div class="form-input"><input name="comiccoverimg" type="text" placeholder="cover url" /></div><div class="form-input"><textarea name="comicdescription"  placeholder="descripción"></textarea></div><div class="form-controls"><input type="button" value="Cancelar" /><input type="submit" value="Crear"></div></form></div>';

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
  var currentLength = this.comics.length;
  var newComicsLength = this.comics.unshift(newComic);
  var success = false;
  if (newComicsLength > currentLength){
    localStorage.setItem("comics", JSON.stringify(this.comics));
    var success = true;
    return success;
  }
  return success;
};
