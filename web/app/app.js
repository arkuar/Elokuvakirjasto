// Toteuta moduulisi tänne
var MovieApp = angular.module('MovieApp', ['firebase', 'ngRoute'])

        .config(function ($routeProvider) {
            $routeProvider
                    .when('/', {
                        controller: 'ListController',
                        templateUrl: 'app/views/movies.html'
                    })

                    .when('/movies', {
                        controller: 'ListController',
                        templateUrl: 'app/views/movies.html'
                    })

                    .when('/movies/new', {
                        controller: 'AddController',
                        templateUrl: 'app/views/new.html'
                    })

                    .when('/movies/:key', {
                        controller: 'ShowController',
                        templateUrl: 'app/views/movie.html'
                    })

                    .when('/movies/:key/edit', {
                        controller: 'editMovieController',
                        templateUrl: 'app/views/edit.html'
                    })

                    .otherwise({
                        redirectTo: '/'
                    });
        })

        .controller('ListController', ['$scope', 'FirebaseService', function ($scope, FirebaseService) {
                $scope.movies = FirebaseService.getMovies();

                $scope.removeMovie = function (movie) {
                    FirebaseService.removeMovie(movie);
                };
            }])

        .controller('AddController', ["$scope", "FirebaseService", "$routeParams", "$location", function ($scope, FirebaseService, $routeParams, $location) {
                $scope.movies = FirebaseService.getMovies();

                $scope.addMovie = function () {
                    if ($scope.movieName == null || $scope.movieYear == null || $scope.movieDirector == null || $scope.movieDescription == null) {
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
                        $scope.movieDescription = '';
                        $location.path('/')
                    }
                };

            }])

        .controller('ShowController', function ($scope, FirebaseService, $routeParams, $location) {
            FirebaseService.getMovie($routeParams.key, function (data) {
                $scope.movie = data;
            });
        })

        .controller('editMovieController', function ($scope, FirebaseService, $routeParams, $location) {
            $scope.movies = FirebaseService.getMovies();
            FirebaseService.getMovie($routeParams.key, function (data) {
                $scope.movie = data;
                $scope.movieName = $scope.movie.name;
                $scope.movieDirector = $scope.movie.director;
                $scope.movieYear = $scope.movie.year;
                $scope.movieDescription = $scope.movie.description;
            });

            $scope.editMovie = function (movie) {
                if ($scope.movieName == null || $scope.movieYear == null || $scope.movieDirector == null || $scope.movieDescription == null) {
                    alert('Täytä kaikki tiedot!');
                } else {
                    movie.name = $scope.movieName;
                    movie.year = $scope.movieYear;
                    movie.director = $scope.movieDirector;
                    movie.description = $scope.movieDescription;
                    FirebaseService.editMovie(movie);
                    $location.path('/');
                }

            };
        });