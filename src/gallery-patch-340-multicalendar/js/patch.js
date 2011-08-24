Y.CalendarBase.prototype.initializer = function () {
  this._paneProperties = {};
  this._calendarId = Y.guid('calendar');
  this._selectedDates = {};
  this._rules = {};
  this.storedDateCells = {};
};