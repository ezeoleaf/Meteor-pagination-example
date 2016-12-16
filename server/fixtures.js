// Fixture data
Meteor.startup(function() {
	if (Customers.find().count() !== 1001) {

		Customers.remove({});
		for(var i = 1; i < 1001; i++) {
			var randVal = Math.round((Math.random() * 6) + 1);
			var studyFieldValue = 's'+randVal;
			var actualDate = new Date();
			var newDate = actualDate.setDate(actualDate.getDate() + (Math.round(Math.random() * 366)));

			var newObj = {
				startDate: newDate,
				studyField: studyFieldValue
			}
			
			Customers.insert(newObj);
		}
	}
});