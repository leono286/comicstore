$( document ).ready(function() {

// Check if the app has been run in this browser at least once, if don't the initial state is load.
  if (!localStorage.getItem("comics")) {
    lib.loadInitState();
  }

  lib.comics = JSON.parse(localStorage.getItem('comics'));
  lib.employees = JSON.parse(localStorage.getItem('employees'));

// Check if is a logged in user
  if(localStorage.currentUser){
    var user = lib.validateUser(localStorage.currentUser);
  }


  if (user){
// When a logged in user exists the requestedview is validated
    var requestedview = window.location.hash;
    lib.validateHash(requestedview);

// Once we are sure that a valid view is requested, show the view
    switch (true) {

// listAll the comics
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
            $( this ).remove(); // Remove the button to load more comics when all comics are shown
          }
        });
//Run this srcipt every keyup event in the search bar, the search is performed and the results are updated.
        $('#searchbar input').keyup(function(){
          $('#maincontent .comic').remove();
          lib.showSearchResult($(this).val());
        });
        break;

// logout the user and load login page
      case /^#logout$/.test(requestedview):
        localStorage.setItem('currentUser', '');
        window.location.href = window.location.href.substring(0, window.location.href.indexOf('#'));
        window.location.reload();
        break;

// load the form to add a new user
      case /^#addUser$/.test(requestedview):
        lib.showMenu(user.firstname + ' ' + user.lastname);
        lib.showNewUserForm();
        $( '#newuserform input[type=button]' ).click(function(){
          window.location.hash = '#listAll';
        });
//process the form when submited
        $( '#newuserform' ).submit(function(event){
          event.preventDefault();
          if($(this).find('.messagewarning').html().length > 0){
            $(this).find('.messagewarning').html('');
          }
          var newUser = {};
          newUser.password = $( this ).find('input[name=password]').val();
// password is validated, if doesn't mathc the regex a warning message is shown
// if password is valid save the new user
          if (/^(?=.*[0-9].*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}/.test(newUser.password)){
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
          } else {
            $(this).find('.messagewarning').append('La contraseña debe contener mínimo una mayúscula, 2 números, un carácter especial (!@#$%^&*) y una longitud mínima de 8 caracteres.');
          }
        });
        break;

// load the form to add a new comic
      case /^#addComic$/.test(requestedview):
        lib.showMenu(user.firstname + ' ' + user.lastname);
        lib.showNewComicForm();
        $( '#newcomicform input[type=button]' ).click(function(){
          window.location.hash = '#listAll';
        });
//process the form when submited
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
//once the new comic is saved the new comic information is presented to user
            window.location.hash = '#showComic'+ nextId.toString();
          }
        });
        break;

// show to user the selected comic information
      case /^#showComic[1-9][0-9]*$/.test(requestedview):
        lib.showMenu(user.firstname + ' ' + user.lastname);
        var comicId = requestedview.split('#showComic')[1];
        var comicToShow = lib.comics.filter(function( comic ) {
          return comic.id == comicId;
        })[0];
        lib.showComicInfo(comicToShow);
        break;

// default case - redirect to listAll
      default:
        window.location.hash = '#listAll';

    }
  } else {

// when there is not any logged in user the login form is loaded
    if (window.location.hash){ window.location.hash = ''; } //Remove hash if any

    lib.showLoginForm();
    $( '#loginform' ).submit(function(event){
      event.preventDefault();
      if($(this).find('.loginmessage').html().length > 0){
        $(this).find('.loginmessage').html('');
      }
      var user = lib.validateUser($(this).find('input[name=username]').val());
      if (user && user.password == $(this).find('input[name=password]').val()){
        localStorage.setItem("currentUser", user.email);
        window.location.href += '#listAll';
        window.location.reload();
      } else {
        $(this).find('.loginmessage').append('El usuario o la contraseña son incorrectos.');
      }
    });
  };

// when the location hash changes the page is reloaded to load the new state
  window.onhashchange = function() {
      window.location.reload();
  };
});
