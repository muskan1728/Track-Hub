
// (async function (window, document) {

//     console.log("in tag manager")
//     var queryString = {};
//     let startTime;


//     let tagEvent = window.analytics?.credentials ? await fetchTagEvents(window.analytics.credentials) : Promise.resolve();
//     // let tagEvent = window.analytics?.[0].credentials ? await fetchTagEvents(JSON.parse(window.analytics[0].credentials).token) : Promise.resolve();
//     console.log('ana', window.analytics)

//     async function initializeEventHandling() {
//         const queryString = JSON.parse(localStorage.getItem("credentials")) || JSON.parse(window.analytics?.credentials);
//         // const queryString =  JSON.parse(localStorage.getItem("credentials")) ;
//         // const queryString =window.analytics?.[0].credentials;

//         let tagEvent = null;
//         startSession();
//         const sessionId = generateSessionId();
//         sessionStorage.setItem('sessionId', sessionId);
//         console.log('User connect and given id ', sessionId);

//         try {
//             // tagEvent = await fetchTagEvents(queryString);
//             tagEvent = await fetchTagEvents(queryString.token);
//             handleEvents(tagEvent);
//         } catch (error) {
//             console.error('Error initializing event handling:', error);
//         }
//     }

//     // USER SESSION
//     function generateSessionId() {
//         return crypto.randomUUID();
//     }
//     function startSession() {
//         if (sessionStorage.getItem('sessionStartTime')) {
//             startTime = new Date(sessionStorage.getItem('sessionStartTime'));
//         } else {
//             startTime = new Date();
//             sessionStorage.setItem('sessionStartTime', startTime.toISOString());
//         }

//     }
//     async function pushData(postData) {
//         try {
//             let queryString = JSON.parse(localStorage.getItem("credentials"));
//             // const queryString = JSON.parse(localStorage.getItem("credentials")) || JSON.parse(window.analytics?.credentials);
//             // const queryString =window.analytics?.[0].credentials;

//             const response = await fetch('http://127.0.0.1:5000/events', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${queryString.token}`,
//                     // 'Authorization': `Bearer ${queryString}`,
//                 },
//                 body: JSON.stringify(postData)
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');

//             }
//             const data = await response.json();
//             console.log(data);
//         }
//         catch (error) {
//             console.error('Error:', error);
//         }
//     }
//     function detect(condition) {
//         console.log("das", condition);
//         var element = condition.element;
//         var conditionValue = condition.condition;
//         var expectedValue = condition.value;

//         if (element === 'pageURL') {
//             var pathArray = window.location.pathname.split('/');
//             var element = "/" + pathArray[pathArray.length - 1]; // assuming 'part' is the second-to-last segment
//             if (element === expectedValue) {
//                 return true;
//             } else {
//                 return false;
//             }
//         }
//         return false;
//     }

//     function metCondition(conditions, target) {
//         const { condition, element, value } = conditions;

//         switch (element) {
//             case 'pageURL':
//                 const url = window.location.pathname;
//                 return url.includes(value)
//             default: return true;

//         }

//     }

//     // Function to fetch tag events
//     async function fetchTagEvents(token) {
//         try {
//             const response = await fetch(`http://127.0.0.1:5000/tag-events/`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
//             if (!response.ok) {
//                 throw new Error('Network response was not ok for fetching tagevents');

//             }
//             const data = await response.json();
//             console.log("tagdata", data);
//             return data;

//         }

//         catch (error) {
//             console.error('Error:', error);
//         }
//     }


//     function handleEvents(tagEvent) {


//         if (tagEvent) {
//             console.log("tagdata_", tagEvent, tagEvent?.domReady && 1)
//             tagEvent.domReady ? handleDOMReadyEvent(tagEvent.domReady) : '';

//             tagEvent.pageLoad ? handlePageLoadEvent(tagEvent.pageLoad) : '';

//             tagEvent.elementClick ? handleElementClickEvent(tagEvent.elementClick) : '';

//             tagEvent.pageScroll ? handlePageScrollEvent(tagEvent.pageScroll) : '';


//             tagEvent.elementVisible ? handleElementVisibleEvent(tagEvent.elementVisible) : '';

//             tagEvent.formSubmit ? handleFormSubmissionEvent(tagEvent.formSubmit) : ''

//             // TIMER
//             function triggerTimerEvent(time) {
//                 var t = {
//                     event: 'timer',
//                     'interval': time,
//                     'startTime': Date.now(),
//                 };
//                 console.log("dd", t)
//             }
//             let intervalId = null;
//             const startTimer = () => {
//                 intervalId = setInterval(() => {
//                     console.log('Timer triggered');
//                     postData = {
//                         event: 'Timer',
//                         value: 'any'
//                     }
//                     pushData(postData);
//                     tagEvent['Timer'].forEach(tag => {
//                         const interval = tag.data.interval;
//                         if (interval) {
//                             triggerTimerEvent(interval);

//                         }
//                     })
//                 }, 3000);
//             };
//             const stopTimer = () => {
//                 clearInterval(intervalId);
//             };
//             tagEvent?.Timer && startTimer();
//             // // Stop the timer after 10 seconds
//             // setTimeout(() => {
//             //     stopTimer();
//             // }, 10000);
//         }

//     }


//     // DOM REAdy
//     function handleDOMReadyEvent(tagEvent) {
//         function triggerDOMReadyEvent(target) {
//             var t = {
//                 event: 'domReady',
//                 'startTime': Date.now(),
//             }
//             console.log("DOM REAdy", t)
//         }
//         if (document.readyState === 'loading') {
//             window.addEventListener('DOMContentLoaded', function (event) {
//                 triggerDOMReadyEvent(event.target)
//                 postData = {
//                     event: 'DOMready',
//                     value: 'any'
//                 }
//                 pushData(postData);
//             });
//         }
//         // Check if the DOM is already loaded
//         if (tagEvent && (document.readyState === 'interactive' || document.readyState === 'complete')) {
//             triggerDOMReadyEvent(document);
//             postData = {
//                 event: 'DOMready',
//                 value: 'any'
//             }
//             pushData(postData);
//         }


