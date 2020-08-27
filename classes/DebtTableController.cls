public class DebtTableController {
    public static final String url = 'https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json';
   
    /*
        DESCRIPTION: This method is used by the debtTable LWC to request data from the endpoint
        RETURNS: Response body from request
    */
    @AuraEnabled
    public static String getDebtData() {
        return getResponse(url);
    }

     /*
        DESCRIPTION: This method is used to make HTTP call to endpoint specified by strURL parameter
        RETURNS: Response body from request
    */
    public static string getResponse(String strURL) {
		Http h = new Http();
		HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
		req.setMethod('GET');
		req.setEndpoint(strURL);
        req.setTimeout(120000);
        res = h.send(req); 
        String responseBody = res.getBody(); 
        
		return responseBody;
    }
}
