Feature: User Login
 As a registered User
 I want to log in to Shopeasy
 So that I can browse products and place orders

Background: 
 Given I am on the login page

 Scenario: Succesful login with valid credentials
 When I enter email "test@shopeasy.com" and password "Test@1234"
 And I click the Sign In button
 Then I should see "Login successful"
 And I should be redirected to the products page

 Scenario: Login fails with wrong password
    When I enter email "test@shopeasy.com" and password "wrongpass"
    And I click the Sign In button
    Then I should see "Invalid email or password"


Scenario Outline: Multiple invalid inputs
    When I enter email "<email>" and password "<password>"
    And I click the Sign In button
    Then I should see "<message>"

    Examples:
      | email              | password  | message                   |
      | test@shopeasy.com  | wrong123  | Invalid email or password |
      | nobody@user.com    | Test@1234 | Invalid email or password |

