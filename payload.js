var payload=[
    {
        event: 'pageLoad',
        'pageURL': String,
        'referringSite': String,
        'startTime': Date.now(),
    },
    {
        event: 'domReady',
        'startTime': Date.now(),
    },
    {
        event: 'elementClick',
        'clickElement': String,
        'clickElementClasses':String,
        'clickText': String,
        'clickNodeName': String,
        'clickElementUrl': String,
        'startTime': Date.now(),
    },
    {
        event: 'pageScroll',
        'scrollTopPx': Float,
        'scrollBottomPx': Float,
        'scrollVerticalPercentage': Float,
        'scrollLeftPx': Float,
        'scrollRightPx': Float,
        'scrollHorizontalPercentage': Float,
        'startTime': Date.now(),
    },
    {
        event: 'elementVisible',
        'elementVisibilityElement': String,
        'elementVisibilityPercentage': String,
        'elementVisibilityId': String,
        'elementVisibilityClasses': String,
        'elementVisibilityText': String,
        'elementVisibilityNodeName': String,
        'startTime': Date.now(),
    },
    {
        event: 'formSubmit',
        'formData': JSON.stringify(targetElement.fields),
        'formID': String,
        'startTime': Date.now(),
    },
    {
        event: 'timer',
        'interval': INT,
        'startTime': Date.now(),
    }



]