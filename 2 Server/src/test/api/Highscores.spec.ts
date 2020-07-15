const axios = require('axios').default;

axios.get('http://localhost:8787/Highscores')
  .then(function (res: any) {
      for(let item of res.data) {
          console.log(item);
          //TODO Jest test: does item have userName, difficulty...
      }
  })
  .catch(function (error: Error) {
    //console.log(error);
    console.log("There was an error!");
  })
  .finally(function () {
    //
  });

//TODO: Jest test axios.post, axios.put ...
