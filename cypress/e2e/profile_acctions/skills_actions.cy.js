describe('Skills CRUD flow', () => {
  it('adds, edits and deletes skills', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('#email').type('testuser@example.com')
    cy.get('#password').type('StrongPassword123!')
    cy.get('form').submit()

    cy.url().should('not.include', '/login')

    cy.visit('http://localhost:3000/skills')

    cy.contains(/add skills/i).click()

    cy.get('select').first().select('JavaScript')
    cy.get('select').last().select('Expert')

    cy.get('form')
      .contains(/save|add|confirm/i)
      .click()

    cy.get('[role="dialog"]').should('not.exist')

    cy.contains(/remove skills/i).click()
    cy.contains('JavaScript').click()
    cy.contains(/confirm/i).click()

    cy.contains('JavaScript').should('not.exist')
  })
})
