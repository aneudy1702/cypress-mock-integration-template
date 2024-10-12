describe('Login Flow', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/');

    // Load the fixture data for all tests
    cy.fixture('loginResponses').as('loginData');
  });

  it('should successfully log in with correct credentials', function () {
    // Intercept the API call and use the fixture data for a successful response
    cy.intercept('POST', '/api/login', this.loginData.success).as('loginRequest');

    // Fill in the login form and submit
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for the intercepted request and assert behavior
    cy.wait('@loginRequest').then((interception) => {
      // Verify the intercepted request payload
      expect(interception.request.body).to.deep.equal({
        username: 'testuser',
        password: 'password123',
      });
    });

    // Assert the alert for successful login
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Login successful!');
    });
  });

  it('should show an error message with incorrect credentials', function () {
    // Intercept the API call and use the fixture data for a 401 response
    cy.intercept('POST', '/api/login', this.loginData.invalidCredentials).as('loginRequest');

    // Fill in the login form with wrong credentials and submit
    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Wait for the intercepted request and assert behavior
    cy.wait('@loginRequest').then((interception) => {
      // Verify the intercepted request payload
      expect(interception.request.body).to.deep.equal({
        username: 'wronguser',
        password: 'wrongpassword',
      });
    });

    // Assert the alert for failed login
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Login failed!');
    });
  });

  it('should handle a server error gracefully', function () {
    // Intercept the API call and use the fixture data for a 500 error
    cy.intercept('POST', '/api/login', this.loginData.serverError).as('loginRequest');

    // Fill in the login form and submit
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for the intercepted request and assert behavior
    cy.wait('@loginRequest').then((interception) => {
      // Verify the intercepted request payload
      expect(interception.request.body).to.deep.equal({
        username: 'testuser',
        password: 'password123',
      });
    });

    // Assert the alert for server error
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Login failed!');
    });
  });

  it('should display a loading state during a delayed response', function () {
    // Intercept the API call and simulate a delayed response
    cy.intercept('POST', '/api/login', (req) => {
      req.reply((res) => {
        res.delay = 3000; // Delay the response by 3 seconds
        res.send(this.loginData.success);
      });
    }).as('loginRequest');

    // Fill in the login form and submit
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for the loading indicator to appear, but explicitly wait before checking
    cy.wait(500); // Wait 500 milliseconds before checking for the loading indicator
    cy.get('.loading-indicator').should('be.visible');

    // Wait for the intercepted request
    cy.wait('@loginRequest');

    // Assert the alert for successful login
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Login successful!');
    });

    // Ensure the loading indicator disappears after the response
    cy.get('.loading-indicator').should('not.be.visible');
  });
});
