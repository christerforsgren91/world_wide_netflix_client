describe('Visitor can see top 100 movies', () => {
  describe('successfully', () => {
    before(() => {
      cy.intercept(
        'GET',
        'https://worldwidenetflix.herokuapp.com/api/movies/?lat=55.7842&lon=12.4518',
        {
          fixture: 'top100Movies.json',
        }
      );
    });

    it('is expected to show a list of top 100 global movies', () => {
      cy.visit('/', {
        onBeforeLoad(window) {
          const stubLocation = {
            coords: {
              latitude: 55.7842,
              longitude: 12.4518,
            },
          };
          cy.stub(window.navigator.geolocation, 'getCurrentPosition').callsFake(
            (callback) => {
              return callback(stubLocation);
            }
          );
        },
      });
      cy.get('[data-cy=movie-container]').find('img').should('have.length', 100);
      cy.get('[data-cy=movie-container]').within(() => {
        cy.get('[data-cy=movie-0]').within(() => {
          cy.get('[data-cy=title-header]').should(
            'contain',
            'The Shawshank Redemption'
          );
        });
      });
    });
  });

  describe('unsuccessfully', () => {
    before(() => {
      cy.intercept(
        'GET',
        'https://worldwidenetflix.herokuapp.com/api/movies/?lat=55.7842&lon=12.4518',
        {
          statusCode: 500,
          error: '500 Internal Server Error |  0     bytes\n',
        }
      );
    });

    it('is expected to give http error 500', () => {
      cy.visit('/', {
        onBeforeLoad(window) {
          const stubLocation = {
            coords: {
              latitude: 55.7842,
              longitude: 12.4518,
            },
          };
          cy.stub(window.navigator.geolocation, 'getCurrentPosition').callsFake(
            (callback) => {
              return callback(stubLocation);
            }
          );
        },
      });
      cy.get('[data-cy=error-message]').should(
        'contain',
        'Please try again later, our servers are currently not responding'
      );
    });
  });
});
