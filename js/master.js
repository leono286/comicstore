$( document ).ready(function() {


  if (!localStorage.getItem("comics")) {
    lib.loadInitState();
  }

  lib.comics = JSON.parse(localStorage.getItem('comics'));
  lib.employees = JSON.parse(localStorage.getItem('employees'));

  if(localStorage.currentUser){
    var user = lib.validateUser(localStorage.currentUser);
  }


  if (user){
    var requestedview = window.location.hash;

    lib.validateHash(requestedview);

    switch (true) {

      case /^#listAll$/.test(requestedview):
        lib.listedComics = [];
        lib.showMenu(user.firstname + ' ' + user.lastname);
        lib.showSearchBar();
        $( '<button id="loadmore" type="button" name="button">Mostrar más</button>' ).insertAfter($( '#maincontent') );
        var currentComic = 9;
        var loadPase = 6;
        var comicsToShow = lib.comics.slice(0,currentComic);
        lib.listedComics = comicsToShow;
        lib.showComics(comicsToShow);

        $('button').click(function(){
          if ($('#searchbar input').val().length > 0) {
            $('#searchbar input').val("");
            $('#searchbar input').keyup();
          }
          sliceTop = currentComic + loadPase >= lib.comics.length ? undefined : currentComic + loadPase;
          comicsToShow = lib.comics.slice(currentComic, sliceTop);
          lib.listedComics = lib.listedComics.concat(comicsToShow);
          lib.showComics(comicsToShow);
          currentComic = sliceTop;
          if (!sliceTop){
            $( this ).remove();
          }
        });

        $('#searchbar input').keyup(function(){
          $('#maincontent .comic').remove();
          lib.showSearchResult($(this).val());
        });
        break;

      case /^#logout$/.test(requestedview):
        localStorage.setItem('currentUser', '');
        window.location.href = window.location.href.substring(0, window.location.href.indexOf('#'));
        window.location.reload();
        break;

      case /^#addUser$/.test(requestedview):
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
          var successUser =  lib.addUser(newUser);
          if (successUser){
            $(this).replaceWith('<div class="messagealert"><p>El usuario ha sido creado exitosamente.</p></div>');
          }
        });
        break;

      case /^#addComic$/.test(requestedview):
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
          var success = lib.addComic(newComic);
          if (success){
            window.location.hash = '#showComic'+ nextId.toString();
          }
        });
        break;

      case /^#showComic[1-9][0-9]*$/.test(requestedview):
        lib.showMenu(user.firstname + ' ' + user.lastname);
        var comicId = requestedview.split('#showComic')[1];
        var comicToShow = lib.comics.filter(function( comic ) {
          return comic.id == comicId;
        })[0];
        lib.showComicInfo(comicToShow);
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
