describe('Edit movie', function () {
    var controller, scope;

    var FirebaseServiceMock, RouteParamsMock;

    beforeEach(function () {
        // Lisää moduulisi nimi tähän
        module('MovieApp');

        FirebaseServiceMock = (function () {
            var movie =
                    {
                        name: 'The Matrix',
                        year: 1999,
                        director: 'The Wachowski Brothers',
                        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
                    };


            return {
                // Toteuta FirebaseServicen mockatut metodit tähän
                getMovie: function (key, done) {
                    if (key === 'abc123') {
                        done(movie);
                    } else {
                        done(null);
                    }
                },
                editMovie: function (edit) {
                    movie = edit;
                },
//                getMovies: function () {
//                    return movies;
//                },
                isValid: function (movie) {
                    return movie.name && movie.year && movie.director && movie.description;
                }
            };
        })();

        RouteParamsMock = (function () {
            return {
                // Toteuta mockattu $routeParams-muuttuja tähän
                key: 'abc123'
            };
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
        expect(scope.name).toBe('The Matrix');
        expect(scope.director).toBe('The Wachowski Brothers');
        expect(scope.year).toBe(1999);
        expect(scope.description).toBe('A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.');
        expect(FirebaseServiceMock.getMovie).toHaveBeenCalled();
    });

    /* 
     * Testaa, että käyttäjä pystyy muokkaamaan elokuvaa, jos tiedot ovat oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta kutsutaan oikeaa funktiota,
     * käyttämällä toBeCalled-oletusta.
     */
    it('should be able to edit a movie by its name, director, release date and description', function () {
        scope.name = 'asd';
        scope.director = 'asd';
        scope.year = 1;
        scope.description = 'asd';
        scope.editMovie();
        expect(scope.movie.name).toBe('asd');
        expect(scope.movie.director).toBe('asd');
        expect(scope.movie.year).toBe(1);
        expect(scope.movie.description).toBe('asd');
        expect(FirebaseServiceMock.editMovie).toHaveBeenCalled();
    });

    /*
     * Testaa, ettei käyttäjä pysty muokkaaman elokuvaa, jos tiedot eivät ole oikeat
     * Testaa myös, että Firebasea käyttävästä palvelusta ei kutsuta muokkaus-funktiota,
     * käyttämällä not.toBeCalled-oletusta.
     */
    it('should not be able to edit a movie if its name, director, release date or description is empty', function () {
        scope.name = '';
        scope.editMovie();
        
        scope.year = null;
        scope.editMovie();
        
        scope.director = '';
        scope.editMovie();
        
        scope.description = '';
        scope.editMovie();

        expect(scope.movie.name).toBe('The Matrix');
        expect(scope.movie.year).toBe(1999);
        expect(scope.movie.director).toBe('The Wachowski Brothers');
        expect(scope.movie.description).toBe('A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.');
        expect(FirebaseServiceMock.editMovie).not.toHaveBeenCalled();
    });
});