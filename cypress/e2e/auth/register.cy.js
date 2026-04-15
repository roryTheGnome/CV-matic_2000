describe('Register flow', () => {
  it('should allow a user to create an account', () => {
    cy.visit('http://localhost:3000/register')

    cy.get('#email').should('be.visible').type('testuser@examples.com')
    cy.get('#password').should('be.visible').type('StrongPassword123!')

    cy.get('form').submit()

    cy.url().should('not.include', '/register')
  })
})
