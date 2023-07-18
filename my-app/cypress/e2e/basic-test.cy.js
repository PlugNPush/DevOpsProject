describe('Test Connexion site', () => {
  it('Check Home Page', () => {
    cy.visit('https://plugnpush.github.io/DevOpsProject/')
    cy.get('#bIns').contains("Connexion")
    cy.get('#APPNAME').should("contain","KWITTER")
  })
})