// Toteuta moduulisi tänne
var MovieApp = angular.module('MovieApp', ['firebase', 'ngRoute'])

        .config(['$httpProvider', function ($httpProvider) {
                delete $httpProvider.defaults.headers.common["X-Requested-With"];
            }])

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

        .controller('ListController', ['$scope', 'FirebaseService', 'APIService', function ($scope, FirebaseService, APIService) {
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
                        console.log($scope.searchResults);
                        if ($scope.searchResults == null) {
                            $scope.searchResults = [];
                        }
                    });
                };
            }])

        .controller('AddController', ["$scope", "FirebaseService", "$routeParams", "$location", function ($scope, FirebaseService, $routeParams, $location) {
                $scope.movies = FirebaseService.getMovies();

                $scope.addMovie = function () {
                    if ($scope.name == '' || $scope.year == null || $scope.director == '' || $scope.description == '') {
                        alert('Täytä kaikki tiedot!');
                    } else {
                        FirebaseService.addMovie({
                            name: $scope.name,
                            year: $scope.year,
                            director: $scope.director,
                            description: $scope.description
                        });
                        $scope.name = '';
                        $scope.year = '';
                        $scope.director = '';
                        $scope.description = '';
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
        });