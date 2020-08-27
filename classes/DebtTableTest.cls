@isTest
public class DebtTableTest {

    @isTest 
    static void getDebtDataTest() {
        // Set mock callout class 
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

        String responseData = DebtTableController.getDebtData();
        System.assert(responseData.contains('creditorName'));
    }
}