//     }


//     // PAGE LOAD
//     function handlePageLoadEvent(tagEvent) {
//         function triggerLoadEvent(target) {
//             var t = {
//                 event: 'pageLoad',
//                 'pageURL': window.location.href,
//                 'referringSite': document.referrer ? document.referrer : '',
//                 'startTime': Date.now(),
//             }
//             console.log("PAGE LOAD", t)
//         }
//         window.addEventListener('load', function (event) {
//             var target = event.target;
//             postData = {
//                 event: 'pageLoad',
//                 value: '/'
//             }
//             triggerLoadEvent(target)
//             detect({ 'element': 'pageURL', 'condition': 'equals', 'value': '/welcome' }) ? pushData(postData) : {};
//         });

//     }

//     // CLICK ELEMENT
//     function handleElementClickEvent(tagEvent) {
//         function triggerClickEvent(target) {
//             var t = {
//                 event: 'elementClick',
//                 'clickElement': target.id,
//                 // 'clickElementId': TagManager.dom.getElementAttribute(target, 'id'),
//                 'clickElementClasses': String(target.className).replace(/\s{2,}/g, ' ').trim(),
//                 'clickText': target.innerText || target.textContent || '',
//                 'clickNodeName': target.nodeName,
//                 'clickElementUrl': target.href,
//                 'startTime': Date.now(),
//             };
//             console.log("CLICK ELEMENT", t, target)
//         }
//         document.addEventListener('click', function (event) {
//             var target = event.target;
//             // if (target.shadowRoot) {
//             //     var composedPath = event.composedPath();
//             //     if (composedPath.length) {
//             //         target = composedPath[0];
//             //     }
//             // }

//             tagEvent.forEach(async tag => {
//                 console.log("tag", tag)
//                 if (metCondition(tag.conditions, target)) {
//                     triggerClickEvent(target);
//                     console.log("tag_", tag.conditions.value)
//                     postData = {
//                         event: 'elementClick',
//                         value: tag.name
//                     }
//                     let t = await pushData(postData);
//                 }
//             });

//         });
//     }

//     // SCROLL EVENT
//     function handlePageScrollEvent(tagEvent) {
//         function triggerScrollEvent(e) {
//             var t = {
//                 event: 'pageScroll',
//                 'scrollTopPx': e.scrollTopPx,
//                 'scrollBottomPx': e.scrollBottomPx,
//                 'scrollVerticalPercentage': e.scrollVerticalPercentage,
//                 'scrollLeftPx': e.scrollLeftPx,
//                 'scrollRightPx': e.scrollRightPx,
//                 'scrollHorizontalPercentage': e.scrollHorizontalPercentage,
//                 'startTime': Date.now(),
//             };
//             console.log("SCROLL", t)
//         }
//         function debounce(func, delay) {
//             let timeout;
//             return function () {
//                 const context = this;
//                 const args = arguments;
//                 const later = function () {
//                     timeout = null;
//                     func.apply(context, args);
//                 };
//                 clearTimeout(timeout);
//                 timeout = setTimeout(later, delay);
//             };
//         }
//         function getScrollPercentages() {
//             const documentHeight = document.documentElement.scrollHeight;
//             const windowHeight = window.innerHeight;
//             const scrollTopPx = window.pageYOffset || window.scrollY;
//             const scrollBottomPx = documentHeight - windowHeight - scrollTopPx;
//             const scrollVerticalPercentage = parseFloat((scrollTopPx / (documentHeight - windowHeight)) * 100);

//             const documentWidth = document.documentElement.scrollWidth;
//             const windowWidth = window.innerWidth;
//             const scrollLeftPx = scrollX || window.pageXOffset;
//             const scrollRightPx = documentWidth - windowWidth - scrollLeftPx;
//             const scrollHorizontalPercentage = parseFloat((scrollLeftPx / (documentWidth - windowWidth)) * 100);

//             return {
//                 scrollTopPx,
//                 scrollBottomPx,
//                 scrollLeftPx,
//                 scrollRightPx,
//                 scrollVerticalPercentage,
//                 scrollHorizontalPercentage,
//             };
//         }
//         let scrolling = false;
//         window.addEventListener('scroll', debounce((event) => {
//             if (!scrolling) {
//                 scrolling = true;
//                 setTimeout(() => {
//                     scrolling = false;
//                 }, 100);
//                 postData = {
//                     event: 'pageScroll',
//                     value: 'any'
//                 }
//                 const scrollPercentage = getScrollPercentages();
//                 triggerScrollEvent(scrollPercentage)
//                 console.log("scrollpercentage", scrollPercentage)
//                 tagEvent.forEach(async tag => {
//                     if (tag.data && tag.data.threshold && tag.data.threshold < scrollPercentage.scrollVerticalPercentage) {
//                         pushData(postData);

//                     }

//                 })

//             }

//         }, 100), { capture: true });
//     }

//     // VISIBLE ELEMENT
//     function handleElementVisibleEvent(tagEvent) {
//         function triggerVisibleEvent(targetElement) {
//             var t = {
//                 event: 'elementVisible',
//                 'elementVisibilityElement': targetElement.nodeName,
//                 'elementVisibilityPercentage': targetElement.checkVisibility() ? "100%" : "0%",
//                 'elementVisibilityId': targetElement.id,
//                 'elementVisibilityClasses': targetElement.className,
//                 'elementVisibilityText': targetElement.textContent,
//                 'elementVisibilityNodeName': targetElement.nodeName,
//                 'startTime': Date.now(),
//             };
//             console.log("VISIBLE", t)
//         }
//         const observer = new MutationObserver(() => {


