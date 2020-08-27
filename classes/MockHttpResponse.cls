@isTest
global class MockHttpResponse implements HttpCalloutMock {

    global HTTPResponse respond(HTTPRequest req) {
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('[{"id": 1,"creditorName": "CBNA","firstName": "Tester","lastName": "Person1","minPaymentPercentage": 2.00,"balance": 1363.00},{"id": 2,"creditorName": "AMEX","firstName": "Tester","lastName": "Person2","minPaymentPercentage": 2.00,"balance": 2763.00}]');
        res.setStatusCode(200);
        return res;
    }
}
