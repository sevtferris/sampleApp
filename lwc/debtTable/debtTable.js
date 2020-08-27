import { LightningElement, track } from 'lwc';
import getDebtData from '@salesforce/apex/DebtTableController.getDebtData'; 

export default class debtTable extends LightningElement {
    //-------------------- VARIABLES --------------------//
    dataTableColumns = [
        { label: 'Creditor', fieldName: 'creditorName'},
        { label: 'First Name', fieldName: 'firstName'},
        { label: 'Last Name', fieldName: 'lastName'},
        { label: 'Min Pay%', fieldName: 'minPaymentPercentage', type: 'percent', typeAttributes: {minimumFractionDigits: 2}},
        { label: 'Balance', fieldName: 'balance', type: 'currency',  cellAttributes: { alignment: 'right' }}
    ];
    @track debtData = [];
    @track selectedRows = [];
    @track maxId = 0;  // Used to store highest id so that we can increment from there for the id of any debt added via 'ADD DEBT' button
    @track totalDebt = 0;
    @track totalRowCount = 0;
    @track totalCheckedRowCount = 0;
    @track showAddDebtSection = false;
    
    // Variables used when adding new row
    @track creditorName = '';
    @track firstName = '';
    @track lastName = '';
    @track minPaymentPercentage = null;
    @track balance = null;
    

    //-------------------- EVENT HANDLERS --------------------//
    
   // global event method that gets called when component loads
   connectedCallback() {
        this.getData();
    }

    handleRemoveBtnClick() {
        var tempData = this.debtData;
        
        // We are looping backwards over the main data since we are removing data from the array as
        // we loop over it.  This will make sure we avoid null errors
        for (var i = tempData.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.selectedRows.length; j++) {
                if ( tempData[i].id == this.selectedRows[j].id) { 
                    tempData.splice(i, 1);  // remove element in array
                    break;
                }
            }
        }

        // We are stringifying and then parsing the data to get a clean version of the data and force the front end to update
        var jsonData = JSON.stringify(tempData);
        this.debtData = JSON.parse(jsonData);

        this.totalRowCount = this.debtData.length;
        this.updateBalance(this.selectedRows);
    }

    handleAddBtnClick() {
        // Clear any previous data out and show section for manual debt entry
        this.creditorName = '';
        this.firstName = '';
        this.lastName = '';
        this.minPaymentPercentage = null;
        this.balance = null;

        this.showAddDebtSection = true;
    }

    saveDebtAddition() {
        this.maxId++;
        
        // create object to add to debtData array
        var newData = {
            id: this.maxId,
            creditorName: this.creditorName,
            firstName: this.firstName,
            lastName: this.lastName,
            minPaymentPercentage: this.minPaymentPercentage,
            balance: this.balance
        }
        
        // Using Javascript spread operator to concatenate newData to debtData list.  
        // This was done to force the front end to notice the change and make the update to the front end.
        // Adding to the debtData array by the push method doesn't force any updates on the front end. 
        this.debtData = [...this.debtData ,newData ];  

        this.totalRowCount = this.debtData.length;
        this.hideAddDebtSection();
    }

    hideAddDebtSection() {
        this.showAddDebtSection = false;
    }

    handleRowSelection() {
        // Grab rows that have been selected, update checked row count and balance summary
        var dataTable = this.template.querySelector('lightning-datatable');
        this.selectedRows = dataTable.getSelectedRows();
        this.totalCheckedRowCount = this.selectedRows.length;
        this.updateBalance(this.selectedRows);
    }

    // The Following five methods are the onChange event handlers for the inputs that show up when 'ADD DEBT' button is click
    creditorValueUpdate(event) {
        this.creditorName = event.target.value;
    }
    fNameValueUpdate(event) {
        this.firstName = event.target.value;
    }
    lNameValueUpdate(event) {
        this.lastName = event.target.value;
    }
    minPayValueUpdate(event) {
        this.minPaymentPercentage = parseFloat(event.target.value);
    }
    balanceValueUpdate(event) {
        this.balance = parseFloat(event.target.value);
    }


    //-------------------- CLASS METHODS --------------------//

    // This method calls the controller method getDebtData in order to request data from endpoint
    getData() {
        getDebtData()
        .then(response => {
            if (response) {
                var tempData = JSON.parse(response);

                for (var i = 0; i < tempData.length; i++) {
                    tempData[i].minPaymentPercentage = tempData[i].minPaymentPercentage/100;
                    
                    // Set maxId value.  This will be used to set id for data being added when manually adding rows
                    if (tempData[i].id > this.maxId) {
                        this.maxId = tempData[i].id;
                    }
                }

                this.debtData = tempData;
                this.totalRowCount = this.debtData.length;
            } else {
                console.log('Error occurred while attempting to request data.');
            }
        })
        .catch(error => {
            var err = error.body != null ? error.body.message : error;
            console.log('Error occurred while attempting to request data.');
            console.log(err); 
        }); 
    }

    // This method will update the Total balance of selected rows
    updateBalance(selectedRows) {
        this.totalDebt = 0;
        for (var i = 0; i < selectedRows.length; i++) {
            this.totalDebt += selectedRows[i].balance;
        }
    }
   
}

