describe('Books app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it("filters correctly", () => {
    cy.get('#name').type('d');
    cy.get('#genre').select('Fantasía');
    cy.get('#pages').invoke('val', 500).trigger('change');
    cy.get('main').get('img').should('have.length', 2);
    cy.get('main').find('img').should('have.attr', 'alt').should('include','El Señor de los Anillos');
  })
})