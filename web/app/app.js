// Toteuta moduulisi tänne
var MovieApp = angular.module('MovieApp', ['firebase', 'ngRoute'])

        .config(['$httpProvider', function ($httpProvider) {
                delete $httpProvider.defaults.headers.common["X-Requested-With"]
            }])

        .config(function ($routeProvider) {
            $routeProvider

                    .when('/movies', {
                        controller: 'ListController',
                        templateUrl: 'app/views/movies.html',
                        resolve: {
                            currentAuth: function (AuthenticationService) {
                                return AuthenticationService.checkLoggedIn();
                            }
                        }
                    })

                    .when('/login', {
                        controller: 'UserController',
                        templateUrl: 'app/views/login.html',
                        resolve: {
                            currentAuth: function (AuthenticationService) {
                                return AuthenticationService.checkLoggedIn();
                            }
                        }
                    })

                    .when('/register', {
                        controller: 'UserController',
                        templateUrl: 'app/views/register.html',
                        resolve: {
                            currentAuth: function (AuthenticationService) {
                                return AuthenticationService.checkLoggedIn();
                            }
                        }
                    })

                    .when('/movies/new', {
                        controller: 'AddController',
                        templateUrl: 'app/views/new.html',
                        resolve: {
                            currentAuth: function (AuthenticationService) {
                                return AuthenticationService.checkLoggedIn();
                            }
                        }
                    })

                    .when('/movies/:key', {
                        controller: 'ShowController',
                        templateUrl: 'app/views/movie.html',
                        resolve: {
                            currentAuth: function (AuthenticationService) {
                                return AuthenticationService.checkLoggedIn();
                            }
                        }
                    })

                    .when('/movies/:key/edit', {
                        controller: 'editMovieController',
                        templateUrl: 'app/views/edit.html',
                        resolve: {
                            currentAuth: function (AuthenticationService) {
                                return AuthenticationService.checkLoggedIn();
                            }
                        }
                    })

                    .otherwise({
                        redirectTo: '/movies'
                    });
        })

        .controller('ListController', ['$scope', 'FirebaseService', 'APIService', '$location', function ($scope, FirebaseService, APIService, $location) {
                $scope.movies = FirebaseService.getMovies();
                $scope.searchResults = [];
                $scope.search = false;

                $scope.removeMovie = function (movie) {
                    FirebaseService.removeMovie(movie);
                };

                $scope.searchMovie = function () {

                    $scope.search = true;

                    APIService.findMovie($scope.searchName, $scope.searchYear).success(function (movies) {
                        $scope.searchResults = movies.Search;
                        if ($scope.searchResults == null) {
                            $scope.searchResults = [];
                        }
                    });
                };
            }])

        .controller('AddController', function ($scope, FirebaseService, $routeParams, $location, currentAuth) {

            if (!currentAuth) {
                $location.path('/login');
            }

            $scope.movies = FirebaseService.getMovies();

            $scope.addMovie = function () {
                if ($scope.movieName == '' || $scope.movieYear == '' || $scope.movieDirector == '' || $scope.movieDescription == '') {
                    alert('Täytä kaikki tiedot!');
                } else {
                    FirebaseService.addMovie({
                        name: $scope.movieName,
                        year: $scope.movieYear,
                        director: $scope.movieDirector,
                        description: $scope.movieDescription
                    });
                    $scope.movieName = '';
                    $scope.movieYear = '';
                    $scope.movieDirector = '';
                    $scope.moviDescription = '';
                    $location.path('/')
                }
            };

        })

        .controller('ShowController', function ($scope, FirebaseService, $routeParams, $location) {
            FirebaseService.getMovie($routeParams.key, function (data) {
                $scope.movie = data;
            });
        })

        .controller('editMovieController', function ($scope, FirebaseService, $routeParams, $location, currentAuth) {

            if (!currentAuth) {
                $location.path('/login');
            }

            FirebaseService.getMovie($routeParams.key, function (movie) {
                $scope.movie = movie;

                //Lisää sisällön inputteihin 
                $scope.name = movie.name;
                $scope.year = movie.year;
                $scope.director = movie.director;
                $scope.description = movie.description;
            });

            $scope.editMovie = function () {
                if ($scope.name.length !== 0 && $scope.year !== null && $scope.director.length !== 0 && $scope.description.length !== 0) {
                    $scope.movie.name = $scope.name;
                    $scope.movie.year = $scope.year;
                    $scope.movie.director = $scope.director;
                    $scope.movie.description = $scope.description;

                    FirebaseService.editMovie($scope.movie);
                    $location.path('/');
                }
            };
        })

        .controller('UserController', function ($scope, $location, AuthenticationService) {
            $scope.logIn = function () {
                AuthenticationService.logUserIn($scope.email, $scope.password)
                        .then(function () {
                            $location.path('/movies');
                        })
                        .catch(function () {
                            $scope.message = "Väärä sähköpostiosoite tai salasana!";
                        });
            };

            $scope.register = function () {
                AuthenticationService.createUser($scope.newEmail, $scope.newPassword)
                        .then(function () {
                            AuthenticationService.logUserIn($scope.newEmail, $scope.newPassword)
                                    .then(function () {
                                        $location.path('/movies');
                                    });
                        })

                        .catch(function (error) {
                            console.log(error)
                            $scope.message = "Tapahtui virhe! Yritä uudestaan";
                        });
            };
        })

        .run(function (AuthenticationService, $rootScope) {
            $rootScope.logOut = function () {
                AuthenticationService.logUserOut();
            };

            $rootScope.userLoggedIn = function () {
                $rootScope.user = AuthenticationService.getUserLoggedIn();
                return $rootScope.user;
            };
        });