var lib = {};

//load the app's initial state
lib.loadInitState = function(){
  var initComics = init_state.comics;
  var initEmployees = init_state.employees;
  localStorage.setItem("comics", JSON.stringify(initComics));
  localStorage.setItem("employees", JSON.stringify(initEmployees));
};

//load the menu and append it to the html
lib.showMenu = function(username){
  var menuTemplate = '<div id="menu"><div id="store-logo"><img src="http://cdn2.comicsetc.com.au/skin/frontend/default/comics/images/logo-white-transparent-rotated.png" alt="comic-store-logo"/></div><ul><li class="menuitem user"> <i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i> username <div class="mobile_menu_wrapper"><span class="mobile_menu"></span></div></li><li class="menuitem"><a href="#listAll"><i class="fa fa-list" aria-hidden="true"></i> Listar comics</a></li><li class="menuitem"><a href="#addUser"><i class="fa fa-user-plus" aria-hidden="true"></i> Crear usuario</a></li><li class="menuitem"><a href="#addComic"><i class="fa fa-plus" aria-hidden="true"></i> Crear comic</a></li><li class="menuitem"><a href="#logout"><i class="fa fa-user-times" aria-hidden="true"></i> Logout</a></li></ul></div>';

  var content = menuTemplate.replace('username', username);
  $( content ).insertBefore( $('#maincontent') );
  $('.mobile_menu_wrapper').click(function(){
    $(this).closest('ul').toggleClass('active');
    $('div#menu ul li.menuitem:not(.user)').slideToggle();
  });
};

//load the searchbar and append it to the html
lib.showSearchBar = function(){
  var searchTemplate = '<div id="searchbar"><label for="search-input"><i class="fa fa-search fa-2x" aria-hidden="true"></i><span class="sr-only">Search icons</span></label><input id="search-input" type="text" placeholder="Busca por título, año o publicador"></div>'

  $('#maincontent').prepend(searchTemplate);
};

//load the comics to be shown and append them to the html
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

// load the requested comic info and show it.
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

// load the comic comments and show them. If there isn't any comment, a message is shown to user to inform the situation.
lib.showComicComments = function(commentsArr){
  var commentsTemplate = '<div class="singlecomment"><div class="user">commentuser</div><div class="commentcontent">commenttext</div></div>';
  commentsArr.forEach( function(comment){
    var content = commentsTemplate.replace('commentuser', comment.user);
    content = content.replace('commenttext', comment.comment);
    $('#comicinfo .comments').append(content);
  });
};

// this function process the search and show the results
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

// load and shoe the login form when no user is logged in
lib.showLoginForm = function(){
  var formTemplate = '<div id="loginform"><div id="store-logo"><img src="http://cdn2.comicsetc.com.au/skin/frontend/default/comics/images/logo-white-transparent-rotated.png" alt="comic-store-logo"/></div><form><div class="form-input"><input name="username" type="email" placeholder="email" required></div><div class="form-input"><input name="password" type="password" placeholder="constraseña" required><div class="loginmessage"></div></div><div class="form-controls"><input type="submit" value="Login"></div></form></div>';

  $('#maincontent').append(formTemplate);
  $('body, #maincontent').addClass('login');
};

// load and show the form to add a new user
lib.showNewUserForm = function(){
  var formTemplate = '<div id="newuserform"><form><div class="form-input"><input name="userfirstname" type="text" placeholder="nombre" required /></div><div class="form-input"><input name="userlastname" type="text" placeholder="apellidos" required /></div><div class="form-input"><input name="email" type="email" placeholder="email" required /></div><div class="form-input"><input name="password" type="password" placeholder="contraseña" required /><div class="messagewarning"></div></div><div class="form-controls"><input type="button" value="Cancelar" /><input type="submit" value="Crear"></div></form></div>';

  $('#maincontent').append(formTemplate);
};

// load and show the form to add a new comic
lib.showNewComicForm = function(){
  var formTemplate = '<div id="newcomicform"><form><div class="form-input"><input name="comicname" type="text" placeholder="nombre"  required/></div><div class="form-input"><input name="comichouse" type="text" placeholder="publicador"  required/></div><div class="form-input"><input name="comicyear" type="text" placeholder="año"  required/></div><div class="form-input"><input name="comiccoverimg" type="url" placeholder="cover url"  required/></div><div class="form-input"><textarea name="comicdescription"  placeholder="descripción" required></textarea></div><div class="form-controls"><input type="button" value="Cancelar" /><input type="submit" value="Crear"></div></form></div>';

  $('#maincontent').append(formTemplate);
};

// if localStorage.currentUser data exist, this function validates the user belongs to our app, and return the user object whit all the user info
lib.validateUser = function(useremail){
  return this.employees.filter(function( employee ) {
    return employee.email == useremail;
  })[0];
};

// this function validates that the requestedview is in fact one of our app's views, if don't user is redirected to #listAll view
lib.validateHash = function(hash){
  allowedViews = ['#logout', '#listAll', '#addUser', '#addComic'];
  var allowed = (allowedViews.indexOf(hash) >= 0 || hash.match(/#showComic[1-9][0-9]*$/) != null);
  if (!allowed){
      window.location.hash = '#listAll';
      window.location.reload();
  }
};

// save the new user created in #addUser view
lib.addUser = function(newUser){
  var currentLength = this.employees.length;
  var newEmployeesLength = this.employees.push(newUser);
  var success = false;
  if (newEmployeesLength > currentLength){
    localStorage.setItem("employees", JSON.stringify(this.employees));
    var success = true;
    return success;
  }
  return success;
};

// save the new comic created in #newComic view
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
