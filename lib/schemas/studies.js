Studies.attachSchema(new SimpleSchema({
  startDate: {
    type: Date
  },

  startDate_sort: {
    type: Date,
    optional: true,
    autoValue: function() {
      var date = this.field("startDate");
      if (date.isSet) {
        return date.value;
      } else {
        this.unset(); // Prevent user from supplying her own value
      }
    }
  },
 
  studyField: {
    type: String
  },

  studyField_sort: {
    type: String,
    optional: true,
    autoValue: function() {
      var studyField = this.field("studyField");
      if (studyField.isSet) {
        return studyField.value.toLowerCase();
      } else {
        this.unset(); // Prevent user from supplying her own value
      }
    }
  },
}));