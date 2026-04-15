describe('Users navigation flow', () => {
  it('goes to user profile -> skills -> languages', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('#email').type('testuser@example.com')
    cy.get('#password').type('StrongPassword123!')
    cy.get('form').submit()

    cy.url().should('not.include', '/login')

    cy.visit('http://localhost:3000/users')

    cy.get('tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0)

    cy.get('tbody tr')
      .first()
      .within(() => {
        cy.get('a').click()
      })

    cy.url().should('match', /\/users\/\d+/)

    cy.url().then((url) => {
      const userId = url.split('/').pop()

      cy.visit(`http://localhost:3000/users/${userId}/skills`)
      cy.url().should('include', '/skills')

      cy.contains(/skills/i)

      cy.visit(`http://localhost:3000/users/${userId}/languages`)
      cy.url().should('include', '/languages')

      cy.contains(/language/i)
    })
  })
})
