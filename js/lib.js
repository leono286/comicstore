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
  var comicTemplate = '<div class="comic"><div class="cover"><img src="imgurl" alt="comic cover"></div><div class="name">comicname</div><div class="year">comicyear</div><div class="moreinfo">more...</div></div>';
  comicsArr.forEach(function(comic){
    var content = comicTemplate.replace('imgurl',comic.imgurl);
    content = content.replace('comicname', comic.name);
    content = content.replace('comicyear', comic.year);
    $('#maincontent').append(content);
  })
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
  var allowed = allowedViews.indexOf(hash) >= 0;
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
