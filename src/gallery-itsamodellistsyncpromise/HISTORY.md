gallery-itsamodellistsyncpromise
========

24-01-2014 - version 5
* added modellist.reload() and modellist.reloadPromise()

14-11-2013 - version 0.4:
* added addMessageTarget() to target sync-messages to Y.ITSAMessageViewer instances - see gallery-itsamessageviewer
* added setSyncMessage()

02-10-2013 - version 0.3:
* made all methods fire trully events that go through a defaultFn. Therefore are preventable and the 'on'-subscribers are executed before calling the synclayer.