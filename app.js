
/****************UI Controlller******************/

var UIController = (function () {

    var Domstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentgeLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPerc: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber= function(num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, (int.length - 3)) + ',' + int.substr((int.length - 3), 3);
        }

        return (type === 'exp' ? '-' : '+') + ' '+ int +'.'+ dec;

    }

    var NodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
  
            return{
                getInput: function (){
                    return{
                        type : document.querySelector(Domstrings.inputType).value, //will be either inc or exp
                        description : document.querySelector(Domstrings.inputDescription).value,
                        value : parseFloat(document.querySelector(Domstrings.inputValue).value)
                    };
                    
                },

                addListItem: function(obj, type){
                    var html, newhtml, element;
                   //Create HTML strings with placholder text

                   if(type === 'inc'){
                       element = Domstrings.incomeContainer;

                       html = `<div class="item clearfix" id="inc-%id%">
                           <div class="item__description">%description%</div>
                           <div class="right clearfix">
                               <div class="item__value">%value%</div>
                               <div class="item__delete">
                                   <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                               </div>
                           </div>
                       </div>`;

                   }else if(type === 'exp'){
                       element = Domstrings.expensesContainer;
                       
                       html = `<div class="item clearfix" id = "exp-%id%" >
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value"></div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;

                   }
            
                   //Replace the placeholder text
                    newhtml = html.replace('%id%', obj.id);
                    newhtml = newhtml.replace('%description%', obj.description);
                    newhtml = newhtml.replace('%value%', formatNumber(obj.value, type));


                   //Insert HTML into the Dom
                    document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
                },

                deleteListItems: function(selectorID){

                    var el = document.getElementById(selectorID);
                    el.parentNode.removeChild(el);
                },

                clearFields: function(){
                    var fields, fieldsArr;

                    fields = document.querySelectorAll(Domstrings.inputDescription + ',' + Domstrings.inputValue);

                    fieldsArr = Array.prototype.slice.call(fields);

                    fieldsArr.forEach(function(current,index,Array){
                        current.value = '';
                    });

                    fieldsArr[0].focus();

                },


                displayBudget: function(obj){

                    obj.budget > 0? type = 'inc' : type = 'exp';

                    document.querySelector(Domstrings.budgetLabel).textContent =formatNumber(obj.budget, type);
                    document.querySelector(Domstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
                    document.querySelector(Domstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

                    if(obj.percentge > 0){
                        document.querySelector(Domstrings.percentgeLabel).textContent = obj.percentge + '%';
                    }else{
                        document.querySelector(Domstrings.percentgeLabel).textContent = '---';
                    }
                },

                displayPercentage: function(percentges){

                    var fields = document.querySelectorAll(Domstrings.expensesPerc);

                    NodeListForEach(fields, function(current, index){

                        if(percentges[index] > 0){
                            current.textContent = percentges[index] + '%';
                        }else{
                            current.textContent = '---'; 
                        }
                        
                    });
                },

                displayMonth: function(){

                    var now, year, monthNames, date;

                    now = new Date();

                    year = now.getFullYear();

                    month = now.getMonth();

                    monthNames = ['January','Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septermber', 'October', 'November',  'December'];

                    date = document.querySelectorAll(Domstrings.dateLabel);

                    NodeListForEach(date, function (current, index) {
                            current.textContent = monthNames[month] + ' ' + year;
                    });

                },

                changeType: function(){

                    var fields = document.querySelectorAll(
                        Domstrings.inputType + ',' +
                        Domstrings.inputDescription + ',' +
                        Domstrings.inputValue);

                    NodeListForEach(fields, function(cur){
                        cur.classList.toggle('red-focus');
                    });

                    document.querySelector(Domstrings.inputBtn).classList.toggle('red');
                },

                getDomstring: function () {
                    return Domstrings;
                }
            };
})();

/****************Data Controlller******************/

var DataController = (function(){

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentge = -1;
    }

    Expense.prototype.calculatePercentage = function(totalIncome){

        if(totalIncome > 0){
            this.percentge = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentge = -1;
        }
        
    }

    Expense.prototype.getPercentages = function(){
        return this.percentge;
    }

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum  += cur.value;
        });

        data.total[type] = sum;
    }

    var data ={
        allItems:{
            inc : [],
            exp : []
        },

        total: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentge: -1
    }

    return{
        addItems: function(type,des,val) {
            var newItems;
            
            //create a new id
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            //create new object for the data
            if(type === 'exp'){
                newItems = new Expense(ID,des,val);
            }else if(type === 'inc'){
                newItems = new Income(ID, des, val);   
            }

            //insert created object in the data varable
            data.allItems[type].push(newItems);

            //return the create object
            return newItems;
        },

        deletItem: function(type,id){
            var ids, index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function(){
            //calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');

            //calculate the budget: income - expenses
                data.budget = data.total.inc - data.total.exp;

            //calculate the percentge of the income we spent
            if(data.total.inc > 0){
                data.percentge = Math.round((data.total.exp / data.total.inc) * 100);
            }else{
                data.percentge = -1;
            }

        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calculatePercentage(data.total.inc);
            });
        },

        getPercentage: function(){

            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentages();
            });

            return allPerc;
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentge: data.percentge
            }
        },

        testing: function(){
            console.log(data);
        }
    }
})();

 /****************Controlller******************/

var Controller = (function (UICtrl,DataCtrl) {

    var setupEventListener = function() {
        var Dom = UICtrl.getDomstring();

        document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keycode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        
        document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(Dom.inputType).addEventListener('change', UICtrl.changeType);

    }

    var updateData = function(){

        // Calculate budget
            DataCtrl.calculateBudget();
        
        //Return budget
        var budget = DataCtrl.getBudget();  

        //Display the budget on the UI

        UICtrl.displayBudget(budget);

    };

        
    var updatePercentages = function(){
        var percentages;

        //Calculate percentages
        DataCtrl.calculatePercentages();

        //Read  percentages from the data controller
        percentages = DataCtrl.getPercentage();

        //Update the UI with the new percentages
        UICtrl.displayPercentage(percentages);

    };

    

    var ctrlAddItem = function () {

        var input, newItem;

        // Get the field input data
        input = UICtrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){


            // Add item to the data controller
            newItem = DataCtrl.addItems(input.type, input.description, input.value);

            // Add new item to user interface
            UICtrl.addListItem(newItem, input.type);

            //Clear the fields
            UICtrl.clearFields();

            //calculate and update budget
            updateData();

            //Calculate and Update percentages
            updatePercentages();

        }

    };


    var ctrlDeleteItem = function(event){
        var itemID, splitID,type,ID;

        input = UICtrl.getInput();

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){

            splitID =itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //Delete item from data structure
            DataCtrl.deletItem(type, ID);

            //Delete the item from th UI
            UICtrl.deleteListItems(itemID);

            //Update and show the new budget
            updateData();

            //Calculate and Update percentages
            updatePercentages();


        }

    };

    return{
        init: function() {
            console.log('Application is running');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentge: -1
            });
            setupEventListener();
        }
    }   

})(UIController,DataController);

Controller.init();


 