//             tagEvent.forEach(tag => {
//                 const selector = tag.data.selector
//                 console.log("element", tag)

//                 if (selector) {

//                     const targetElement = document.querySelector(selector)
//                     console.log("selector", targetElement)
//                     if (targetElement) {
//                         // observer.observe(targetElement,{ attributes: true });
//                         if (targetElement.offsetWidth > 0 || targetElement.offsetHeight > 0) {
//                             console.log("element visible")
//                             triggerVisibleEvent(targetElement)
//                             postData = {
//                                 event: 'elementVisible',
//                                 value: tag.name
//                             }
//                             pushData(postData);
//                         }
//                         observer.disconnect();

//                     }
//                 }

//             })



//         });
//         observer.observe(document.documentElement, { childList: true, subtree: true });

//     }

//     // FORM SUBMIT
//     function handleFormSubmissionEvent(tagEvent){
//         function triggerFormSubmitEvent(targetElement) {
//             var t = {
//                 event: 'formSubmit',
//                 'formData': targetElement.fields,
//                 'formID': targetElement.id,
//                 'startTime': Date.now(),
//             };
//             console.log("FORM", t)
//         }
//         const observer1 = new MutationObserver(() => {
//             const forms = document.querySelectorAll('form');
//             console.log(forms, "form")
//             if (forms && tagEvent?.formSubmit) {
//                 // observer1.disconnect(); // disconnect the correct observer
//                 for (const form of forms) {
//                     form.addEventListener('submit', (event) => {
//                         // Prevent the form from submitting normally
//                         event.preventDefault();

//                         // Do something when the form is submitted
//                         const fieldValues = {};
//                         for (const field of form.elements) {
//                             if (field.name && !field.disabled) {
//                                 fieldValues[field.name] = field.value;
//                             }
//                         }
//                         triggerFormSubmitEvent({ id: form.id, fields: fieldValues });
//                         console.log(`Form with ID ${form.id} was submitted.`, form.id);
//                         postData = {
//                             event: 'formSubmit',
//                             value: 'any'
//                         }
//                         pushData(postData);

//                     });
//                 }

//                 observer1.disconnect();
//             }

//         });
//         observer1.observe(document.documentElement, { childList: true, subtree: true });

//     }

//     // handleEvents()

//     // window.onload = function (event) {
//     //     console.log('User connect and given id ', sessionId);
//     // }

//     function closeSession() {
//         const endTime = new Date();
//         sessionStorage.setItem('sessionEndTime', endTime.toISOString());

//         const duration = new Date() - startTime;
//         const minutes = Math.floor(duration / 60000);
//         const seconds = Math.floor((duration % 60000) / 1000);
//         console.log(`User session duration: ${minutes} minute(s) and ${seconds} second(s)`);
//         const sessionData = {
//             startTime: startTime.toISOString(),
//             endTime: sessionStorage.getItem('sessionEndTime'),
//             duration: duration,
//         };
//         // pushData(sessionData);

//     }
//     window.onbeforeunload = () => {
//         const endTime = new Date();
//         console.log("User is leaving the page or closing the browser");
//         queryString = JSON.parse(localStorage.getItem("credentials"));
//         if (queryString == null) {
//             closeSession();
//             sessionStorage.removeItem('sessionStartTime');
//             sessionStorage.removeItem('sessionEndTime');
//             sessionStorage.removeItem('sessionId');
//         }
//         // closeSession()
//     };


//     window.addEventListener('storageChanged', async function (event) {
//         queryString = JSON.parse(localStorage.getItem("credentials"));
//         window.removeAllListeners()
// // 
//         if (queryString == null) {
//             console.log("user cre",queryString)

//             closeSession();

//             sessionStorage.removeItem('sessionStartTime');
//             sessionStorage.removeItem('sessionEndTime');
//             sessionStorage.removeItem('sessionId');
//         }


//         // console.log("localStorage", queryString)
//         // tagEvent = await fetchTagEvents(queryString.token);
//         // handleEvents(tagEvent);

//     });

//     initializeEventHandling()


// })(window, document);


