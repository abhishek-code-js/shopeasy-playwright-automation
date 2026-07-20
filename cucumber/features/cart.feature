Feature: Shopping Cart

  Background:
    Given I am logged in as "test@shopeasy.com" with password "Test@1234"
    And I am on the products page

  Scenario: Add a product to the cart
    When I add product with id 1 to the cart
    Then the cart count should be 1

  Scenario: Checkout clears the cart
    When I add product with id 1 to the cart
    And I navigate to the cart
    And I click the checkout button
    Then the cart should be empty