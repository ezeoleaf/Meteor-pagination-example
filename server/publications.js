Meteor.publish('studies', function(skipCount,sortField, sortDirection) {
	Meteor._sleepForMs(1000);
  var positiveIntegerCheck = Match.Where(function(x) {
    check(x, Match.Integer);
    return x >= 0;
  });
  check(skipCount, positiveIntegerCheck);

  Counts.publish(this, 'studiesCount', Studies.find(), { 
    noReady: true
  });
  
  var sortParams = {};
  sortParams[sortField] = sortDirection;
  return Studies.find({}, {
    limit: parseInt(Meteor.settings.public.recordsPerPage),
    skip: skipCount,
    sort: sortParams
  });
});