(async function (window, document) {
    console.log("in tag manager")
    var queryString = {};
    let startTime;
    let tagEvent = window.analytics?.credentials ? await fetchTagEvents(window.analytics.credentials) : Promise.resolve();
    // let tagEvent = window.analytics?.[0].credentials ? await fetchTagEvents(JSON.parse(window.analytics[0].credentials).token) : Promise.resolve();
    console.log('ana', window.analytics)
    var TagManager = {
        dom: {
            getElementAttribute: function (node, attributeName) {
                if (!node || !attributeName) {
                    return;
                }

                // If the attribute is one of the restricted attributes and belongs to a masked element, return a masked string.
                var attr = attributeName.toLowerCase();
                if ((attr === 'value' || attr === 'title' || attr === 'alt' || attr === 'label' || attr === 'placeholder')) {
                    return '*******';
                }

                if (node && node.getAttribute) {
                    return node.getAttribute(attributeName);
                }

                if (!node || !node.attributes) {
                    return;
                }

                var typeOfAttr = (typeof node.attributes[attributeName]);
                if ('undefined' === typeOfAttr) {
                    return null;
                }

                if (node.attributes[attributeName].value) {
                    return node.attributes[attributeName].value; // nodeValue is deprecated ie Chrome
                }

                if (node.attributes[attributeName].nodeValue) {
                    return node.attributes[attributeName].nodeValue;
                }
                return null;
            },
            addEventListener: function (element, eventType, eventHandler, useCapture) {
                if (!element) {
                    console.log('element not found, cannot add event listener', element, this);

                    return;
                }
                if (element.addEventListener) {
                    useCapture = useCapture || false;
                    element.addEventListener(eventType, eventHandler, useCapture);

                    return true;
                }

                if (element.attachEvent) {
                    return element.attachEvent('on' + eventType, eventHandler);
                }

                element['on' + eventType] = eventHandler;
            },
            onReady: function (callback) {
                var loaded = false;
                if (document.attachEvent) {
                    loaded = document.readyState === 'complete';
                } else {
                    loaded = document.readyState !== 'loading';
                }

                if (loaded) {
                    callback();
                    return;
                }

                if (document.addEventListener) {
                    this.addEventListener(document, 'DOMContentLoaded', function ready() {
                        document.removeEventListener('DOMContentLoaded', ready, false);
                        if (!loaded) {
                            loaded = true;
                            callback();
                        }
                    });
                } else if (document.attachEvent) {
                    document.attachEvent('onreadystatechange', function ready() {
                        if (document.readyState === 'complete') {
                            document.detachEvent('onreadystatechange', ready);
                            if (!loaded) {
                                loaded = true;
                                callback();
                            }
                        }
                    });
                }

                // fallback
                this.onLoad(function () {
                    if (!loaded) {
                        loaded = true;
                        callback();
                    }
                });
            },
        },
        url: {
            parseUrl: function (urlToParse, urlPart) {
                try {
                    var loc = document.createElement("a");
                    loc.href = urlToParse;
                    var absUrl = loc.href;

                    // needed to make tests work in IE10... we first need to convert URL to abs url
                    loc = document.createElement("a");
                    loc.href = absUrl;

                    if (urlPart && urlPart in loc) {
                        if ('hash' === urlPart) {
                            return String(loc[urlPart]).replace('#', '');
                        } else if ('protocol' === urlPart) {
                            return String(loc[urlPart]).replace(':', '');
                        } else if ('search' === urlPart) {
                            return String(loc[urlPart]).replace('?', '');
                        } else if ('port' === urlPart && !loc[urlPart]) {
                            if (loc.protocol === 'https:') {
                                return '443';
                            } else if (loc.protocol === 'http:') {
                                return '80';
                            }
                        }

                        if ('pathname' === urlPart && loc[urlPart] && String(loc[urlPart]).substr(0, 1) !== '/') {
                            return '/' + loc[urlPart]; // ie 10 doesn't return leading slash when not added to the dom
                        }

                        if ('port' === urlPart && loc[urlPart]) {
                            return String(loc[urlPart]); // ie 10 returns int
                        }

                        return loc[urlPart];
                    }

                    if ('origin' === urlPart && 'protocol' in loc && loc.protocol) {
                        // fix for ie10
                        return loc.protocol + "//" + loc.hostname + (loc.port ? ':' + loc.port : '');
                    }
                    return;
                } catch (e) {
                    if ('function' === typeof URL) {
                        var theUrl = new URL(urlToParse);
                        if (urlPart && urlPart in theUrl) {
                            if ('hash' === urlPart) {
                                return String(theUrl[urlPart]).replace('#', '');
                            } else if ('protocol' === urlPart) {
                                return String(theUrl[urlPart]).replace(':', '');
                            } else if ('search' === urlPart) {
                                return String(theUrl[urlPart]).replace('?', '');
                            } else if ('port' === urlPart && !theUrl[urlPart]) {
                                if (theUrl.protocol === 'https:') {
                                    return '443';
                                } else if (theUrl.protocol === 'http:') {
                                    return '80';
                                }
                            }
                            return theUrl[urlPart];
                        }
                        return;
                    }
                }

            }
        },
        utils:{
            isFunction: function (property) {
                return typeof property === 'function';
            },
            setMethodWrapIfNeeded: function (contextObject, methodNameToReplace, callback)
                {
                    if (!(methodNameToReplace in contextObject)) {
                        contextObject[methodNameToReplace] = callback;
                        return;
                    }

                    var oldMethodBackup = contextObject[methodNameToReplace];

                    if (!TagManager.utils.isFunction(oldMethodBackup)) {
                        contextObject[methodNameToReplace] = callback;
                        return;
                    }

                    try {
                        contextObject[methodNameToReplace] = function() {
                            try {
                                var value = oldMethodBackup.apply(contextObject, [].slice.call(arguments, 0));
                            } catch (e) {
                                callback.apply(contextObject, [].slice.call(arguments, 0));
                                throw e;
                            }
                            callback.apply(contextObject, [].slice.call(arguments, 0));
                            return value;
                        };
                    } catch (error) {

                    }
                }
        }
    }

    async function initializeEventHandling() {
        // const queryString = JSON.parse(localStorage.getItem("credentials")) || JSON.parse(window.analytics?.credentials);
        // const queryString =  JSON.parse(localStorage.getItem("credentials")) ;
        const queryString = window.analytics?.[0].credentials;

        let tagEvent = null;
        startSession();
        const sessionId = generateSessionId();
        sessionStorage.setItem('sessionId', sessionId);
        console.log('User connect and given id ', sessionId);

        try {
            tagEvent = await fetchTagEvents(queryString);
            // tagEvent = await fetchTagEvents(queryString.token);
            handleEvents(tagEvent);
        } catch (error) {
            console.error('Error initializing event handling:', error);
        }
    }

    // USER SESSION
    function generateSessionId() {
        return crypto.randomUUID();
    }
    function startSession() {
        if (sessionStorage.getItem('sessionStartTime')) {
            startTime = new Date(sessionStorage.getItem('sessionStartTime'));
        } else {
            startTime = new Date();
            sessionStorage.setItem('sessionStartTime', startTime.toISOString());
        }

    }
    async function pushData(postData) {
        try {
            // let queryString = JSON.parse(localStorage.getItem("credentials"));
            // const queryString = JSON.parse(localStorage.getItem("credentials")) || JSON.parse(window.analytics?.credentials);
            const queryString = window.analytics?.[0].credentials;

            const response = await fetch('http://127.0.0.1:5000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${queryString.token}`,
                    'Authorization': `Bearer ${queryString}`,
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');

            }
            const data = await response.json();
            console.log(data);
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    function detect(condition) {
        console.log("das", condition);
        var element = condition.element;
        var conditionValue = condition.condition;
        var expectedValue = condition.value;

        if (element === 'pageURL') {
            var pathArray = window.location.pathname.split('/');
            var element = "/" + pathArray[pathArray.length - 1]; // assuming 'part' is the second-to-last segment
            if (element === expectedValue) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    function metCondition(conditions, target) {
        const { condition, element, value } = conditions;
        console.log("target1", target.textContent, value)

        switch (element) {
            case 'pageURL':
                const url = window.location.pathname;
                return url.includes(value)
            case 'element_class':
                const className = target.className;
                return className.includes(value)
            case "element_text":
                const textContent = target?.textContent
                console.log("selector1", textContent == value)
                return textContent == value
            default: return true;

        }

    }

    // Function to fetch tag events
    async function fetchTagEvents(token) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/tag-events/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok for fetching tagevents');

            }
            const data = await response.json();
            console.log("tagdata", data);
            return data;

        }

        catch (error) {
            console.error('Error:', error);
        }
    }


    function handleEvents(tagEvent) {



        if (tagEvent) {
            console.log("tagdata_", tagEvent, tagEvent?.domReady && 1)

            tagEvent.pageLoad ? handlePageLoadEvent(tagEvent.pageLoad) : '';

            tagEvent.elementClick ? handleElementClickEvent(tagEvent.elementClick) : '';

            tagEvent.pageScroll ? handlePageScrollEvent(tagEvent.pageScroll) : '';

            tagEvent.domReady ? handleDOMReadyEvent(tagEvent.domReady) : '';

            tagEvent.elementVisible ? handleElementVisibleEvent(tagEvent.elementVisible) : '';

            tagEvent.linkClick ? handleLinkClickEvent(tagEvent.linkClick) : '';

            tagEvent.downloadClick ? handleDownloadClickEvent(tagEvent.downloadClick) : '';

            tagEvent.fullScreen ? handleFullScreenEvent(tagEvent.fullScreen) : '';

            tagEvent.historyChange ? handleHistoryChangeEvent(tagEvent.historyChange) : '';

            tagEvent.windowLeave ? handleWindowLeaveEvent(tagEvent.windowLeave) : '';

            tagEvent.pageUnload ? handlePageUnloadEvent(tagEvent.pageUnload) : '';


            // FORM SUBMIT
            function triggerFormSubmitEvent(targetElement) {
                var t = {
                    event: 'formSubmit',
                    'formData': targetElement.fields,
                    'formID': targetElement.id,
                    'startTime': Date.now(),
                };
                console.log("FORM", t)
            }
            const observer1 = new MutationObserver(() => {
                const forms = document.querySelectorAll('form');
                console.log(forms, "form")
                if (forms && tagEvent?.formSubmit) {
                    // observer1.disconnect(); // disconnect the correct observer
                    for (const form of forms) {
                        form.addEventListener('submit', (event) => {
                            // Prevent the form from submitting normally
                            event.preventDefault();

                            // Do something when the form is submitted
                            const fieldValues = {};
                            for (const field of form.elements) {
                                if (field.name && !field.disabled) {
                                    fieldValues[field.name] = field.value;
                                }
                            }
                            triggerFormSubmitEvent({ id: form.id, fields: fieldValues });
                            console.log(`Form with ID ${form.id} was submitted.`, form.id);
                            postData = {
                                event: 'formSubmit',
                                value: 'any'
                            }
                            pushData(postData);

                        });
                    }
                }

            });
            observer1.observe(document.documentElement, { childList: true, subtree: true });
            // TIMER
            function triggerTimerEvent(time) {
                var t = {
                    event: 'timer',
                    'interval': time,
                    'startTime': Date.now(),
                };
                console.log("dd", t)
            }
            let intervalId = null;
            const startTimer = () => {
                intervalId = setInterval(() => {
                    console.log('Timer triggered');
                    postData = {
                        event: 'Timer',
                        value: 'any'
                    }
                    pushData(postData);
                    tagEvent['Timer'].forEach(tag => {
                        const interval = tag.data.interval;
                        if (interval) {
                            triggerTimerEvent(interval);

                        }
                    })
                }, 3000);
            };
            const stopTimer = () => {
                clearInterval(intervalId);
            };
            tagEvent?.Timer && startTimer();
            // // Stop the timer after 10 seconds
            // setTimeout(() => {
            //     stopTimer();
            // }, 10000);
        }

    }


    // DOM REAdy
    function handleDOMReadyEvent(tagEvent) {
        function triggerDOMReadyEvent(target) {
            var t = {
                event: 'domReady',
                'startTime': Date.now(),
            }
            console.log("DOM REAdy", t)
        }
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', function (event) {
                triggerDOMReadyEvent(event.target)
                postData = {
                    event: 'DOMready',
                    value: 'any'
                }
                pushData(postData);
            });
        }
        // Check if the DOM is already loaded
        if (tagEvent && (document.readyState === 'interactive' || document.readyState === 'complete')) {
            triggerDOMReadyEvent(document);
            postData = {
                event: 'DOMready',
                value: 'any'
            }
            pushData(postData);
        }


    }


    // PAGE LOAD
    function handlePageLoadEvent(tagEvent) {
        function triggerLoadEvent(target) {
            var t = {
                event: 'pageLoad',
                'pageURL': window.location.href,
                'referringSite': document.referrer ? document.referrer : '',
                'startTime': Date.now(),
            }
            console.log("PAGE LOAD", t)
        }
        window.addEventListener('load', function (event) {
            var target = event.target;
            postData = {
                event: 'pageLoad',
                value: '/'
            }
            triggerLoadEvent(target)
            pushData(postData);

            // detect({ 'element': 'pageURL', 'condition': 'equals', 'value': '/welcome' }) ? pushData(postData) : {};
        });

    }

    // CLICK ELEMENT
    function handleElementClickEvent(tagEvent) {
        function triggerClickEvent(target) {
            var t = {
                event: 'elementClick',
                'clickElement': target.id,
                // 'clickElementId': TagManager.dom.getElementAttribute(target, 'id'),
                'clickElementClasses': String(target.className).replace(/\s{2,}/g, ' ').trim(),
                'clickText': target.innerText || target.textContent || '',
                'clickNodeName': target.nodeName,
                'clickElementUrl': target.href,
                'startTime': Date.now(),
            };
            console.log("CLICK ELEMENT", t, target)
        }
        document.addEventListener('click', function (event) {
            var target = event.target;
            // if (target.shadowRoot) {
            //     var composedPath = event.composedPath();
            //     if (composedPath.length) {
            //         target = composedPath[0];
            //     }
            // }

            tagEvent.forEach(async tag => {
                console.log("tag", tag)
                if (metCondition(tag.conditions, target)) {
                    triggerClickEvent(target);
                    console.log("tag_", tag.conditions.value)
                    postData = {
                        event: 'elementClick',
                        value: tag.name
                    }
                    let t = await pushData(postData);
                }
            });

        });
    }

    // SCROLL EVENT
    function handlePageScrollEvent(tagEvent) {
        function triggerScrollEvent(e) {
            var t = {
                event: 'pageScroll',
                'scrollTopPx': e.scrollTopPx,
                'scrollBottomPx': e.scrollBottomPx,
                'scrollVerticalPercentage': e.scrollVerticalPercentage,
                'scrollLeftPx': e.scrollLeftPx,
                'scrollRightPx': e.scrollRightPx,
                'scrollHorizontalPercentage': e.scrollHorizontalPercentage,
                'startTime': Date.now(),
            };
            console.log("SCROLL", t)
        }
        function debounce(func, delay) {
            let timeout;
            return function () {
                const context = this;
                const args = arguments;
                const later = function () {
                    timeout = null;
                    func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, delay);
            };
        }
        function getScrollPercentages() {
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollTopPx = window.pageYOffset || window.scrollY;
            const scrollBottomPx = documentHeight - windowHeight - scrollTopPx;
            const scrollVerticalPercentage = parseFloat((scrollTopPx / (documentHeight - windowHeight)) * 100);

            const documentWidth = document.documentElement.scrollWidth;
            const windowWidth = window.innerWidth;
            const scrollLeftPx = scrollX || window.pageXOffset;
            const scrollRightPx = documentWidth - windowWidth - scrollLeftPx;
            const scrollHorizontalPercentage = parseFloat((scrollLeftPx / (documentWidth - windowWidth)) * 100);

            return {
                scrollTopPx,
                scrollBottomPx,
                scrollLeftPx,
                scrollRightPx,
                scrollVerticalPercentage,
                scrollHorizontalPercentage,
            };
        }
        let scrolling = false;
        window.addEventListener('scroll', debounce((event) => {
            if (!scrolling) {
                scrolling = true;
                setTimeout(() => {
                    scrolling = false;
                }, 100);
                postData = {
                    event: 'pageScroll',
                    value: 'any'
                }
                const scrollPercentage = getScrollPercentages();
                triggerScrollEvent(scrollPercentage)
                console.log("scrollpercentage", scrollPercentage)
                tagEvent.forEach(async tag => {
                    if (tag.data && tag.data.threshold && tag.data.threshold < scrollPercentage.scrollVerticalPercentage) {
                        pushData(postData);

                    }

                })

            }

        }, 100), { capture: true });
    }

    // VISIBLE ELEMENT
    function handleElementVisibleEvent(tagEvent) {
        function triggerVisibleEvent(targetElement) {
            var t = {
                event: 'elementVisible',
                'elementVisibilityElement': targetElement.nodeName,
                'elementVisibilityPercentage': targetElement.checkVisibility() ? "100%" : "0%",
                'elementVisibilityId': targetElement.id,
                'elementVisibilityClasses': targetElement.className,
                'elementVisibilityText': targetElement.textContent,
                'elementVisibilityNodeName': targetElement.nodeName,
                'startTime': Date.now(),
            };
            console.log("VISIBLE", t)
        }
        const observer = new MutationObserver(() => {


            tagEvent.forEach(tag => {
                const selector = tag.data.selector
                // console.log("element1", tag,selector)

                if (selector) {

                    const targetElements = document.querySelectorAll(selector)
                    if (targetElements) {
                        targetElements.forEach(targetElement => {
                            // console.log("selector", targetElement.textContent)

                            if (metCondition(tag.conditions, targetElement) && targetElement.offsetWidth > 0 || targetElement.offsetHeight > 0) {

                                console.log("element visible")
                                triggerVisibleEvent(targetElement)
                                postData = {
                                    event: 'elementVisible',
                                    value: tag.name
                                }
                                pushData(postData);
                                observer.disconnect();

                            }
                        });

                    }

                }

            })



        });
        observer.observe(document.documentElement, { childList: true, subtree: true });

    }

    // LINK CLICK
    function handleLinkClickEvent(tagEvent) {
        function triggerClickLinkEvent(target) {
            var t = {
                event: 'linkClick',
                'clickElement': target.id,
                // 'clickElementId': TagManager.dom.getElementAttribute(target, 'id'),
                'clickElementClasses': String(target.className).replace(/\s{2,}/g, ' ').trim(),
                'clickText': target.innerText || target.textContent || '',
                'clickNodeName': target.nodeName,
                'clickElementUrl': target.href,
                'startTime': Date.now(),
            };
            console.log("CLICK LINK ELEMENT", t, target)
        }
        function isClickNode(nodeName) {
            return nodeName === 'A' || nodeName === 'AREA';
        }
        document.addEventListener('click', function (event) {
            var target = event.target;
            var nodeName = target.nodeName;
            while (!isClickNode(nodeName) && target && target.parentNode) {
                target = target.parentNode;
                nodeName = target.nodeName;
            }
            tagEvent.forEach(async tag => {
                console.log("tag", tag)
                if (metCondition(tag.conditions, target) && isClickNode(nodeName)) {
                    triggerClickLinkEvent(target);
                    console.log("tag_", tag.conditions.value)
                    postData = {
                        event: 'linkClick',
                        value: target.innerText || target.textContent || ''
                    }
                    let t = await pushData(postData);
                }
            });

        });
    }

    // DOWNLOAD CLICK
    function handleDownloadClickEvent(tagEvent) {
        function triggerDownloadClickEvent(target) {
            var t = {
                event: 'downloadClick',
                'clickElement': target.id,
                // 'clickElementId': TagManager.dom.getElementAttribute(target, 'id'),
                'clickElementClasses': String(target.className).replace(/\s{2,}/g, ' ').trim(),
                'clickText': target.innerText || target.textContent || '',
                'clickNodeName': target.nodeName,
                'clickElementUrl': target.href,
                'startTime': Date.now(),
            };
            console.log("DOWNLOAD CLICK", t, target)
        }
        function isClickNode(nodeName) {
            return nodeName === 'A' || nodeName === 'AREA';
        }
        document.addEventListener('click', function (event) {
            var target = event.target;
            var nodeName = target.nodeName;
            while (!isClickNode(nodeName) && target && target.parentNode) {
                target = target.parentNode;
                nodeName = target.nodeName;
            }
            extensions = "7z,aac,apk,arc,arj,asf,asx,avi,azw3,bin,csv,deb,dmg,doc,docx,epub,exe,flv,gif,gz,gzip,hqx,ibooks,jar,jpg,jpeg,js,mobi,mp2,mp3,mp4,mpg,mpeg,mov,movie,msi,msp,odb,odf,odg,ods,odt,ogg,ogv,pdf,phps,png,ppt,pptx,qt,qtm,ra,ram,rar,rpm,sea,sit,tar,tbz,tbz2,bz,bz2,tgz,torrent,txt,wav,wma,wmv,wpd,xls,xlsx,xml,z,zip";
            extensions = String(extensions).split(',');
            var i;
            for (i = 0; i < extensions.length; i++) {
                var text = extensions[i];
                if (text && String(text) === text) {
                    extensions[i] = text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
                }
            }
            tagEvent.forEach(async tag => {
                if (isClickNode(nodeName)) {
                    var link = TagManager.dom.getElementAttribute(target, 'href');

                    var downloadExtensionsPattern = new RegExp('\\.(' + extensions.join('|') + ')([?&#]|$)', 'i');
                    if (downloadExtensionsPattern.test(link)) {
                        triggerDownloadClickEvent(target);
                        console.log("tag_", tag.conditions.value)
                        postData = {
                            event: 'downloadClick',
                            value: tag.name
                        }
                        let t = await pushData(postData);
                    }

                }
            });

        });
    }

    // FULLSCREEN
    function handleFullScreenEvent(tagEvent) {
        function triggerFullScreenEvent(target) {
            var t = {
                event: 'fullScreen',
                'fullscreenAction': target,
            }
            console.log("FULLSCREEN ", target)
        }
        var numTriggers = 0;
        var events = ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'MSFullscreenChange'];
        async function onFullScreen() {
            var limit = 0;

            if (limit) {
                limit = parseInt(limit, 10);
            }

            if (limit && limit <= numTriggers) {
                return;
            }

            var docAlias = document;

            var triggerAction = "any";
            var isFullscreen = docAlias.fullScreen || docAlias.webkitIsFullScreen || docAlias.mozFullScreen || docAlias.msFullscreenElement;
            if (isFullscreen && (triggerAction === 'any' || triggerAction === 'enter')) {
                triggerFullScreenEvent('enter');
                numTriggers++;
                var postData = {
                    event: 'fullScreen',
                    value: 'enter'
                }
                let t = await pushData(postData);
            } else if (!isFullscreen && (triggerAction === 'any' || triggerAction === 'exit')) {
                numTriggers++;
                triggerFullScreenEvent('exit');
                var postData = {
                    event: 'fullScreen',
                    value: 'exit'
                }
                let t = await pushData(postData);

            }
        }
        for (var i = 0; i < events.length; i++) {
            TagManager.dom.addEventListener(document, events[i], onFullScreen);
        }

    }

    // HISTORY CHANGE
    function handleHistoryChangeEvent(tagEvent) {
        function triggerHistoryChangeEvent(target) {
            var t = {
                event: 'historyChange',
                'historyChangeSource': {target},
                'oldUrl':{target},
                'newUrl':{target},

            }
            console.log("HISTORY CHANGE ", t,target)
        }
        function getCurrentUrl() {
            return window.location.href;
        }
        function getEventUrl(event) {
            if (event && event.target && event.target.location && event.target.location.href) {
                return event.target.location.href;
            }
            return getCurrentUrl();
        }

        var initialUrl = getCurrentUrl();
        var url = TagManager.url;
        var origin = url.parseUrl(initialUrl, 'origin');
        var lastEvent = {
            eventType: null,
            hash: url.parseUrl(initialUrl, 'hash'),
            search: url.parseUrl(initialUrl, 'search'),
            path: url.parseUrl(initialUrl, 'pathname'),
            state: window.state || null
        };
        async function trigger(eventType, newUrl, newState) {
            var newEvent = {
                eventType: eventType,
                hash: url.parseUrl(newUrl, 'hash'),
                search: url.parseUrl(newUrl, 'search'),
                path: url.parseUrl(newUrl, 'pathname'),
                state: newState
            };

            var shouldForceEvent = (lastEvent.eventType === 'popstate' && newEvent.eventType === 'hashchange') || (lastEvent.eventType === 'hashchange' && newEvent.eventType === 'popstate') || (lastEvent.eventType === 'hashchange' && newEvent.eventType === 'hashchange') || (lastEvent.eventType === 'popstate' && newEvent.eventType === 'popstate');
            shouldForceEvent = !shouldForceEvent;

            var oldUrl = lastEvent.path;
            if (lastEvent.search) {
                oldUrl += '?' + lastEvent.search;
            }
            if (lastEvent.hash) {
                oldUrl += '#' + lastEvent.hash;
            }
            var nowUrl = newEvent.path;
            if (newEvent.search) {
                nowUrl += '?' + newEvent.search;
            }
            if (newEvent.hash) {
                nowUrl += '#' + newEvent.hash;
            }
            if (shouldForceEvent || oldUrl !== nowUrl) {
                var tmpLast = lastEvent;
                lastEvent = newEvent; // overwrite as early as possible in case event gets triggered again
                triggerHistoryChangeEvent({
                    'historyChangeSource': newEvent.eventType,
                    'oldUrl': origin + oldUrl, 
                    'newUrl': origin + nowUrl,
                   
                })
                postData = {
                    event: 'historyChange',
                    value:origin + nowUrl
                }
                let t = await pushData(postData);

            }
        }
        function replaceHistoryMethod(methodNameToReplace) {
            TagManager.utils.setMethodWrapIfNeeded(window.history, methodNameToReplace, function (state, title, urlParam) {
                trigger(methodNameToReplace, getCurrentUrl(), state);
            });
        }
        replaceHistoryMethod('replaceState');
        replaceHistoryMethod('pushState');
        TagManager.dom.addEventListener(window, 'hashchange', function (event) {
            var newUrl = getEventUrl(event);
            trigger('hashchange', newUrl, null);
        }, false);
        TagManager.dom.addEventListener(window, 'popstate', function (event) {
            var newUrl = getEventUrl(event);
            trigger('popstate', newUrl, event.state);
        }, false);




    }

    // WINDOW LEAVE
    function handleWindowLeaveEvent(tagEvent){
        var numTriggers = 0;
        TagManager.dom.onReady(function () {

            if (!document.documentElement) {
                return;
            }

            var timerInCaseReturns;

            function cancelTimer()
            {
                if (timerInCaseReturns) {
                    clearTimeout(timerInCaseReturns);
                    timerInCaseReturns = null;
                }
            }

            TagManager.dom.addEventListener(document.documentElement, 'mouseleave', function (event) {
                if ('undefined' === typeof event.clientY) {
                    return;
                }
                if (event.clientY > 3) {
                    return;
                }

                if (timerInCaseReturns) {
                    cancelTimer();
                    return;
                }
                var timerDelay = 50;

                timerInCaseReturns = setTimeout(async function () {
                    var limit = 5;

                    if (limit) {
                        limit = parseInt(limit, 10);
                    }

                    if (limit && limit <= numTriggers) {
                        return;
                    }

                    numTriggers++;
                    postData = {
                        event: 'windowLeave',
                        value:""
                    }
                    let t = await pushData(postData);
                    // triggerEvent({event: 'WindowLeave'});
                }, timerDelay);
            });

            TagManager.dom.addEventListener(document.documentElement, 'mouseenter', cancelTimer);

        });

      
        
    }

    // PAGE UNLOAD
    function handlePageUnloadEvent(tagEvent){
        var triggered = false;
            TagManager.dom.addEventListener(window, 'beforeunload',async function () {
                if (triggered) {
                    return;
                }
                triggered = true;
                postData = {
                    event: 'pageUnload',
                    value:""
                }
                let t = await pushData(postData);
                // triggerEvent({event: 'WindowUnload'});
            });
    }

    // handleEvents()

    // window.onload = function (event) {
    //     console.log('User connect and given id ', sessionId);
    // }

    function closeSession() {
        sessionStorage.setItem('sessionEndTime', endTime.toISOString());
        const duration = new Date() - startTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        console.log(`User session duration: ${minutes} minute(s) and ${seconds} second(s)`);
        const sessionData = {
            startTime: startTime.toISOString(),
            endTime: sessionStorage.getItem('sessionEndTime'),
            duration: duration,
        };
        pushData(sessionData);

    }
    window.onbeforeunload = () => {
        const endTime = new Date();
        console.log("User is leaving the page or closing the browser");
        queryString = JSON.parse(localStorage.getItem("credentials"));
        // if (queryString == null) {
        //     closeSession();
        //     sessionStorage.removeItem('sessionStartTime');
        //     sessionStorage.removeItem('sessionEndTime');
        //     sessionStorage.removeItem('sessionId');
        // }
        closeSession()
    };


    window.addEventListener('storageChanged', async function (event) {
        queryString = JSON.parse(localStorage.getItem("credentials"));
        console.log("user cre", queryString)
        if (queryString == null) {
            closeSession();
            sessionStorage.removeItem('sessionStartTime');
            sessionStorage.removeItem('sessionEndTime');
            sessionStorage.removeItem('sessionId');
        }


        // console.log("localStorage", queryString)
        // tagEvent = await fetchTagEvents(queryString.token);
        // handleEvents(tagEvent);

    });

    initializeEventHandling()


})(window, document);

