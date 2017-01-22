$( document ).ready(function() {


  if (localStorage.getItem("comics")) {
    lib.comics = JSON.parse(localStorage.getItem('comics'));
    lib.employees = JSON.parse(localStorage.getItem('employees'));
  } else {
    lib.comics = init_state.comics;
    lib.employees = init_state.employees;
    localStorage.setItem("comics", JSON.stringify(lib.comics));
    localStorage.setItem("employees", JSON.stringify(lib.employees));
  }

  if(localStorage.currentUser){
    var user = lib.validateUser(localStorage.currentUser);
  }


  if (user){
    var requestedview = window.location.hash;

    lib.validateHash(requestedview);

    switch (requestedview) {
      case '#listAll':
        lib.showMenu(user.firstname + ' ' + user.lastname);
        $( '<button type="button" name="button">Cargar comics</button>' ).insertAfter($( '#maincontent') );
        var currentComic = 3;
        var loadPase = 2;
        var comicsToShow = lib.comics.slice(0,currentComic);
        lib.showComics(comicsToShow);

        $('button').click(function(){
          sliceTop = currentComic + loadPase >= lib.comics.length ? undefined : currentComic + loadPase;
          lib.showComics(lib.comics.slice(currentComic, sliceTop));
          currentComic = sliceTop;
          if (!sliceTop){
            $( this ).remove();
          }
        });
        break;

      case '#logout':
        localStorage.setItem('currentUser', '');
        window.location.href = window.location.href.substring(0, window.location.href.indexOf('#'));
        window.location.reload();
        break;

      case '#addUser':
        lib.showMenu(user.firstname + ' ' + user.lastname);
        lib.showNewUserForm();
        $( '#newuserform input[type=button]' ).click(function(){
          window.location.hash = '#listAll';
        });
        $( '#newuserform' ).submit(function(event){
          event.preventDefault();
          var newUser = {};
          var nextId =  Math.max.apply(null, lib.employees.map(function(employee) {return employee.id;})) + 1;
          newUser.id = nextId;
          newUser.firstname = $( this ).find('input[name=userfirstname]').val();
          newUser.lastname = $( this ).find('input[name=userlastname]').val();
          newUser.email = $( this ).find('input[name=email]').val();
          newUser.password = $( this ).find('input[name=password]').val();
          lib.addUser(newUser);
        });
        break;

      case '#addComic':
        lib.showMenu(user.firstname + ' ' + user.lastname);
        lib.showNewComicForm();
        $( '#newcomicform input[type=button]' ).click(function(){
          window.location.hash = '#listAll';
        });
        $( '#newcomicform' ).submit(function(event){
          event.preventDefault();
          var newComic = {};
          var nextId =  Math.max.apply(null, lib.comics.map(function(comic) {return comic.id;})) + 1;
          newComic.id = nextId;
          newComic.name = $( this ).find('input[name=comicname]').val();
          newComic.house = $( this ).find('input[name=comichouse]').val();
          newComic.year = $( this ).find('input[name=comicyear]').val();
          newComic.imgurl = $( this ).find('input[name=comiccoverimg]').val();
          newComic.description = $( this ).find('textarea').val();
          lib.addComic(newComic);
        });
        break;
      default:
        lib.showMenu(user.firstname + ' ' + user.lastname);
        console.log('en otra vista');

    }
  } else {

    if (window.location.hash){ window.location.hash = ''; } //Remove hash if any

    lib.showLoginForm();
    $( '#loginform' ).submit(function(event){
      event.preventDefault();
      var user = lib.validateUser($(this).find('input[name=username]').val());
      if (user && user.password == $(this).find('input[name=password]').val()){
        localStorage.setItem("currentUser", user.email);
        window.location.href += '#listAll';
        window.location.reload();
      }
    });
  };

  window.onhashchange = function() {
      window.location.reload();
  };
});
