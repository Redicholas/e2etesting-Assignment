beforeEach(() => {
  cy.visit("/");
});

describe("Should show initial html elements", () => {
  
  it("should find the input", () => {
    cy.get("input").should("exist");
  });
  
  it("should find the button", () => {
    cy.get("button").contains("Sök").should("exist");
  });

});

describe("Should search correctly", () => {

  it("should search API for movies", () => {
    cy.get("input").type("matrix").should("have.value", "matrix");
    cy.get("button").contains("Sök").click();
    cy.get("h3:first").contains("Matrix").should("exist");
  });

  it("should request with correct url", () => {
    cy.intercept("GET", "http://omdbapi.com/*", 
    { fixture: "movies"}).as("moviesCall");
  
    cy.get("input").type("matrix").should("have.value", "matrix");
    cy.get("button").contains("Sök").click();
    cy.wait("@moviesCall").its("request.url").should("contain", "matrix");
  });

});

describe("Should show results", () => {
  
  it("should show movie title", () => {
    cy.intercept("GET", "http://omdbapi.com/*",
    { fixture: "movies" }).as("moviesCall");

    cy.get("input").type("matrix").should("have.value", "matrix");
    cy.get("button").contains("Sök").click();
    cy.wait("@moviesCall");
    cy.get("h3:first").contains("testMovie").should("exist");
  });

  it("should show movie poster", () => {
    cy.intercept("GET", "http://omdbapi.com/*",
    { fixture: "movies" }).as("moviesCall");

    cy.get("input").type("matrix").should("have.value", "matrix");
    cy.get("button").contains("Sök").click();
    cy.wait("@moviesCall");
    cy.get("img:first").should("exist");
  });

});

describe("Should handle errors", () => {

  it("should display no results for nonsense input", () => {
    cy.intercept("GET", "http://omdbapi.com/*",
    { fixture: "error" }).as("errorCall");

    cy.get("input").type("thismoviedoesnotexist").should("have.value", "thismoviedoesnotexist");
    cy.get("button").contains("Sök").click();
    cy.wait("@errorCall");
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });
  
  it("should display no results for empty input", () => {
    cy.intercept("GET", "http://omdbapi.com/*",
    { fixture: "error" }).as("errorCall");

    cy.get("input").type(" ").should("have.value", " ");
    cy.get("button").contains("Sök").click();
    cy.wait("@errorCall");
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });

  it("should display no results when request fails", () => {
    cy.intercept("GET", "http://omdbapi.com/*", 
    { fixture: "error" }).as("errorCall");

    cy.get("input").type("matrix").should("have.value", "matrix");
    cy.get("button").contains("Sök").click();
    cy.wait("@errorCall");
    cy.get("p").contains("Inga sökresultat att visa").should("exist");
  });

});

