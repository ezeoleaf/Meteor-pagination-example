Template.listCustomers.onCreated(function() {
  var template = this;
  this.selectedCategory = new ReactiveVar();

  template.autorun(function() {
    var skipCount = (currentPage() - 1) * Meteor.settings.public.recordsPerPage;
    template.subscribe('customers', skipCount, "startDate_sort", 1);
  });
});

Template.listCustomers.helpers({
  customers: function() {
    var category = Template.instance().selectedCategory.get();
    return Customers.find(category ? {studyField: category} : {});
  },
  pages: function() {

    var cur = currentPage();
    
    var pagess = [];
    var start;
    if(cur == 1 || cur == 2) {
      start = 1;
    } else if((cur + 5) > (Counts.get('customerCount') / Meteor.settings.public.recordsPerPage)) {
      start = (Counts.get('customerCount') / Meteor.settings.public.recordsPerPage) - 5;
    } else {
      start = cur - 2;
    }
    //return cur;
    
    for(var i = start; i <= (start + 4); i++) {
      var bool = (i == cur) ? true : false;
      var obj = {value:i,current: bool};
      pagess.push(obj);
    }


    return pagess;
    //return Counts.get('customerCount') / Meteor.settings.public.recordsPerPage;
    
  },
  page: function() {

    return currentPage(); 
  },
  prevPage: function() {
    var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
    return Router.routes.listCustomers.path({page: previousPage});
  },
  nextPage: function() {
    var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
    return Router.routes.listCustomers.path({page: nextPage});
  },
  prevPageClass: function() {
    return currentPage() <= 1 ? "disabled" : "";
  },
  nextPageClass: function() {
    return hasMorePages() ? "" : "disabled";
  },
  monthOptions: function() {
    var date = today();
    var currentMonth = date.getMonth() + 1;

    var months = [];
    var objMonths = [];

    months.push(currentMonth);

    for(var i = currentMonth + 1; i <= 12; i++) {
      months.push(i);
    }

    for(var i = 1; i < currentMonth; i++) {
      months.push(i);
    }


    for(var i = 0; i < months.length; i++) {
      var m = months[i];

      var objM = {
        name: getMonthName(m),
        value: m,
      };
      
      objMonths.push(objM);
    }

    return objMonths;
  }
});

Template.registerHelper('formatDate', function(date) {
	var fullDate = new Date(date);
	var day = fullDate.getDate();
	day = (day.toString().length == 1) ? "0"+day : day;
	var month = fullDate.getMonth() + 1;
	month = (month.toString().length == 1) ? "0"+month : month;
	var year = fullDate.getFullYear();
  return day+'/'+month+'/'+year;
});

Template.listCustomers.events({
  'change #select': function(e,t) {
    
    var currentTarget = e.currentTarget;
    var newValue = currentTarget.options[currentTarget.selectedIndex].value;
    t.selectedCategory.set('s1');
    //console.log(Customers.find({ studyField: 's1' }));
     //Customers.update(this._id, {$set: { studyField: 's1' }} ) ;
    //Tasks.update(this._id, {
      //$set: { checked: ! this.checked },
    //});
  }
});

var hasMorePages = function() {
  var totalCustomers = Counts.get('customerCount');
  return currentPage() * parseInt(Meteor.settings.public.recordsPerPage) < totalCustomers;
}

var currentPage = function() {
  return parseInt(Router.current().params.page) || 1; 
}

var today = function() {
  return new Date();
}

var getMonthName = function(monthNumber) {
  switch(monthNumber) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
  }
}