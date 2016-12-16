// Fixture data
Meteor.startup(function() {
	if (Studies.find().count() !== 1001) {

		Studies.remove({});
		for(var i = 1; i < 1001; i++) {
			var randVal = Math.round((Math.random() * 6) + 1);
			var studyFieldValue = 's'+randVal;
			var actualDate = new Date();
			var newDate = actualDate.setDate(actualDate.getDate() + (Math.round(Math.random() * 366)));

			var newObj = {
				startDate: newDate,
				studyField: studyFieldValue
			}
			
			Studies.insert(newObj);
		}
	}
});