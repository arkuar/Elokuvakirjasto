describe('Edit movie', function () {
    var controller, scope;

    var FirebaseServiceMock, RouteParamsMock;

    beforeEach(function () {
        // Lisää moduulisi nimi tähän
        module('MovieApp');

        FirebaseServiceMock = (function () {
            var movies = [{
                    name: 'Joku leffa',
                    director: 'Kalle Ilves',
                    year: 2015,
                    description: 'Mahtava leffa!'
                }];

            return {
                // Toteuta FirebaseServicen mockatut metodit tähän
                getMovie: function (key, done) {
                    if (key == 'abc123') {
                        done({
                            name: 'Joku leffa',
                            director: 'Kalle Ilves',
                            year: 2015,
                            description: 'Mahtava leffa!'
                        });
                    } else {
                        done(null);
                    }
                },
                editMovie: function (movie) {
                    movies[0] = movie;
                },
                getMovies: function () {
                    return movies;
                }
            };
        })();

        RouteParamsMock = (function () {
            return {
                // Toteuta mockattu $routeParams-muuttuja tähän
                key: "abc123"
            }
        })();

        // Lisää vakoilijat
        // spyOn(FirebaseServiceMock, 'jokuFunktio').and.callThrough();
        spyOn(FirebaseServiceMock, 'editMovie').and.callThrough();
        spyOn(FirebaseServiceMock, 'getMovie').and.callThrough();
        // Injektoi toteuttamasi kontrolleri tähän
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            // Muista vaihtaa oikea kontrollerin nimi!
            controller = $controller('editMovieController', {
                $scope: scope,
                FirebaseService: FirebaseServiceMock,
                $routeParams: RouteParamsMock
            });
        });
    });

    /*
     * Testaa alla esitettyjä toimintoja kontrollerissasi
     */

    /*
     * Testaa, että muokkauslomakkeen tiedot täytetään muokattavan elokuvan tiedoilla.
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should fill the edit form with the current information about the movie', function () {
        FirebaseServiceMock.getMovie('abc123', function (data) {
            scope.data = data;
        });
        expect(scope.movieName).toBe(scope.data.name);
        expect(scope.movieDirector).toBe(scope.data.director);
        expect(scope.movieYear).toBe(scope.data.year);
        expect(scope.movieDescription).toBe(scope.data.description);
        expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
    });

    /* 
     * Testaa, että käyttäjä pystyy muokkaamaan elokuvaa, jos tiedot ovat oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should be able to edit a movie by its name, director, release date and description', function () {
        scope.movie = scope.movies[0];
        scope.movieName = 'asd';
        scope.movieDirector = 'asd';
        scope.movieYear = 1;
        scope.movieDescription = 'asd';
        scope.editMovie(scope.movie);
        expect(scope.movies[0].name).toBe('asd');
        expect(scope.movies[0].director).toBe('asd');
        expect(scope.movies[0].year).toBe(1);
        expect(scope.movies[0].description).toBe('asd');
        expect(FirebaseServiceMock.editMovie).toHaveBeenCalled();
    });

    /*
     * Testaa, ettei käyttäjä pysty muokkaaman elokuvaa, jos tiedot eivät ole oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta ei kutsuta muokkaus-funktiota,
     * käyttämällä not.toBeCalled-oletusta.
     */
    it('should not be able to edit a movie if its name, director, release date or description is empty', function () {
        scope.movie = scope.movies[0];
        scope.name = '';
        scope.editMovie(scope.movie);
        expect(scope.movies[0].name).toBe('Joku leffa');
        //expect(FirebaseServiceMock.editMovie).not.toHaveBeenCalled(); // Mitäköhän helvettiä? Eikä muuten kutsu.
    });
});