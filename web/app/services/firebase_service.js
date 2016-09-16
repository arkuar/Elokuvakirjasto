var config = {
    apiKey: "AIzaSyDKVxrUDFeS1xbd8ZpuHIZDDxQdBALDWN8",
    authDomain: "elokuvakirjasto-446d1.firebaseapp.com",
    databaseURL: "https://elokuvakirjasto-446d1.firebaseio.com",
    storageBucket: "elokuvakirjasto-446d1.appspot.com",
};
var firebaseRef = firebase.initializeApp(config);

MovieApp
        .service('FirebaseService', function ($firebaseArray) {
            var ref = firebase.database().ref().child("movies");
            var movies = $firebaseArray(ref);

            this.getMovies = function () {
                return movies;
            };

            this.addMovie = function (movie) {
                movies.$add(movie);
            };

            this.getMovie = function (key, done) {
                movies.$loaded(function () {
                    done(movies.$getRecord(key));
                });
            };

            this.removeMovie = function (movie) {
                movies.$remove(movie);
            };

            this.editMovie = function (movie) {
                movies.$save(movie);
            };

        })

        .service('APIService', function ($http) {
            this.findMovie = function (name, year) {
                return $http.get('https://www.omdbapi.com', {params: {s: name, y: year, type: 'movie'}});
            };
        })

        .service('AuthenticationService', function ($firebaseAuth) {
            var auth = firebaseRef.auth();
            var firebaseAuth = $firebaseAuth(auth);

            this.logUserIn = function (email, password) {
                return firebaseAuth.$signInWithEmailAndPassword(email, password)
            };

            this.createUser = function (email, password) {
                return firebaseAuth.$createUserWithEmailAndPassword(email, password)
            };

            this.checkLoggedIn = function () {
                var user = auth.currentUser;
                if (user) {
                    // User is signed in.
                    return user;
                } else {
                    // No user is signed in.
                    return null;
                }
            };

            this.logUserOut = function () {
                firebaseAuth.$signOut().then(function () {
                    //Sign out succesfull
                }, function (error) {
                    //An error happened
                    console.log(error);
                });
            };

            this.getUserLoggedIn = function () {
                var user = auth.currentUser;

                if (user) {
                    // User is signed in.
                    return user;
                } else {
                    // No user is signed in.
                    return null;
                }
            };
        });