describe('Login flow', () => {
  it('should log in an existing user', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('#email').should('be.visible').type('testuser@example.com')
    cy.get('#password').should('be.visible').type('StrongPassword123!')

    cy.get('form').submit()

    cy.url().should('not.include', '/login')
  })
})
