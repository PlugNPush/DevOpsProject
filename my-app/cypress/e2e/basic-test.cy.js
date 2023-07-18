describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://plugnpush.github.io/DevOpsProject/')
    cy.get('#bIns').contains("Connexion")
    cy.get('#APPNAME').should("contain","KWITTER")
  })
})