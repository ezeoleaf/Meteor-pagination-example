Template.listStudies.onCreated(function() {
  var template = this;
  this.selectedMonth = new ReactiveVar();
  this.selectedFields = new ReactiveVar();
  this.selectedFields.set([]);

  template.autorun(function() {
    var skipCount = (currentPage() - 1) * Meteor.settings.public.recordsPerPage;
    template.subscribe('studies', skipCount, "startDate_sort", 1);
  });
});

Template.listStudies.helpers({
  studies: function() {
    var month = Template.instance().selectedMonth.get();
    var fields = Template.instance().selectedFields.get();

    var queryFields = [];
    //console.log(fields.length);
    for(var i = 0; i < fields.length; i++) {
      var obj = {
        studyField: fields[i]
      };

      queryFields.push(obj);
    }

    var queryObj = {};

    //Create the query object
    if(queryFields.length > 0) {
      queryObj.$or = queryFields;
    }

    if(month != undefined && month != -1) {
      queryObj.$where = function() { return this.startDate.getMonth() == month}
    }

    return Studies.find(queryObj ? queryObj : {});
  },

  pages: function() {

    if(Counts.get('studiesCount') <= 20) {
      return [];
    }

    var cur = currentPage();
    
    var pagess = [];
    var start;
    if(cur == 1 || cur == 2) {
      start = 1;
    } else if((cur + 5) > parseInt(Counts.get('studiesCount') / Meteor.settings.public.recordsPerPage)) {
      start = parseInt(Counts.get('studiesCount') / Meteor.settings.public.recordsPerPage) - 4;
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
    return Router.routes.listStudies.path({page: previousPage});
  },
  nextPage: function() {
    var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
    return Router.routes.listStudies.path({page: nextPage});
  },
  prevPageClass: function() {
    return currentPage() <= 1 ? "disabled" : "";
  },
  nextPageClass: function() {
    return hasMorePages() ? "" : "disabled";
  },
  firstPage: function() {
    return Router.routes.listStudies.path({page: 1});
  },
  lastPage: function() {
    return Router.routes.listStudies.path({page: parseInt(Counts.get('studiesCount') / Meteor.settings.public.recordsPerPage)});
  },
  firstPageClass: function() {
    return currentPage() <= 1 ? "disabled" : "";
  },
  lastPageClass: function() {
    return hasMorePages() ? "" : "disabled";
  },
  show: function() {
    return (Counts.get('studiesCount') <= 20) ? 'display: none' :'';
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

Template.listStudies.events({
  'change #select': function(e,t) {
    
    var currentTarget = e.currentTarget;
    var newValue = currentTarget.options[currentTarget.selectedIndex].value;
    t.selectedMonth.set((newValue -1));
  },

  'change .check' : function(e,t) {
    var currentChecks = Template.instance().selectedFields.get();
    var currentTarget = e.currentTarget;
    var newValue = currentTarget.value;

    if(currentChecks.indexOf(newValue) == -1) {
      currentChecks.push(newValue);
    } else {
      currentChecks.splice(currentChecks.indexOf(newValue),1);
    }

    t.selectedFields.set(currentChecks);
    //console.log(t);
    //t.view._render()
    //t.view.template.renderFunction()[2]._render()
    //t._reload.reload();
  }
});

var hasMorePages = function() {
  var totalStudies = Counts.get('studiesCount');
  return currentPage() * parseInt(Meteor.settings.public.recordsPerPage) < totalStudies;
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