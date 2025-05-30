import Quiz from "../../client/src/components/Quiz";
import questionsData from "../fixtures/questions.json";

describe("Quiz Component", () => {
  beforeEach(() => {
    // Mock the API call
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: questionsData,
    }).as("getQuestions");
  });

  it("should display the start button initially", () => {
    cy.mount(<Quiz />);
    cy.get("button").contains("Start Quiz").should("be.visible");
  });

  it("should start the quiz when start button is clicked", () => {
    cy.mount(<Quiz />);

    // Click start button
    cy.get("button").contains("Start Quiz").click();

    // Wait for API call
    cy.wait("@getQuestions");

    // Check that first question is displayed
    cy.contains(questionsData[0].question).should("be.visible");

    // Check that all answer buttons are displayed
    cy.get("button").should("have.length", 4);
  });

  it("should navigate through questions when answers are clicked", () => {
    cy.mount(<Quiz />);

    // Start quiz
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // Answer first question
    cy.contains(questionsData[0].question).should("be.visible");
    cy.get("button").first().click();

    // Check second question appears
    cy.contains(questionsData[1].question).should("be.visible");

    // Answer second question
    cy.get("button").first().click();

    // Check third question appears
    cy.contains(questionsData[2].question).should("be.visible");
  });

  it("should show quiz completion and score after all questions", () => {
    cy.mount(<Quiz />);

    // Start quiz
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // Answer all questions (clicking correct answers)
    // Question 1 - correct answer is index 1 (8)
    cy.get("button").eq(1).click();

    // Question 2 - correct answer is index 2 (list)
    cy.get("button").eq(2).click();

    // Question 3 - correct answer is index 2 (def)
    cy.get("button").eq(2).click();

    // Check completion screen
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score: 3/3").should("be.visible");
    cy.get("button").contains("Take New Quiz").should("be.visible");
  });

  it('should restart quiz when "Take New Quiz" is clicked', () => {
    cy.mount(<Quiz />);

    // Complete a quiz
    cy.get("button").contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // Answer all questions quickly
    for (let i = 0; i < 3; i++) {
      cy.get("button").first().click();
    }

    // Click Take New Quiz
    cy.get("button").contains("Take New Quiz").click();
    cy.wait("@getQuestions");

    // Verify quiz restarted with first question
    cy.contains(questionsData[0].question).should("be.visible");
  });
});
