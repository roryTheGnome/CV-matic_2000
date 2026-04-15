describe('Edit profile - change first name', () => {
  it('updates first name successfully', () => {

    cy.visit('http://localhost:3000/login')

    cy.get('#email').type('testuser@example.com')
    cy.get('#password').type('StrongPassword123!')
    cy.get('form').submit()

    cy.url().should('not.include', '/login')

    cy.visit('http://localhost:3000/users/620')

    cy.get('#first_name').should('be.visible').clear().type('E2E Test')

    cy.contains('button', /save/i).click()
    cy.get('#first_name').should('have.value', 'E2E Test')
  })
})
