describe('Languages CRUD flow', () => {
  it('adds, edits and deletes languages', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('#email').type('testuser@example.com')
    cy.get('#password').type('StrongPassword123!')

    cy.get('form').submit()

    cy.url().should('not.include', '/login')

    cy.visit('http://localhost:3000/languages')

    const languages = [
      { name: 'Russian', level: 'B2' },
      { name: 'English', level: 'A1' },
      { name: 'German', level: 'C2' },
    ]

    languages.forEach((lang) => {
      cy.contains('ADD SKILLS').click()

      cy.get('select[name="language"]').select(lang.name)
      cy.get('select[name="profeciency"]').select(lang.level)

      cy.get('form')
        .contains(/save|add|confirm/i)
        .click()

      cy.get('[role="dialog"]').should('not.exist')
    })

    cy.contains('English').click()
    cy.contains(/edit language/i)
    cy.get('select[name="proficiency"]').select('B2')

    cy.get('form')
      .contains(/save|confirm/i)
      .click()

    cy.get('[role="dialog"]').should('not.exist')

    cy.contains(/REMOVE SKILLS/i).click()

    cy.contains('German').click()
    cy.contains(/confirm/i).click()

    cy.contains('German').should('not.exist')
  })
})
