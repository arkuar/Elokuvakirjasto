MovieApp
        .service('FirebaseService', function ($firebaseArray) {
            var firebaseRef = new Firebase('https://elokuvakirjasto-446d1.firebaseio.com/movies');
            var movies = $firebaseArray(firebaseRef);

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
                return $http.get('https://www.omdbapi.com', {params: {s: name, y: year}});
            };
        })

        .service('AuthenticationService', function ($firebaseAuth) {
            var firebaseRef = new Firebase('https://elokuvakirjasto-446d1.firebaseio.com/movies');
            var firebaseAuth = $firebaseAuth(firebaseRef);

            this.logUserIn = function (email, password) {
                return firebaseAuth.$authWithPassword({
                    email: email,
                    password: password
                });
            };

            this.createUser = function (email, password) {
                return firebaseAuth.$createUser({
                    email: email,
                    password: password
                });
            };

            this.checkLoggedIn = function () {
                return firebaseAuth.$waitForAuth();
            };

            this.logUserOut = function () {
                firebaseAuth.$unauth();
            };

            this.getUserLoggedIn = function () {
                return firebaseAuth.$getAuth();
            };
        });