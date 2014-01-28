gallery-itsamodelsyncpromise
========

24-01-2014
* added intl property 'update' and 'reload'

14-11-2013 - version 0.4:
* added addMessageTarget() to target sync-messages to Y.ITSAMessageViewer instances - see gallery-itsamessageviewer
* added setSyncMessage()

25-09-2013 - version 0.3:
* removed submitPromise() --> is available in Y.ITSAFormModel now
* made load(), save() and destroy() fire trully events that go through a defaultFn. Therefore are preventable and the 'on'-subscribers are executed before calling the synclayer.