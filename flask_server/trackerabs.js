
    (function (window, document) {
        function pushData(postData){
             fetch('http://127.0.0.1:5000/events',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(postData)
        }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
        }
        function detect(condition){
            console.log("das",condition);
            var element = condition.element;
            var conditionValue = condition.condition;
            var expectedValue = condition.value;

            if (element === 'pageURL') {
                var pathArray = window.location.pathname.split('/');
                var element = "/"+pathArray[pathArray.length - 1 ]; // assuming 'part' is the second-to-last segment
                if (element === expectedValue) {
                return true;
                } else {
                    return false;
                }
            }
            return false;
        }
        
        
       
    })(window, document);
    