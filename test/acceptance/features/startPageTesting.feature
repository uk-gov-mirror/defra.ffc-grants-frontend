Feature: Test start page

    Scenario: Open start page

        Given I open the url "/start"
        Then I expect that element "h1" contains the text "Check if you can apply for a Farming Transformation Fund water grant"
        When I click on the link "Start now"
        Then I expect that the url contains "/farming-type"
