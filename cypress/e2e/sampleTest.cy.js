describe('Sample Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.contains('Welcome to Cypress Testing').should('be.visible');
  });
});
